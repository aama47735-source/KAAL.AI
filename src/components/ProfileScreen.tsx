import { Edit3, Mail, MapPin, Calendar, Briefcase, Users } from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { NotificationCenter } from "./NotificationCenter";
import { ProfileEditModal } from "./ProfileEditModal";
import { useState } from "react";

export function ProfileScreen() {
  const { profile, loading } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Show loading skeleton while profile is loading
  if (loading) {
    return (
      <div className="flex-1 overflow-hidden flex flex-col" style={{ backgroundColor: "#F8F9FA" }}>
        {/* Header */}
        <header 
          className="h-24 border-b flex items-center justify-between px-10 sticky top-0 z-20"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderColor: "rgba(255, 255, 255, 0.5)",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
          }}
        >
          <div className="flex flex-col">
            <h1 
              className="text-sm font-semibold tracking-wide uppercase"
              style={{ color: "#6B7280" }}
            >
              Personal
            </h1>
            <p 
              className="text-2xl italic"
              style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
            >
              My Profile
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-32 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-10 w-px bg-gray-200"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </header>
        
        {/* Loading Content */}
        <div className="flex-1 overflow-y-auto p-10">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="p-8 rounded-3xl bg-white border border-gray-200">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-10 bg-gray-200 rounded-lg w-64 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
                  <div className="flex gap-3">
                    <div className="h-8 bg-gray-200 rounded-full w-32 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded-full w-40 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 p-8 rounded-3xl bg-white border border-gray-200">
                <div className="h-8 bg-gray-200 rounded-lg w-32 mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-white border border-gray-200">
                  <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
                  <div className="space-y-3">
                    <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                    <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col" style={{ backgroundColor: "#F8F9FA" }}>
      {/* Header */}
      <header 
        className="h-24 border-b flex items-center justify-between px-10 sticky top-0 z-20"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderColor: "rgba(255, 255, 255, 0.5)",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
        }}
      >
        <div className="flex flex-col">
          <h1 
            className="text-sm font-semibold tracking-wide uppercase"
            style={{ color: "#6B7280" }}
          >
            Personal
          </h1>
          <p 
            className="text-2xl italic"
            style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
          >
            My Profile
          </p>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all border"
            style={{
              backgroundColor: "#111827",
              color: "white",
              borderColor: "rgba(255, 255, 255, 0.2)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
            }}
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>

          <div className="h-10 w-px bg-gray-200"></div>

          <NotificationCenter />

          <div className="w-10 h-10 rounded-full ring-2 ring-white shadow-lg overflow-hidden">
            <img 
              src={profile.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"} 
              alt="User" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-10 scroll-smooth">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Profile Header */}
          <div 
            className="p-8 rounded-3xl border opacity-0"
            style={{
              background: "rgba(255, 255, 255, 0.55)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              borderColor: "rgba(255, 255, 255, 0.4)",
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.4)",
              animation: "fadeInUp 0.8s ease-out 0.1s forwards"
            }}
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Profile Photo */}
              <div className="relative">
                <div 
                  className="w-32 h-32 rounded-full p-1 border shadow-lg overflow-hidden"
                  style={{
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    backgroundColor: "white",
                    boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)"
                  }}
                >
                  <img 
                    src={profile.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover" 
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left space-y-3">
                <div className="space-y-1">
                  <h2 
                    className="text-4xl font-medium tracking-tight leading-tight"
                    style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
                  >
                    {profile.fullName || "User"}
                  </h2>
                  <p className="text-lg font-light tracking-wide" style={{ color: "#6B7280" }}>
                    {profile.professionalTitle || "No title set"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                    Pro Member
                  </span>
                  <div className="flex items-center gap-1.5 text-sm" style={{ color: "#6B7280" }}>
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </div>
                  {profile.phoneNumber && (
                    <div className="flex items-center gap-1.5 text-sm" style={{ color: "#6B7280" }}>
                      <MapPin className="w-4 h-4" />
                      {profile.phoneNumber}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-sm" style={{ color: "#6B7280" }}>
                    <Calendar className="w-4 h-4" />
                    Member since 2024
                  </div>
                </div>
              </div>

              {/* Profile Stats */}
              <div className="flex gap-6">
                <div className="text-center">
                  <div 
                    className="text-3xl font-bold"
                    style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
                  >
                    142
                  </div>
                  <div className="text-xs uppercase tracking-widest mt-1" style={{ color: "#6B7280" }}>
                    Sessions
                  </div>
                </div>
                <div className="text-center">
                  <div 
                    className="text-3xl font-bold"
                    style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
                  >
                    89h
                  </div>
                  <div className="text-xs uppercase tracking-widest mt-1" style={{ color: "#6B7280" }}>
                    Deep Work
                  </div>
                </div>
                <div className="text-center">
                  <div 
                    className="text-3xl font-bold"
                    style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
                  >
                    74%
                  </div>
                  <div className="text-xs uppercase tracking-widest mt-1" style={{ color: "#6B7280" }}>
                    Focus Score
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About Section */}
            <div 
              className="md:col-span-2 p-8 rounded-3xl border opacity-0"
              style={{
                background: "rgba(255, 255, 255, 0.55)",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                borderColor: "rgba(255, 255, 255, 0.4)",
                boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.4)",
                animation: "fadeInUp 0.8s ease-out 0.2s forwards"
              }}
            >
              <h3 
                className="text-xl italic font-medium mb-4"
                style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
              >
                About
              </h3>
              <p className="leading-relaxed mb-6" style={{ color: "#6B7280" }}>
                {profile.bio || 'No bio added yet. Click Edit Profile to add a description about yourself.'}
              </p>

              {/* Skills */}
              <div className="space-y-3 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "#6B7280" }}>
                  Core Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.skills && profile.skills.length > 0 
                    ? profile.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg"
                          style={{ backgroundColor: "#111827", color: "white" }}
                        >
                          {skill}
                        </span>
                      ))
                    : <p className="text-sm" style={{ color: "#6B7280" }}>No skills added yet. Click Edit Profile to add your skills.</p>
                  }
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "#6B7280" }}>
                  Areas of Interest
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.interests && profile.interests.length > 0
                    ? profile.interests.map((interest, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border"
                          style={{ 
                            borderColor: "#111827", 
                            backgroundColor: "rgba(17, 24, 39, 0.05)",
                            color: "#111827"
                          }}
                        >
                          {interest}
                        </span>
                      ))
                    : <p className="text-sm" style={{ color: "#6B7280" }}>No interests added yet. Click Edit Profile to add your interests.</p>
                  }
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="space-y-6">
              {/* Social Links */}
              <div 
                className="p-6 rounded-3xl border opacity-0"
                style={{
                  background: "rgba(255, 255, 255, 0.55)",
                  backdropFilter: "blur(24px) saturate(180%)",
                  WebkitBackdropFilter: "blur(24px) saturate(180%)",
                  borderColor: "rgba(255, 255, 255, 0.4)",
                  boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.4)",
                  animation: "fadeInUp 0.8s ease-out 0.3s forwards"
                }}
              >
                <h3 
                  className="text-lg italic font-medium mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
                >
                  Connect
                </h3>
                <div className="space-y-3">
                  {profile.website && (
                    <a 
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-md"
                      style={{ 
                        backgroundColor: "rgba(255, 255, 255, 0.4)",
                        borderColor: "rgba(229, 231, 235, 0.8)"
                      }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#111827] flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium truncate" style={{ color: "#111827" }}>
                        {profile.website.replace(/^https?:\/\//, '')}
                      </span>
                    </a>
                  )}
                  {profile.email && (
                    <a 
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-md"
                      style={{ 
                        backgroundColor: "rgba(255, 255, 255, 0.4)",
                        borderColor: "rgba(229, 231, 235, 0.8)"
                      }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#0077b5] flex items-center justify-center">
                        <Mail className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium truncate" style={{ color: "#111827" }}>{profile.email}</span>
                    </a>
                  )}
                  {!profile.website && !profile.email && (
                    <p className="text-sm text-center py-4" style={{ color: "#6B7280" }}>
                      No contact links added yet
                    </p>
                  )}
                </div>
              </div>

              {/* Focus Preferences */}
              <div 
                className="p-6 rounded-3xl border opacity-0"
                style={{
                  background: "rgba(255, 255, 255, 0.55)",
                  backdropFilter: "blur(24px) saturate(180%)",
                  WebkitBackdropFilter: "blur(24px) saturate(180%)",
                  borderColor: "rgba(255, 255, 255, 0.4)",
                  boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.4)",
                  animation: "fadeInUp 0.8s ease-out 0.4s forwards"
                }}
              >
                <h3 
                  className="text-lg italic font-medium mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
                >
                  Preferences
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: "#6B7280" }}>Deep Work Mode</span>
                    <span className="font-medium" style={{ color: "#111827" }}>{profile.deepWorkMode ? "On" : "Off"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: "#6B7280" }}>Quiet Mode</span>
                    <span className="font-medium" style={{ color: profile.quietMode ? "#111827" : "#6B7280" }}>{profile.quietMode ? "On" : "Off"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: "#6B7280" }}>Weekly Digest</span>
                    <span className="font-medium" style={{ color: "#111827" }}>{profile.weeklyDigest ? "On" : "Off"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Overview */}
          <div 
            className="p-8 rounded-3xl border opacity-0"
            style={{
              background: "rgba(255, 255, 255, 0.55)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              borderColor: "rgba(255, 255, 255, 0.4)",
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.4)",
              animation: "fadeInUp 0.8s ease-out 0.5s forwards"
            }}
          >
            <h3 
              className="text-xl italic font-medium mb-6"
              style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
            >
              Recent Activity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <Briefcase className="w-6 h-6" style={{ color: "#111827" }} />
                </div>
                <div>
                  <div className="text-sm font-medium mb-1" style={{ color: "#111827" }}>
                    5 Deep Work Sessions
                  </div>
                  <div className="text-xs" style={{ color: "#6B7280" }}>
                    This week
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <Users className="w-6 h-6" style={{ color: "#111827" }} />
                </div>
                <div>
                  <div className="text-sm font-medium mb-1" style={{ color: "#111827" }}>
                    12 Tasks Completed
                  </div>
                  <div className="text-xs" style={{ color: "#6B7280" }}>
                    This week
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <Briefcase className="w-6 h-6" style={{ color: "#111827" }} />
                </div>
                <div>
                  <div className="text-sm font-medium mb-1" style={{ color: "#111827" }}>
                    18h Focus Time
                  </div>
                  <div className="text-xs" style={{ color: "#6B7280" }}>
                    This week
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Profile Edit Modal */}
      <ProfileEditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </div>
  );
}