'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, ArrowRight, Clock } from 'lucide-react';

interface AgentCardProps {
    name: string;
    role: string;
    description: string;
    capabilities: string[];
    status: 'active' | 'training' | 'standby';
    index: number;
}

export function AgentCard({ name, role, description, capabilities, status, index }: AgentCardProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    const statusStyles = {
        active: { dot: 'bg-emerald-500', text: 'text-emerald-400', label: 'Active' },
        training: { dot: 'bg-gold', text: 'text-gold', label: 'Training' },
        standby: { dot: 'bg-white/30', text: 'text-white/40', label: 'Standby' },
    };

    const s = statusStyles[status];

    const handleDeploy = () => {
        if (status === 'active') {
            // Scroll to demos section
            document.getElementById('demos')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Show "coming soon" tooltip
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 2000);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.12 }}
            className="group"
        >
            <div className="glass rounded-2xl p-6 h-full flex flex-col hover:-translate-y-1 transition-all duration-500 hover:shadow-[0_0_40px_rgba(245,197,24,0.06)]">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/20 to-pink/10 flex items-center justify-center border border-white/5">
                        <Bot className="w-7 h-7 text-gold" />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${s.dot} ${status === 'active' ? 'animate-pulse' : ''}`} />
                        <span className={`text-[10px] uppercase tracking-widest font-bold ${s.text}`}>
                            {s.label}
                        </span>
                    </div>
                </div>

                {/* Info */}
                <h3 className="text-base font-bold text-white mb-0.5" style={{ fontFamily: 'var(--font-heading)' }}>
                    {name}
                </h3>
                <p className="text-xs text-gold/70 font-medium uppercase tracking-wider mb-3">{role}</p>
                <p className="text-sm text-white/40 leading-relaxed mb-5 flex-1">{description}</p>

                {/* Capabilities */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                    {capabilities.map((cap) => (
                        <Badge
                            key={cap}
                            variant="outline"
                            className="text-[10px] border-white/10 text-white/50 bg-white/[0.02] px-2 py-0.5"
                        >
                            {cap}
                        </Badge>
                    ))}
                </div>

                {/* CTA */}
                <div className="relative">
                    <Button
                        variant="outline"
                        className={`w-full transition-all group/btn ${status === 'active'
                                ? 'border-gold/20 text-gold hover:bg-gold/10 hover:border-gold/40'
                                : 'border-white/10 text-white/40 hover:bg-white/5 hover:border-white/20'
                            }`}
                        size="sm"
                        onClick={handleDeploy}
                    >
                        {status === 'active' ? (
                            <>
                                Deploy Agent
                                <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                            </>
                        ) : (
                            <>
                                <Clock className="mr-2 w-3.5 h-3.5" />
                                Coming Soon
                            </>
                        )}
                    </Button>

                    {/* Tooltip */}
                    <AnimatePresence>
                        {showTooltip && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 8 }}
                                className="absolute -top-10 left-1/2 -translate-x-1/2 glass px-3 py-1.5 rounded-lg text-[10px] text-gold font-bold whitespace-nowrap z-10"
                            >
                                This agent is currently in {status} mode
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
