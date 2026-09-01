import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
  { 
    title: 'Frontend Engineering', 
    desc: 'Crafting responsive and interactive user interfaces using React, JavaScript, HTML5, CSS3, and Tailwind CSS.', 
    tag: 'UI / INTERACTION',
    skills: ['React', 'JavaScript', 'Tailwind CSS', 'HTML5', 'CSS3'] 
  },
  { 
    title: 'Backend & Databases', 
    desc: 'Building secure REST APIs, authentication flows, server-side applications, and high-performance database architectures.', 
    tag: 'ARCHITECTURE',
    skills: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'DQL'] 
  },
  { 
    title: 'AI & Machine Learning', 
    desc: 'Developing intelligent applications leveraging NLP, generative AI workflows, computer vision, and LLM systems.', 
    tag: 'INTELLIGENCE',
    skills: ['NLP', 'Generative AI', 'Computer Vision', 'LLMs', 'AWS AI'] 
  },
  { 
    title: 'Cloud & DevOps', 
    desc: 'Deploying and scaling production-grade applications using Docker containers, GitHub Actions, and CI/CD pipelines.', 
    tag: 'INFRASTRUCTURE',
    skills: ['Docker', 'GitHub', 'CI/CD Pipelines', 'Render', 'Docker Hub'] 
  },
  { 
    title: 'Algorithmic Problem Solving', 
    desc: 'Optimizing data structures and solving complex algorithmic challenges across competitive programming platforms.', 
    tag: 'COMPETITIVE',
    skills: ['Data Structures', 'Algorithms', 'LeetCode', 'CodeChef', 'GFG'] 
  },
  { 
    title: 'Tools & Ecosystem', 
    desc: 'Equipped with industry-grade instruments for version control, productivity extensions, and workflow management.', 
    tag: 'PRODUCTIVITY',
    skills: ['Git', 'Chrome APIs', 'Adobe Express', 'Google Cloud', 'VS Code'] 
  },
];

const Skills = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const bgRefs = useRef([]);
  const textRefs = useRef([]);
  const desktopRafRef = useRef(0);
  const mobileRafRef = useRef(0);
  const latestDesktopProgressRef = useRef(0);
  const activeMobileIndexRef = useRef(0);

  const handleScroll = (e) => {
    if (window.innerWidth >= 769) return;
    const container = e.currentTarget;

    // Collapse bursts of native scroll events into one browser paint frame.
    if (mobileRafRef.current) return;

    mobileRafRef.current = requestAnimationFrame(() => {
      mobileRafRef.current = 0;

      const center = container.scrollLeft + container.clientWidth / 2;
      let activeIdx = 0;
      let minDiff = Infinity;

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const diff = Math.abs(cardCenter - center);
        if (diff < minDiff) {
          minDiff = diff;
          activeIdx = i;
        }
      });

      // Do not restart the exact same animation while the user is still scrolling.
      if (activeIdx === activeMobileIndexRef.current) return;
      activeMobileIndexRef.current = activeIdx;

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.to(card, {
          scale: i === activeIdx ? 1 : 0.9,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: true,
        });
      });

      bgRefs.current.forEach((bg, i) => {
        if (bg) {
          gsap.to(bg, {
            opacity: i === activeIdx ? 1 : 0,
            duration: 0.4,
            overwrite: true,
          });
        }
      });

      textRefs.current.forEach((txt, i) => {
        if (txt) {
          gsap.to(txt, {
            opacity: i === activeIdx ? 1 : 0,
            duration: 0.4,
            overwrite: true,
          });
        }
      });
    });
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 769px)', () => {
        const updateCards = (p) => {
          // Preserve the exact existing animation math.
          const radius = 1800;
          const angleSpread = 18;

          cardsRef.current.forEach((card, i) => {
            if (!card) return;

            const offset = i - p;
            const angle = offset * angleSpread;
            const rad = angle * Math.PI / 180;
            const x = Math.sin(rad) * radius;
            const y = radius - (Math.cos(rad) * radius);
            const z = -Math.abs(offset) * 50;
            const absOffset = Math.abs(offset);
            const scale = Math.max(0.4, 1 - absOffset * 0.15);
            const opacity = Math.max(0.1, 1 - absOffset * 0.3);
            const zIndex = Math.round(100 - absOffset * 10);

            // One compositor-friendly transform write instead of gsap.set()
            // parsing and rebuilding multiple transform properties each frame.
            card.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateZ(${angle}deg) scale(${scale})`;
            card.style.opacity = String(opacity);
            card.style.zIndex = String(zIndex);
          });

          bgRefs.current.forEach((bg, i) => {
            if (!bg) return;
            const itemOpacity = Math.max(0, 1 - Math.abs(i - p));
            bg.style.opacity = String(itemOpacity);
            if (textRefs.current[i]) {
              textRefs.current[i].style.opacity = String(itemOpacity);
            }
          });
        };

        updateCards(0);

        const trigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=500%',
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            latestDesktopProgressRef.current = self.progress * (skillCategories.length - 1);

            // Never render more than once per display frame.
            if (desktopRafRef.current) return;

            desktopRafRef.current = requestAnimationFrame(() => {
              desktopRafRef.current = 0;
              updateCards(latestDesktopProgressRef.current);
            });
          },
        });

        return () => {
          trigger.kill();
          if (desktopRafRef.current) {
            cancelAnimationFrame(desktopRafRef.current);
            desktopRafRef.current = 0;
          }
        };
      });

      mm.add('(max-width: 768px)', () => {
        cardsRef.current.forEach((card, i) => {
          if (!card) return;
          gsap.set(card, { clearProps: 'x,y,z,rotation,opacity,position' });
          gsap.set(card, { scale: i === 0 ? 1 : 0.9 });
        });

        bgRefs.current.forEach((bg, i) => {
          if (bg) gsap.set(bg, { clearProps: 'all', opacity: i === 0 ? 1 : 0 });
        });

        textRefs.current.forEach((txt, i) => {
          if (txt) gsap.set(txt, { clearProps: 'all', opacity: i === 0 ? 1 : 0 });
        });

        activeMobileIndexRef.current = 0;

        return () => {
          if (mobileRafRef.current) {
            cancelAnimationFrame(mobileRafRef.current);
            mobileRafRef.current = 0;
          }
        };
      });
    }, sectionRef);

    return () => {
      if (desktopRafRef.current) cancelAnimationFrame(desktopRafRef.current);
      if (mobileRafRef.current) cancelAnimationFrame(mobileRafRef.current);
      ctx.revert();
    };
  }, []);

  return (
    <section 
      id="skills"
      ref={sectionRef} 
      className="relative w-full h-screen bg-[#0b0b0b] text-white overflow-hidden flex items-center justify-center md:[perspective:1000px] select-none"
    >
      {/* Dynamic Netflix Dark Background Vignettes */}
      {skillCategories.map((_, i) => (
        <div 
          key={i}
          ref={el => bgRefs.current[i] = el}
          className="absolute inset-0 z-0 pointer-events-none opacity-0 bg-gradient-to-tr from-black via-[#140203] to-black"
          style={{ willChange: 'opacity', transform: 'translateZ(0)' }}
        />
      ))}

      {/* Massive Background Typography (Netflix Red & White Outline) */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        {skillCategories.map((_, i) => (
          <h1 
            key={`text-${i}`}
            ref={el => textRefs.current[i] = el}
            className="absolute text-[22vw] md:text-[18vw] font-black uppercase text-transparent leading-none tracking-tighter mix-blend-overlay"
            style={{ 
               WebkitTextStroke: `2px ${i % 2 === 0 ? 'rgba(229,9,20,0.3)' : 'rgba(255,255,255,0.15)'}`,
               opacity: 0,
               willChange: 'opacity',
            }}
          >
            SKILLS
          </h1>
        ))}
      </div>

      {/* Carousel Container */}
      <div 
        className="relative w-full h-full flex md:items-center md:justify-center z-10 md:[transform-style:preserve-3d] overflow-x-auto overflow-y-hidden md:overflow-visible snap-x snap-mandatory scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] items-center px-[10vw] md:px-0 gap-4 md:gap-0 touch-pan-x"
        onScroll={handleScroll}
      >
        {skillCategories.map((category, i) => (
          <div 
            key={i}
            ref={el => cardsRef.current[i] = el}
            className="md:absolute relative shrink-0 snap-center w-[82vw] sm:w-[360px] md:w-[440px] h-[460px] md:h-[540px] rounded-[32px] p-8 md:p-10 bg-[#141414]/95 backdrop-blur-2xl border border-white/15 flex flex-col justify-between overflow-hidden group shadow-[0_30px_60px_rgba(0,0,0,0.9)] hover:border-violet-500/80 transition-colors duration-500"
            style={{ willChange: 'transform, opacity', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
          >
            {/* Inner Red Glossy Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20" />
            
            {/* Top Card Metadata */}
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-400 bg-violet-500/10 px-3 py-1 rounded border border-violet-500/20">
                {category.tag}
              </span>
              <span className="text-xs font-mono text-white/40">
                [ 0{i + 1} / 06 ]
              </span>
            </div>

            {/* Middle Title & Description */}
            <div className="space-y-4 relative z-10 my-auto">
              <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight group-hover:text-cyan-400 transition-colors duration-300">
                {category.title}
              </h3>
              <p className="text-sm md:text-base text-white/70 font-light leading-relaxed">
                {category.desc}
              </p>
            </div>

            {/* Bottom Skill Badges */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10 relative z-10">
              {category.skills.map((skill, sIdx) => (
                <span 
                  key={sIdx}
                  className="text-xs font-mono text-white/80 bg-white/5 border border-white/10 px-3 py-1 rounded group-hover:border-violet-500/30 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Bottom Glow Accent */}
            <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-violet-500 group-hover:shadow-[0_0_15px_#8B5CF6] transition-all" />
          </div>
        ))}
      </div>

    </section>
  );
};

export default Skills;