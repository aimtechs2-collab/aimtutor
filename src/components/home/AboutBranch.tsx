"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Users,
  Award,
  Building2,
  GraduationCap,
  Lightbulb,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  PlayCircle,
  Phone,
} from "lucide-react";
import type { Translations } from "@/translations/en";

function useInView(threshold = 0.3) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) setIsInView(true);
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.unobserve(el);
  }, [threshold, isInView]);

  return [ref, isInView] as const;
}

function useCountAnimation(end: string, duration: number, isInView: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const endValue = parseInt(end.replace(/[^0-9]/g, ""), 10);
    const startTime = Date.now();
    let rafId: number;

    const update = () => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOut * endValue));
      if (progress < 1) rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [end, duration, isInView]);

  return count;
}

type StatItem = {
  number: string;
  suffix: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  duration: number;
  color: string;
};

function AnimatedStat({
  stat,
  index,
  isInView,
}: {
  stat: StatItem;
  index: number;
  isInView: boolean;
}) {
  const Icon = stat.icon;
  const count = useCountAnimation(stat.number, stat.duration, isInView);
  const display = stat.number === "10000" && count >= 10000 ? "10K" : count.toLocaleString();

  return (
    <div className="text-center group">
      <div
        className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br ${stat.color} rounded-xl sm:rounded-2xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg relative overflow-hidden`}
      >
        <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white relative z-10" />
      </div>
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2 tabular-nums">
        <span>{display}</span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
          {stat.suffix}
        </span>
      </div>
      <div className="text-xs sm:text-sm text-gray-600 font-medium">{stat.label}</div>
      <div className="mt-2 sm:mt-3 h-0.5 sm:h-1 bg-gray-200 rounded-full overflow-hidden max-w-[60px] sm:max-w-[80px] mx-auto">
        <div
          className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-[2000ms] ease-out`}
          style={{ width: isInView ? "100%" : "0%", transitionDelay: `${index * 100}ms` }}
        />
      </div>
    </div>
  );
}

export default function AboutBranch({ locPrefix, translations: tt }: { locPrefix: string; translations: Translations }) {
  const [statsRef, statsInView] = useInView(0.3);

  const stats: StatItem[] = [
    { number: "10000", suffix: "+", label: tt.stats.studentsTrained, icon: GraduationCap, duration: 2500, color: "from-blue-500 to-cyan-500" },
    { number: "5000", suffix: "+", label: tt.stats.studentsPlaced, icon: Building2, duration: 2000, color: "from-purple-500 to-pink-500" },
    { number: "95", suffix: "%", label: tt.stats.successRate, icon: TrendingUp, duration: 2200, color: "from-emerald-500 to-green-500" },
    { number: "50", suffix: "+", label: tt.stats.expertTrainers, icon: Users, duration: 1800, color: "from-orange-500 to-red-500" },
  ];

  const services = [
    {
      title: tt.services.corporateTraining,
      description: tt.services.corporateDescription,
      features: tt.services.corporateFeatures,
      icon: Building2,
    },
    {
      title: tt.services.professionalCourses,
      description: tt.services.professionalDescription,
      features: tt.services.professionalFeatures,
      icon: GraduationCap,
    },
    {
      title: tt.services.consultancy,
      description: tt.services.consultancyDescription,
      features: tt.services.consultancyFeatures,
      icon: Lightbulb,
    },
  ];

  return (
    <div className="font-sans text-gray-900 bg-white">
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-60 h-60 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-cyan-500 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={statsRef}>
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              <Award className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{tt.stats.ourAchievements}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {tt.stats.numbersThatSpeak}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">{tt.stats.speak}</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
              {tt.stats.impactDescription}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <AnimatedStat key={index} stat={stat} index={index} isInView={statsInView} />
            ))}
          </div>

          {statsInView && (
            <div className="mt-8 sm:mt-10 md:mt-12 text-center">
              <p className="text-xs sm:text-sm text-gray-500 px-4 sm:px-0">
                {tt.stats.statsUpdated} • Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 text-gray-300 relative overflow-hidden">
        <div className="relative border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-800/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-slate-700/50 relative overflow-hidden">
              <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
                <div className="max-w-2xl text-center lg:text-left">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                    {tt.cta.readyToAccelerate}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-gray-300">
                    {tt.cta.joinThousands}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto lg:w-auto max-w-md sm:max-w-none">
                  <Link
                    href={`${locPrefix}/training`}
                    className="group px-6 py-3 sm:px-7 sm:py-3.5 lg:px-8 lg:py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto sm:min-w-[180px] lg:min-w-[200px] whitespace-nowrap"
                  >
                    <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span>{tt.cta.exploreCourses}</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href={`${locPrefix}/contact`}
                    className="px-6 py-3 sm:px-7 sm:py-3.5 lg:px-8 lg:py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 inline-flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto sm:min-w-[160px] lg:min-w-[180px] whitespace-nowrap"
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span>{tt.cta.contactUs}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">{tt.services.whatWeOffer}</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
              {tt.services.offerDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  <div className="relative bg-white border-2 border-gray-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-blue-200 transition-colors duration-300">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{service.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">{service.description}</p>
                    <ul className="space-y-2 sm:space-y-3">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700">
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
