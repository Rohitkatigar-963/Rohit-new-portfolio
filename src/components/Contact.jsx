import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const FORM_ENDPOINT = 'https://formsubmit.co/rohitkatigar224@gmail.com';
const REDIRECT_URL = 'https://rohit-ai-portfolio.vercel.app/?contact=success#contact';

const Contact = () => {
  const ref = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '20%']);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <section ref={ref} id="contact" className="bg-[#0b0b0b] w-full min-h-screen relative overflow-hidden flex items-end pt-32 pb-0 border-t border-white/10 select-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/15 rounded-full blur-[160px] pointer-events-none z-0" />

      <motion.div
        style={{ y }}
        className="absolute top-0 left-0 w-full h-full flex flex-col justify-start items-center overflow-hidden pointer-events-none z-0 pt-16 md:pt-12 opacity-10"
      >
        <h1
          className="text-[25vw] leading-[0.75] font-black text-violet-500 uppercase tracking-tighter select-none scale-y-[1.6] origin-top"
          style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
        >
          CONTACT
        </h1>
      </motion.div>

      <div className="relative z-10 w-full flex justify-end items-end">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="bg-[#141414]/95 backdrop-blur-2xl border-t border-l border-white/15 w-full md:w-[90%] lg:w-[82%] p-8 md:p-16 text-white flex flex-col justify-between rounded-tl-[3rem] shadow-[0_-25px_60px_rgba(0,0,0,0.9)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-90" />

          <div className="flex items-center justify-between mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-violet-500/10 border border-violet-500/30 text-xs font-mono uppercase tracking-widest text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-ping" />
              <span>EPISODE 04 // GET IN TOUCH</span>
            </div>
            <span className="text-xs font-mono text-white/40 tracking-wider hidden md:block">
              // DIRECT TO ROHIT
            </span>
          </div>

          <form action={FORM_ENDPOINT} method="POST" className="flex flex-col gap-12 md:gap-16 w-full">
            <input type="hidden" name="_subject" value="New portfolio contact - Rohit Katigar" />
            <input type="hidden" name="_template" value="table" />
            <input type="text" name="_honey" tabIndex="-1" autoComplete="off" style={{ display: 'none' }} />
            <input type="hidden" name="_next" value={REDIRECT_URL} />

            <div className="flex flex-col md:flex-row gap-12 md:gap-20 w-full">
              <div className="flex-1 flex flex-col gap-10">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="w-full bg-transparent border-b border-white/20 pb-3 text-lg focus:outline-none focus:border-violet-500 transition-colors placeholder-white/40 font-medium rounded-none text-white"
                />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email Address"
                  required
                  className="w-full bg-transparent border-b border-white/20 pb-3 text-lg focus:outline-none focus:border-violet-500 transition-colors placeholder-white/40 font-medium rounded-none text-white"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me what you want to build..."
                  required
                  className="w-full h-full min-h-[140px] bg-transparent border-b border-white/20 pb-3 text-lg focus:outline-none focus:border-violet-500 transition-colors placeholder-white/40 font-medium resize-none rounded-none text-white"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-10 mt-4 pt-6 border-t border-white/10">
              <div className="flex-1 text-sm font-light text-white/60 leading-relaxed">
                <p className="max-w-lg">
                  Messages submitted here are delivered to <span className="text-white">rohitkatigar224@gmail.com</span>. Use this form for hiring, internships, freelance work, or AI collaborations.
                </p>
              </div>

              <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
                <p className="max-w-[260px] text-xs text-white/50 leading-relaxed">
                  No account or dashboard is required on this site. The form is handled securely by FormSubmit and emailed to Rohit.
                </p>

                <button
                  type="submit"
                  className="px-8 py-3.5 rounded bg-violet-500 text-white font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-violet-600 transition-all duration-300 group whitespace-nowrap shadow-[0_0_20px_rgba(139,92,246,0.6)] hover:scale-105"
                >
                  Send Message
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
