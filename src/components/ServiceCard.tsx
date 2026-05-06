'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Database, Bot, GraduationCap, LucideIcon, ArrowRight } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    Brain,
    Database,
    Bot,
    GraduationCap,
};

interface ServiceCardProps {
    iconName: string;
    title: string;
    description: string;
    accentColor?: 'gold' | 'pink';
    index: number;
}

export function ServiceCard({ iconName, title, description, accentColor = 'gold', index }: ServiceCardProps) {
    const Icon = iconMap[iconName] || Brain;
    const isGold = accentColor === 'gold';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
        >
            <div className={`relative rounded-2xl p-8 h-full flex flex-col transition-all duration-500 border ${isGold
                ? 'glass-gold hover:shadow-[0_0_40px_rgba(245,197,24,0.08)]'
                : 'glass-pink hover:shadow-[0_0_40px_rgba(233,30,99,0.08)]'
                } hover:-translate-y-1`}>
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 ${isGold
                    ? 'bg-gold/10 text-gold group-hover:bg-gold/20'
                    : 'bg-pink/10 text-pink group-hover:bg-pink/20'
                    }`}>
                    <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3
                    className="text-lg font-bold mb-3 text-white group-hover:text-gold transition-colors"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    {title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed mb-6 flex-1">
                    {description}
                </p>

                {/* CTA */}
                <a
                    href="https://calendly.com/ntuh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${isGold ? 'text-gold/60 hover:text-gold' : 'text-pink/60 hover:text-pink'
                        }`}
                >
                    Book a Consultation
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-8 right-8 h-px transition-all duration-500 ${isGold
                    ? 'bg-gradient-to-r from-transparent via-gold/30 to-transparent group-hover:via-gold/60'
                    : 'bg-gradient-to-r from-transparent via-pink/30 to-transparent group-hover:via-pink/60'
                    }`} />
            </div>
        </motion.div>
    );
}
