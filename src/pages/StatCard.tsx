import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface StatCardProps {
  stat: { number: number; label: string; suffix: string };
  delay?: number;
}

export function StatCard({ stat, delay = 0 }: StatCardProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            let start = 0;
            const duration = 2000; // 2 saniye
            const increment = stat.number / (duration / 16);

            const timer = setInterval(() => {
              start += increment;
              if (start >= stat.number) {
                setCount(stat.number);
                clearInterval(timer);
              } else {
                setCount(Number(start.toFixed(stat.number % 1 !== 0 ? 1 : 0)));
              }
            }, 16);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [stat.number, hasAnimated]);

  const display = stat.number >= 1000
    ? `${Math.floor(count / 1000)}${stat.suffix}`
    : `${count}${stat.suffix}`;

  return (
    <motion.div
      ref={ref}
      className="stat-card bg-gradient-to-r from-orange-500 to-orange-400 p-6 rounded-2xl text-center text-white shadow-lg cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ translateY: -5, scale: 1.03, boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="stat-number text-3xl font-bold">{display}</div>
      <div className="stat-label text-sm opacity-90 mt-2">{stat.label}</div>
    </motion.div>
  );
}
