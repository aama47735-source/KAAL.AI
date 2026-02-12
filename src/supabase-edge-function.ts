// =====================================================
// SUPABASE EDGE FUNCTION: gemini-proxy
// Centralized API Key - All users share one key
// =====================================================
// 
// DEPLOYMENT INSTRUCTIONS:
// 1. Install Supabase CLI: npm install -g supabase
// 2. Login: supabase login
// 3. Link project: supabase link --project-ref YOUR_PROJECT_ID
// 4. Set secret: supabase secrets set GEMINI_API_KEY=AIzaSyAJTB8Xhp_XDJ3UcO4jYTzYtmgBDqi479Y
// 5. Create function: supabase functions new gemini-proxy
// 6. Copy this code to: supabase/functions/gemini-proxy/index.ts
// 7. Deploy: supabase functions deploy gemini-proxy
// 
// =====================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get auth token from request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Verify user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get centralized API key from environment
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'AI service not configured. Please contact support.',
          needsSetup: true 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get request body
    const { prompt } = await req.json()

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Missing prompt' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Call Gemini API with centralized key
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    })

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error('Gemini API error:', errorText)
      
      return new Response(
        JSON.stringify({ 
          error: 'AI service temporarily unavailable', 
          details: errorText,
          status: geminiResponse.status 
        }),
        { status: geminiResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const geminiData = await geminiResponse.json()
    const responseText = geminiData.candidates[0].content.parts[0].text

    // Log usage for monitoring (optional)
    await supabaseClient
      .from('ai_usage_logs')
      .insert({
        user_id: user.id,
        model: 'gemini-2.0-flash-exp',
        tokens_estimated: prompt.length + responseText.length,
        created_at: new Date().toISOString()
      })
      .catch(err => console.warn('Failed to log usage:', err))

    return new Response(
      JSON.stringify({ 
        success: true, 
        response: responseText,
        model: 'gemini-2.0-flash-exp'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
