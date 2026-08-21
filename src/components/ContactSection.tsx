import React, { useState, useEffect } from 'react';
import { GitFork, Send, ShieldCheck, Terminal, AlertCircle, Globe, Lock, Check, Linkedin, ExternalLink } from 'lucide-react';
import { PERSONAL_INFO, EXTENSIBLE_PROFILES } from '../data/portfolioData';
import { ProfileImage } from './ProfileImage';
import { ScrollReveal, StaggerContainer, StaggerItem, FadeInUpSection } from './ScrollReveal';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    subject: '',
    message: '',
    botField: '', // Honeypot field for bot spam trap
  });
  const [renderedAt, setRenderedAt] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    setRenderedAt(Date.now());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData.senderName.trim();
    const email = formData.senderEmail.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    // Client-side pre-validation
    if (!name || name.length < 2) {
      setStatus('error');
      setStatusMessage('Please enter your name or handle (minimum 2 characters).');
      return;
    }

    if (!email || !email.includes('@')) {
      setStatus('error');
      setStatusMessage('Please enter a valid email address.');
      return;
    }

    if (!subject || subject.length < 2) {
      setStatus('error');
      setStatusMessage('Please enter a subject topic.');
      return;
    }

    if (!message || message.length < 10) {
      setStatus('error');
      setStatusMessage('Please provide a message with at least 10 characters.');
      return;
    }

    if (name.length > 100 || email.length > 254 || subject.length > 150 || message.length > 3000) {
      setStatus('error');
      setStatusMessage('Input length exceeds allowed limits.');
      return;
    }

    setStatus('sending');
    setStatusMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          botField: formData.botField,
          renderedAt,
        }),
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result?.success) {
        setStatus('sent');
        setStatusMessage(result.message || 'Message transmitted successfully.');
        setFormData({ senderName: '', senderEmail: '', subject: '', message: '', botField: '' });
        setTimeout(() => setStatus('idle'), 6000);
      } else if (response.status === 429) {
        setStatus('error');
        setStatusMessage('Rate limit active. Please wait a few moments before transmitting another message.');
      } else {
        setStatus('error');
        setStatusMessage(result?.error || 'Unable to deliver message at this time. Please try again.');
      }
    } catch {
      setStatus('error');
      setStatusMessage('Connection failed. Please check your network connection and try again.');
    }
  };

  return (
    <FadeInUpSection id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with ScrollReveal */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-14 space-y-3">
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
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Verified Profiles & Channels with ScrollReveal */}
          <div className="lg:col-span-5 space-y-6">
            <ScrollReveal>
              {/* Verified Identity & Channel Card */}
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
                  <Lock className="w-4 h-4" />
                  <span>Secure Inquiry Transmission</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Transmit direct technical inquiries and collaboration proposals securely through the encrypted endpoint. All messages are securely forwarded directly to Yeasin.
                </p>
                
                <div className="bg-[#070a12] p-3 rounded-lg border border-slate-800 flex items-center gap-2 text-xs text-emerald-400 font-mono">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>End-to-End TLS 1.3 Transport & Anti-Spam Protected</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Professional LinkedIn Connect Button */}
            <ScrollReveal delay={0.08}>
              <a
                href={PERSONAL_INFO.linkedinUrl || 'https://linkedin.com/in/yeasin4745'}
                target="_blank"
                rel="noopener noreferrer"
                id="contact-linkedin-btn"
                aria-label="Connect with Yeasin on LinkedIn (opens in new tab)"
                className="group relative flex items-center justify-between p-4 rounded-xl bg-[#0b101c] hover:bg-[#0c1424] border border-blue-500/30 hover:border-blue-400 text-slate-200 transition-all duration-300 shadow-md shadow-blue-950/20 hover:shadow-[0_0_22px_rgba(59,130,246,0.22)] transform hover:-translate-y-0.5 cursor-pointer block"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:text-blue-300 group-hover:bg-blue-900/60 group-hover:border-blue-300 transition-all duration-300 shrink-0">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                        LinkedIn Profile
                      </span>
                      <span className="text-[10px] font-mono text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/30 font-semibold">
                        VERIFIED
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400 group-hover:text-slate-300 transition-colors truncate block">
                      linkedin.com/in/yeasin4745
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-blue-400 group-hover:text-blue-300 transition-colors shrink-0 pl-2">
                  <span className="hidden sm:inline font-medium">Connect</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </div>
              </a>
            </ScrollReveal>

            {/* Extensible Verified Profiles List with Staggered Scroll Reveal */}
            <ScrollReveal delay={0.12}>
              <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-6 space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Verified Online Profiles & Web Hubs:
                </h3>

                <StaggerContainer className="space-y-3">
                  {EXTENSIBLE_PROFILES.map((profile, idx) => (
                    <StaggerItem key={idx}>
                      <div
                        className={`p-3.5 rounded-lg border text-xs font-mono flex flex-col gap-1.5 transition-colors ${
                          profile.isVerified
                            ? profile.type === 'linkedin'
                              ? 'bg-[#0b1324] border-blue-500/30 hover:border-blue-500/50'
                              : 'bg-[#0f1626] border-cyan-500/30'
                            : 'bg-[#0a0e17] border-dashed border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {profile.type === 'github' && <GitFork className="w-4 h-4 text-cyan-400" />}
                            {profile.type === 'linkedin' && <Linkedin className="w-4 h-4 text-blue-400" />}
                            {profile.type === 'website' && <Globe className="w-4 h-4 text-emerald-400" />}
                            {profile.type === 'upcoming' && <AlertCircle className="w-4 h-4 text-slate-500" />}
                            <span className="font-bold text-white">{profile.platform}</span>
                          </div>
                          {profile.isVerified ? (
                            <span className={`text-[10px] px-2 py-0.5 rounded border ${
                              profile.type === 'linkedin'
                                ? 'text-blue-400 bg-blue-950/80 border-blue-500/30'
                                : 'text-emerald-400 bg-emerald-950/80 border-emerald-500/30'
                            }`}>
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
                              rel="noopener noreferrer"
                              className={`${
                                profile.type === 'linkedin' ? 'text-blue-400 hover:text-blue-300' : 'text-cyan-400 hover:text-cyan-300'
                              } hover:underline flex items-center gap-1`}
                            >
                              <span>Visit Link</span>
                              <span aria-hidden="true">→</span>
                            </a>
                          )}
                        </div>
                        {profile.note && (
                          <span className="text-[10px] text-slate-500 font-sans">
                            {profile.note}
                          </span>
                        )}
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </ScrollReveal>

          </div>

          {/* Right Column: Interactive Secure Message Transmitter */}
          <div className="lg:col-span-7">
            <ScrollReveal delay={0.15}>
              <div className="bg-[#0b101c] border border-cyan-500/30 rounded-xl p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div>
                    <h3 className="text-lg font-display font-bold text-white">
                      Direct Inquiry Transmitter
                    </h3>
                    <p className="text-xs text-slate-400">
                      Send a secure, encrypted inquiry directly to Yeasin.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/30">
                    <ShieldCheck className="w-4 h-4" />
                    <span>ENCRYPTED ENDPOINT</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot anti-spam trap (invisible to human visitors) */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="botField">Leave this field blank</label>
                    <input
                      type="text"
                      id="botField"
                      name="botField"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.botField}
                      onChange={(e) => setFormData({ ...formData, botField: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="senderName" className="block text-xs font-mono text-slate-300">
                        Your Name / Handle <span className="text-cyan-400">*</span>:
                      </label>
                      <input
                        type="text"
                        id="senderName"
                        required
                        minLength={2}
                        maxLength={100}
                        disabled={status === 'sending'}
                        value={formData.senderName}
                        onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                        placeholder="e.g. Alex (systems dev)"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#070b14] border border-slate-800 focus:border-cyan-500 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none disabled:opacity-50"
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
                        maxLength={254}
                        disabled={status === 'sending'}
                        value={formData.senderEmail}
                        onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                        placeholder="name@domain.com"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#070b14] border border-slate-800 focus:border-cyan-500 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="block text-xs font-mono text-slate-300">
                      Subject Topic <span className="text-cyan-400">*</span>:
                    </label>
                    <input
                      type="text"
                      id="subject"
                      required
                      minLength={2}
                      maxLength={150}
                      disabled={status === 'sending'}
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Backend Collaboration / Networking Query"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#070b14] border border-slate-800 focus:border-cyan-500 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="message" className="block text-xs font-mono text-slate-300">
                        Message Content <span className="text-cyan-400">*</span>:
                      </label>
                      <span className="text-[10px] font-mono text-slate-500">
                        {formData.message.length} / 3000
                      </span>
                    </div>
                    <textarea
                      id="message"
                      required
                      minLength={10}
                      maxLength={3000}
                      rows={4}
                      disabled={status === 'sending'}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your technical inquiry, project question, or collaboration opportunity..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#070b14] border border-slate-800 focus:border-cyan-500 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none resize-none disabled:opacity-50"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Strict data minimization & zero trackers.
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
                      ✓ {statusMessage || 'Message transmitted successfully.'}
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono animate-in fade-in flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{statusMessage}</span>
                    </div>
                  )}
                </form>
              </div>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </FadeInUpSection>
  );
};
