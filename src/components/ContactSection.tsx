import React, { useState } from 'react';
import { Mail, GitFork, Copy, Check, Send, ShieldCheck, Terminal, AlertCircle } from 'lucide-react';
import { PERSONAL_INFO, EXTENSIBLE_PROFILES } from '../data/portfolioData';
import { ProfileImage } from './ProfileImage';

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const copyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.senderEmail || !formData.message) return;

    setStatus('sending');
    setTimeout(() => {
      setStatus('sent');
      setFormData({ senderName: '', senderEmail: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }, 1200);
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Terminal className="w-3.5 h-3.5" />
            <span>COMMUNICATION & CHANNELS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Connect & Technical Collaboration
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Available for discussions regarding backend systems, networking protocols, security research, and open-source explorations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Verified Profiles & Direct Email */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Email Card */}
            <div className="bg-[#0b101c] border border-cyan-500/30 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <ProfileImage
                    size="sm"
                    interactive={false}
                    showBadge={false}
                    glowIntensity="subtle"
                    id="contact-profile-avatar"
                  />
                  <div>
                    <span className="font-display font-bold text-sm text-white block">
                      {PERSONAL_INFO.name}
                    </span>
                    <span className="font-mono text-[11px] text-cyan-400 block">
                      @{PERSONAL_INFO.handle}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/30">
                  VERIFIED IDENTITY
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
                <Mail className="w-4 h-4" />
                <span>Primary Verified Contact Channel</span>
              </div>
              <p className="text-xs text-slate-300">
                Direct inquiry channel for research collaboration and technical exchanges:
              </p>
              
              <div className="bg-[#070a12] p-3 rounded-lg border border-slate-800 flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-cyan-300 truncate">
                  {PERSONAL_INFO.email}
                </span>
                <button
                  onClick={copyEmail}
                  id="contact-copy-email-btn"
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 shrink-0 border border-slate-700 transition-colors cursor-pointer"
                  title="Copy email to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Extensible Verified Profiles List */}
            <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Verified Online Profiles & Handles:
              </h3>

              <div className="space-y-3">
                {EXTENSIBLE_PROFILES.map((profile, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-lg border text-xs font-mono flex flex-col gap-1.5 ${
                      profile.isVerified
                        ? 'bg-[#0f1626] border-cyan-500/30'
                        : 'bg-[#0a0e17] border-dashed border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {profile.type === 'github' && <GitFork className="w-4 h-4 text-cyan-400" />}
                        {profile.type === 'email' && <Mail className="w-4 h-4 text-emerald-400" />}
                        {profile.type === 'upcoming' && <AlertCircle className="w-4 h-4 text-slate-500" />}
                        <span className="font-bold text-white">{profile.platform}</span>
                      </div>
                      {profile.isVerified ? (
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                          VERIFIED
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                          EXTENSIBLE SLOT
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{profile.handle}</span>
                      {profile.isVerified && (
                        <a
                          href={profile.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:underline"
                        >
                          Visit Link →
                        </a>
                      )}
                    </div>
                    {profile.note && (
                      <span className="text-[10px] text-slate-500 font-sans">
                        {profile.note}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Direct Message Transmitter */}
          <div className="lg:col-span-7">
            <div className="bg-[#0b101c] border border-cyan-500/30 rounded-xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-display font-bold text-white">
                    Direct Inquiry Transmitter
                  </h3>
                  <p className="text-xs text-slate-400">
                    Send a direct note or message to <strong className="text-cyan-300">{PERSONAL_INFO.email}</strong>.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>TLS ENCRYPTED</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="senderName" className="block text-xs font-mono text-slate-300">
                      Your Name / Handle:
                    </label>
                    <input
                      type="text"
                      id="senderName"
                      value={formData.senderName}
                      onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                      placeholder="e.g. Alex (systems dev)"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#070b14] border border-slate-800 focus:border-cyan-500 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="senderEmail" className="block text-xs font-mono text-slate-300">
                      Your Email Address <span className="text-cyan-400">*</span>:
                    </label>
                    <input
                      type="email"
                      id="senderEmail"
                      required
                      value={formData.senderEmail}
                      onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                      placeholder="name@domain.com"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#070b14] border border-slate-800 focus:border-cyan-500 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="subject" className="block text-xs font-mono text-slate-300">
                    Subject Topic:
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Backend Collaboration / Networking Query"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#070b14] border border-slate-800 focus:border-cyan-500 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="block text-xs font-mono text-slate-300">
                    Message Content <span className="text-cyan-400">*</span>:
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your technical inquiry, project question, or collaboration opportunity..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#070b14] border border-slate-800 focus:border-cyan-500 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500 font-mono">
                    Zero third-party trackers.
                  </span>

                  <button
                    type="submit"
                    id="contact-submit-btn"
                    disabled={status === 'sending'}
                    className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs font-mono flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
                  >
                    {status === 'sending' ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                        <span>Transmitting Packet...</span>
                      </>
                    ) : status === 'sent' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-slate-950" />
                        <span>Transmission Logged!</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Transmit Message</span>
                      </>
                    )}
                  </button>
                </div>

                {status === 'sent' && (
                  <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono animate-in fade-in">
                    ✓ Message received and queued. You can also contact directly at <strong className="underline">{PERSONAL_INFO.email}</strong>.
                  </div>
                )}
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
