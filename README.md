
# KAAL - Executive Function AI Assistant ⚡

> Your productivity companion for deep work sessions. Built for the elite 1% who demand precision and clarity.

![KAAL Dashboard](figma:asset/f45979a34fdfdcc06d484e4b68c890e127739408.png)

## 🎯 Overview

KAAL is a comprehensive productivity platform that serves as an **executive function AI assistant** for deep work sessions. It combines intelligent task management, focus tracking, AI-powered insights, and advanced analytics to help high-performers achieve peak productivity.

**Hackathon**: SAI University FOSS Club Hackathon 2026  
**Team**: JAIRAM  
**Developer**: Akulapalli Jayaram

---

## ✨ Key Features

### 🧠 AI-Powered Executive Function

- **Gemini AI Integration**: Centralized AI architecture with Edge Function proxy
- **Smart Task Prioritization**: Intelligent suggestions based on your work patterns
- **Context-Aware Assistance**: AI understands your workflow and provides relevant insights

### ⏱️ Deep Work Focus System

- **Pomodoro Timer**: Customizable focus sessions with break management
- **Distraction Detection**: Real-time alerts when context switching is detected
- **Energy Level Tracking**: Monitor and optimize your cognitive energy throughout the day

### 📊 Advanced Analytics

![Analytics Dashboard](figma:asset/2072587eb584c83da07a8eb239ecd860206c0ab4.png)

- **Focus Trend Analysis**: Visualize deep work vs shallow work patterns
- **Performance Metrics**: Track completion rates, productivity scores, and time allocation
- **Interruption Sources**: Identify and minimize distractions
- **Weekly Insights**: Comprehensive productivity reports with AI-generated recommendations

### ✅ Intelligent Task Management

- **Smart Categories**: Focus, Work, Personal, Meeting, Break
- **Real-time CRUD Operations**: Instant task updates with Supabase sync
- **Priority Matrix**: Eisenhower-style prioritization
- **Subtasks & Dependencies**: Break down complex projects

### 📅 Calendar & Time Blocking

- **Visual Timeline**: See your day at a glance
- **Time Block Scheduling**: Allocate focused time for important work
- **Meeting Integration**: Track team standups and appointments

### 🌟 Additional Features

- **Daily Checkout**: End-of-day reflection and planning
- **Energy Hub**: Manage your cognitive resources
- **Backlog Management**: Capture ideas for later
- **Reminders System**: Never miss important tasks
- **Settings & Customization**: Personalize your experience

---

## 🎨 Design System

KAAL features a sophisticated **neutral color scheme** with premium glass morphism effects:

### Color Palette

- **Primary**: `#111827` (Dark Charcoal) - Buttons, headings, primary actions
- **Secondary**: `#6B7280` (Medium Gray) - Secondary text, labels
- **Background**: `#F8F9FA` (Light Gray) - Main canvas
- **Surface**: `#FFFFFF` (White) - Cards and elevated surfaces

### Typography

- **Display Font**: Noto Sans Display (Bold, Black weights)
- **Body Font**: Noto Sans (Regular, Medium, Semibold)
- **Serif Font**: Noto Serif (For emphasis and quotes)
- **Mono Font**: Noto Sans Mono (For technical text)

### Design Principles

- **Glass Morphism**: Subtle backdrop blur effects with transparency
- **Staggered Animations**: Smooth entrance animations for UI elements
- **Consistent Spacing**: 4px base unit scaling (4, 8, 12, 16, 24, 32, 48px)
- **Accessibility**: WCAG 2.1 AA compliance with enhanced focus states
- **Responsive**: Mobile-first design with breakpoints at 768px and 1024px

---

## 🔐 Authentication

### Sign In

![Sign In Screen](figma:asset/7509cf51e078b366fbc91922dfc1ef1cd6ec2b47.png)

- Email/Password authentication
- OAuth integration (Google, Apple)
- Password reset functionality
- Remember me option

### Sign Up

![Sign Up Screen](figma:asset/c532151846568c56aa1b1d56e423ead7eb6b2a8d.png)

- Simple onboarding flow
- Social sign-up options
- Terms & Privacy Policy acceptance
- Email verification

---

## 🏗️ Architecture

### Tech Stack

**Frontend**

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7 (Data Mode)
- **State Management**: Context API (Settings, Profile, Tasks)
- **Animations**: Motion (Framer Motion)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast library)

**Backend**

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime subscriptions
- **Storage**: Supabase Storage (for future file uploads)
- **Edge Functions**: Supabase Edge Functions (Gemini API proxy)

**AI Integration**

- **Provider**: Google Gemini API
- **Architecture**: Centralized proxy via Supabase Edge Functions
- **Security**: API key stored as Supabase environment variable
- **Use Cases**: Task suggestions, productivity insights, chat assistance

### Database Schema (14 Tables)

**Core Tables:**

- `users` - User profiles and preferences
- `tasks` - Task management with categories
- `focus_sessions` - Deep work session tracking
- `pomodoros` - Pomodoro timer logs
- `daily_logs` - Daily activity summaries
- `weekly_reviews` - Weekly productivity reviews
- `energy_logs` - Energy level tracking
- `distractions` - Interruption logging
- `calendar_events` - Event management
- `reminders` - Reminder system
- `backlog_items` - Idea capture
- `settings` - User preferences
- `analytics_cache` - Pre-computed analytics
- `ai_interactions` - AI chat history

**Key Features:**

- **camelCase/snake_case Transformation Layer**: Automatic conversion between frontend camelCase and database snake_case
- **Row Level Security (RLS)**: User data isolation
- **Indexes**: Optimized for common queries
- **Triggers**: Automatic timestamp updates

### Data Flow

```
User Action → React Component → Supabase Client
     ↓
Context Update (Local State)
     ↓
Supabase Database (PostgreSQL)
     ↓
Real-time Subscription → UI Update
     ↓
(Optional) Edge Function → Gemini AI → Response
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Google Gemini API key (optional, for AI features)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/kaal.git
cd kaal
```

1. **Install dependencies**

```bash
npm install
```

1. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Gemini API (if not using Edge Function proxy)
VITE_GEMINI_API_KEY=your_gemini_api_key
```

1. **Set up Supabase**

- Create a new Supabase project
- Run the database migrations (SQL schema provided in `/supabase/migrations`)
- Enable Row Level Security policies
- Set up Edge Function for Gemini API proxy
- Add Gemini API key as Supabase environment variable

1. **Run the development server**

```bash
npm run dev
```

1. **Open your browser**

```
http://localhost:5173
```

---

## 📁 Project Structure

```
kaal/
├── src/
│   ├── components/           # React components
│   │   ├── DashboardScreen.tsx
│   │   ├── TasksScreen.tsx
│   │   ├── AnalyticsScreen.tsx
│   │   ├── SignInScreen.tsx
│   │   ├── SignUpScreen.tsx
│   │   └── ...
│   ├── contexts/            # React Context providers
│   │   ├── SettingsContext.tsx
│   │   ├── ProfileContext.tsx
│   │   └── TaskContext.tsx
│   ├── services/            # API and service layer
│   │   ├── supabase-client.ts
│   │   └── ai-service.ts
│   ├── utils/               # Utility functions
│   │   ├── case-converter.ts
│   │   └── helpers.ts
│   ├── styles/              # Global styles
│   │   └── globals.css
│   ├── routes.ts            # React Router configuration
│   └── App.tsx              # Main app component
├── supabase/
│   ├── migrations/          # Database schema
│   └── functions/           # Edge Functions
├── public/                  # Static assets
├── package.json
└── README.md
```

---

## 🎮 Usage

### Starting a Focus Session

1. Navigate to **Home** or **Energy Hub**
2. Click **"New Focus Session"**
3. Set your duration and task
4. Click **"Start Focus"**
5. KAAL will track your session and detect distractions

### Managing Tasks

1. Go to **Tasks** screen
2. Click **"+ New Task"**
3. Fill in task details (title, category, priority)
4. Tasks automatically sync to Supabase
5. Check off completed tasks

### Viewing Analytics

1. Navigate to **Analytics**
2. View Focus Trend chart (Deep Work vs Shallow Work)
3. Check Interruption Sources
4. Review Peak Performance metrics
5. Export data for deeper analysis

### AI Chat Assistant

1. Click the AI button (bottom right)
2. Ask questions about productivity
3. Get task suggestions
4. Receive personalized insights

---

## 🎯 Hackathon Submission

### Event Details

- **Hackathon**: SAI University FOSS Club Hackathon
- **Submission Date**: February 12, 2026, 1:00 PM
- **Category**: Productivity Tools / AI Applications
- **Team Name**: JAIRAM
- **Team Size**: 1 member

### Team Member

**Akulapalli Jayaram**

- Full-stack developer
- UI/UX designer
- Database architect
- Project lead

### Development Timeline

- **Planning & Design**: 2 days
- **Frontend Development**: 5 days
- **Backend & Database**: 3 days
- **AI Integration**: 2 days
- **Testing & Polish**: 2 days
- **Total**: ~2 weeks of intensive development

### Key Achievements

✅ 18 major screens implemented  
✅ Complete authentication flow  
✅ Real-time database sync  
✅ AI integration with Gemini  
✅ Advanced analytics with charts  
✅ Fully responsive design  
✅ WCAG 2.1 AA accessibility  
✅ Production-ready codebase  

---

## 🌟 Future Enhancements

### Planned Features

- [ ] Mobile app (React Native)
- [ ] Team collaboration features
- [ ] Integrations (Calendar, Slack, Notion)
- [ ] Advanced AI coaching
- [ ] Habit tracking
- [ ] Goal setting & OKRs
- [ ] Dark mode
- [ ] Export reports (PDF, CSV)
- [ ] Browser extension
- [ ] API for third-party integrations

---

## 🤝 Contributing

This is a hackathon project, but contributions are welcome for future development!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **SAI University FOSS Club** - For organizing the hackathon
- **Supabase** - For the amazing backend platform
- **Google** - For Gemini AI API
- **Vercel** - For Tailwind CSS v4
- **Open Source Community** - For incredible tools and libraries

---

## 📞 Contact

**Akulapalli Jayaram**  

- GitHub: <https://github.com/aama47735-source>
- Email: <jayaram.a-29@soai.saiuniversity.edu.in>

- LinkedIn: <https://www.linkedin.com/in/jayaram-akulapalli-765662377/>

**Project Link**: <https://github.com/aama47735-source/KAAL>

---

<div align="center">

**Built with ❤️ for the SAI University FOSS Club Hackathon 2026**

⭐ Star this repo if you find it helpful!

</div>
  
