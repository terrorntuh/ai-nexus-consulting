'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface TestimonialProps {
    quote: string;
    name: string;
    role: string;
    company: string;
    index: number;
}

export function Testimonial({ quote, name, role, company, index }: TestimonialProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="group"
        >
            <div className="glass rounded-2xl p-8 h-full flex flex-col hover:-translate-y-1 transition-all duration-500">
                <Quote className="w-8 h-8 text-gold/20 mb-4 group-hover:text-gold/40 transition-colors" />

                <blockquote className="text-sm text-white/70 leading-relaxed flex-1 mb-6 italic">
                    &ldquo;{quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/30 to-pink/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                            {name.split(' ').map(n => n[0]).join('')}
                        </span>
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-white">{name}</div>
                        <div className="text-xs text-white/40">
                            {role}, <span className="text-gold/60">{company}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
