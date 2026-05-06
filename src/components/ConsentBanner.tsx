'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X } from 'lucide-react';

export function ConsentBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('ai-nexus-consent');
        if (!consent) {
            queueMicrotask(() => setIsVisible(true));
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('ai-nexus-consent', 'true');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[100]"
                >
                    <div className="relative overflow-hidden rounded-md border border-ink/12 bg-paper/96 p-5 shadow-2xl shadow-ink/15 backdrop-blur-2xl">
                        <div className="absolute top-0 right-0 p-2">
                            <button onClick={() => setIsVisible(false)} className="text-ink/32 hover:text-ink transition-colors" aria-label="Dismiss privacy notice">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-blueprint/8 flex items-center justify-center shrink-0 border border-blueprint/15">
                                <ShieldCheck className="w-6 h-6 text-blueprint" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-black text-ink uppercase tracking-[0.16em] text-xs">Privacy & Compliance</h3>
                                <p className="text-xs text-ink/62 leading-relaxed">
                                    We value your digital sovereignty. By using our demos, you consent to POPIA-aware data handling for usage logs and lead generation.
                                </p>
                                <div className="pt-2">
                                    <Button
                                        onClick={handleAccept}
                                        className="w-full bg-ink text-white hover:bg-blueprint font-bold text-xs h-10 rounded-md"
                                    >
                                        Acknowledge
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
