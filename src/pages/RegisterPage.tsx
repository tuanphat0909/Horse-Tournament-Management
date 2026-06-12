import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const roles = [
  { id: 'owner', label: 'Horse\nOwner', emoji: '🐎' },
  { id: 'jockey', label: 'Jockey', emoji: '🏇' },
  { id: 'referee', label: 'Referee', emoji: '⚖️' },
  { id: 'spectator', label: 'Spectator', emoji: '👁️' },
  { id: 'admin', label: 'Admin', emoji: '🛡️' },
];

const roleBackgrounds: Record<string, string> = {
  owner: '/images/hero-owner.jpg',
  jockey: '/images/hero-jockey.jpg',
  referee: '/images/hero-referee.jpg',
  spectator: '/images/hero-spectator.jpg',
  admin: '/images/hero-admin.jpg',
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

function CornerOrnament() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <path d="M0 40V0H40" stroke="#C9A84C" strokeOpacity="0.6" strokeWidth="1" />
      <path d="M4 36V4H36" stroke="#C9A84C" strokeOpacity="0.3" strokeWidth="1" />
      <circle cx="4" cy="4" r="1.5" fill="#C9A84C" />
    </svg>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundColor: '#0B1628',
        fontFamily: '"DM Sans", sans-serif',
        color: '#E2EAF4',
      }}
    >
      {/* Background container */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Dynamic Background Image crossfade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedRole || 'default'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.16 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${selectedRole ? roleBackgrounds[selectedRole] : '/hero-bg.png'})`,
            }}
          />
        </AnimatePresence>

        {/* Ambient Overlay */}
        <div className="absolute inset-0 bg-navy/85" />

        {/* Theme Radial Glows */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 10% 20%, rgba(201, 168, 76, 0.12) 0%, transparent 40%),
              radial-gradient(circle at 90% 80%, rgba(201, 168, 76, 0.08) 0%, transparent 45%)
            `,
          }}
        />

        {/* Noise overlay */}
        <div className="absolute inset-0 noise-bg opacity-[0.02] pointer-events-none" />

        {/* Subtle background wave lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <path d="M0,50 Q25,20 50,50 T100,50" fill="none" stroke="#C9A84C" strokeWidth="0.1" />
          <path d="M0,60 Q35,10 60,60 T100,60" fill="none" stroke="#C9A84C" strokeWidth="0.1" opacity="0.8" />
          <path d="M0,40 Q15,80 40,40 T100,40" fill="none" stroke="#C9A84C" strokeWidth="0.1" opacity="0.6" />
          <path d="M0,70 Q45,30 70,70 T100,70" fill="none" stroke="#C9A84C" strokeWidth="0.1" opacity="0.4" />
          <path d="M0,80 Q50,90 80,40 T100,80" fill="none" stroke="#C9A84C" strokeWidth="0.1" opacity="0.5" />
          <path d="M-10,110 C30,70 60,10 110,-10" fill="none" stroke="#C9A84C" strokeWidth="0.2" opacity="0.3" />
          <path d="M-10,90 C40,50 80,30 110,10" fill="none" stroke="#C9A84C" strokeWidth="0.1" opacity="0.2" />
        </svg>
      </div>

      {/* Logo */}
      <header className="absolute top-0 left-0 w-full px-12 py-8 z-20">
        <div
          className="tracking-widest font-semibold cursor-pointer transition-colors duration-300 hover:text-champagne text-glow"
          style={{ fontFamily: '"Playfair Display", serif', color: '#C9A84C', fontSize: '26px' }}
          onClick={() => navigate('/')}
        >
          EQUESTRIA
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center relative z-10 px-6 py-12 lg:px-16 w-full max-w-[1600px] mx-auto">
        {/* Vertical divider */}
        <div
          className="absolute hidden lg:flex flex-col items-center pointer-events-none z-0"
          style={{ left: '50%', transform: 'translateX(-50%)', top: '10%', bottom: '10%' }}
        >
          <div style={{ width: '1px', flex: 1, background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.35) 30%, rgba(201,168,76,0.35) 70%, transparent)' }} />
          <svg viewBox="0 0 24 24" style={{ width: '22px', height: '22px', flexShrink: 0, margin: '10px 0' }}>
            <path d="M12,0 L24,12 L12,24 L0,12 Z" fill="#C9A84C" fillOpacity="0.6"/>
            <path d="M12,4 L20,12 L12,20 L4,12 Z" fill="none" stroke="#C9A84C" strokeOpacity="0.35" strokeWidth="0.8"/>
          </svg>
          <div style={{ width: '1px', height: '60px', background: 'rgba(201,168,76,0.25)', flexShrink: 0 }} />
          <svg viewBox="0 0 16 16" style={{ width: '14px', height: '14px', flexShrink: 0, margin: '8px 0' }}>
            <path d="M8,0 L16,8 L8,16 L0,8 Z" fill="none" stroke="#C9A84C" strokeOpacity="0.45" strokeWidth="1"/>
            <circle cx="8" cy="8" r="2" fill="#C9A84C" fillOpacity="0.5"/>
          </svg>
          <div style={{ width: '1px', height: '60px', background: 'rgba(201,168,76,0.25)', flexShrink: 0 }} />
          <svg viewBox="0 0 24 24" style={{ width: '22px', height: '22px', flexShrink: 0, margin: '10px 0' }}>
            <path d="M12,0 L24,12 L12,24 L0,12 Z" fill="#C9A84C" fillOpacity="0.6"/>
            <path d="M12,4 L20,12 L12,20 L4,12 Z" fill="none" stroke="#C9A84C" strokeOpacity="0.35" strokeWidth="0.8"/>
          </svg>
          <div style={{ width: '1px', flex: 1, background: 'linear-gradient(to bottom, rgba(201,168,76,0.35), transparent)' }} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center w-full">

          {/* Left: Branding */}
          <motion.section
            className="hidden lg:flex flex-col items-center justify-center text-center px-8"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-10">
              <h1
                className="italic font-medium mb-6 leading-tight text-gradient-gold text-glow"
                style={{ fontFamily: '"Playfair Display", serif', fontSize: '56px', lineHeight: '1.15' }}
              >
                "Join the Legacy."
              </h1>
              <p className="tracking-[0.22em] uppercase font-semibold text-xs text-muted" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                Start Your Journey to Greatness
              </p>
            </div>
            <div className="flex gap-3">
              {['Global', 'Elite', 'Secure'].map((s) => (
                <span
                  key={s}
                  className="px-5 py-2 rounded-full font-medium tracking-wide border border-gold/20 text-gold bg-surface/30 text-xs transition-all duration-300 hover:border-gold/45 hover:bg-gold/5"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.section>

          {/* Right: Register form */}
          <section className="w-full flex justify-center">
            {/* Gradient border wrapper */}
            <div className="w-full max-w-md" style={{
              padding: '1px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(201,168,76,0.65) 0%, rgba(201,168,76,0.08) 40%, rgba(201,168,76,0.55) 100%)',
              boxShadow: '0 0 30px rgba(201,168,76,0.12), 0 0 60px rgba(201,168,76,0.06)',
            }}>
            <motion.div
              className="rounded-2xl p-10 relative overflow-hidden"
              style={{
                background: 'rgba(15, 30, 53, 0.85)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderRadius: '15px',
                boxShadow: 'inset 0 1px 0 rgba(201, 168, 76, 0.15), 0 25px 50px -12px rgba(0,0,0,0.6)',
              }}
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {/* Corners */}
              <div className="absolute top-3 left-3 pointer-events-none"><CornerOrnament /></div>
              <div className="absolute top-3 right-3 pointer-events-none scale-x-[-1]"><CornerOrnament /></div>
              <div className="absolute bottom-3 left-3 pointer-events-none scale-y-[-1]"><CornerOrnament /></div>
              <div className="absolute bottom-3 right-3 pointer-events-none scale-x-[-1] scale-y-[-1]"><CornerOrnament /></div>

              {/* Header */}
              <motion.div variants={fadeUp} className="text-center mb-7 relative z-10">
                <h2
                  className="text-2xl tracking-widest mb-2 font-serif text-gold text-glow"
                >
                  EQUESTRIA
                </h2>
                <p className="text-sm text-muted">Create your premium account</p>
              </motion.div>

              <div className="space-y-4 relative z-10">
                {/* Full Name */}
                <motion.div variants={fadeUp}>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-muted">
                    Full Name
                  </label>
                  <input
                    className="w-full rounded-md px-4 py-3 text-sm outline-none transition-all duration-300"
                    style={{
                      background: 'rgba(11, 22, 40, 0.65)',
                      border: '1px solid rgba(201, 168, 76, 0.2)',
                      color: '#E2EAF4',
                    }}
                    type="text"
                    placeholder="John Doe"
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#C9A84C';
                      e.currentTarget.style.boxShadow = '0 0 12px rgba(201, 168, 76, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </motion.div>

                {/* Email */}
                <motion.div variants={fadeUp}>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-muted">
                    Email Address
                  </label>
                  <input
                    className="w-full rounded-md px-4 py-3 text-sm outline-none transition-all duration-300"
                    style={{
                      background: 'rgba(11, 22, 40, 0.65)',
                      border: '1px solid rgba(201, 168, 76, 0.2)',
                      color: '#E2EAF4',
                    }}
                    type="email"
                    placeholder="champion@equestria.com"
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#C9A84C';
                      e.currentTarget.style.boxShadow = '0 0 12px rgba(201, 168, 76, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </motion.div>

                {/* Password */}
                <motion.div variants={fadeUp}>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-muted">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded-md px-4 py-3 pr-10 text-sm outline-none transition-all duration-300"
                      style={{
                        background: 'rgba(11, 22, 40, 0.65)',
                        border: '1px solid rgba(201, 168, 76, 0.2)',
                        color: '#E2EAF4',
                      }}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#C9A84C';
                        e.currentTarget.style.boxShadow = '0 0 12px rgba(201, 168, 76, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.2)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                    <button
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-muted hover:text-gold transition-colors duration-200"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </motion.div>

                {/* Role selector */}
                <motion.div variants={fadeUp}>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-muted">
                    Select Your Role
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {roles.map((role) => (
                      <motion.button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        className="flex flex-col items-center justify-center p-2 rounded-lg gap-1.5 transition-all duration-300 cursor-pointer"
                        style={{
                          border: selectedRole === role.id ? '1px solid #C9A84C' : '1px solid rgba(201, 168, 76, 0.15)',
                          background: selectedRole === role.id ? 'rgba(201, 168, 76, 0.12)' : 'rgba(11, 22, 40, 0.4)',
                          boxShadow: selectedRole === role.id ? '0 0 15px rgba(201, 168, 76, 0.2)' : 'none',
                        }}
                        onMouseEnter={(e) => {
                          if (selectedRole !== role.id) {
                            e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.5)';
                            e.currentTarget.style.background = 'rgba(201, 168, 76, 0.04)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedRole !== role.id) {
                            e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.15)';
                            e.currentTarget.style.background = 'rgba(11, 22, 40, 0.4)';
                          }
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300"
                          style={{ background: 'rgba(30, 41, 59, 0.4)' }}
                        >
                          <span className="text-sm">{role.emoji}</span>
                        </div>
                        <span
                          className="text-[9px] text-center leading-tight font-sans font-semibold tracking-wide"
                          style={{ color: selectedRole === role.id ? '#F0D080' : '#7D8FB3' }}
                        >
                          {role.label.split('\n').map((line, i, arr) => (
                            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                          ))}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Submit */}
                <motion.div variants={fadeUp}>
                  <button
                    className="w-full font-bold text-sm tracking-wider uppercase py-3.5 rounded-md flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_25px_rgba(201,168,76,0.45)] hover:-translate-y-0.5 cursor-pointer relative overflow-hidden group"
                    style={{ background: 'linear-gradient(135deg, #C9A84C 0%, #F0D080 100%)', color: '#07111F' }}
                    type="button"
                    onClick={() => navigate('/login')}
                  >
                    Register
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>
                </motion.div>

                {/* Divider */}
                <motion.div variants={fadeUp} className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" style={{ borderColor: 'rgba(201, 168, 76, 0.2)' }} />
                  </div>
                  <div className="relative flex justify-center">
                    <span
                      className="px-3 text-xs uppercase tracking-wider font-semibold bg-[#12233f] rounded px-2"
                      style={{ color: '#7D8FB3' }}
                    >
                      or
                    </span>
                  </div>
                </motion.div>

                {/* Login link */}
                <motion.div variants={fadeUp} className="text-center text-xs text-muted">
                  Already have an account?{' '}
                  <a
                    href="#"
                    className="font-medium text-gold hover:text-champagne transition-colors duration-200"
                    onClick={(e) => { e.preventDefault(); navigate('/login'); }}
                  >
                    Sign in here
                  </a>
                </motion.div>
              </div>
            </motion.div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

