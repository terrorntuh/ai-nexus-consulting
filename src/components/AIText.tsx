'use client';

import React from 'react';
import { usePlainEnglish } from '@/hooks/usePlainEnglish';
import { motion, AnimatePresence } from 'framer-motion';

interface AITextProps {
    tech: React.ReactNode;
    plain: React.ReactNode;
    className?: string;
}

export function AIText({ tech, plain, className }: AITextProps) {
    const { isPlain } = usePlainEnglish();

    return (
        <div className={`relative inline-block ${className}`}>
            <AnimatePresence mode="wait">
                <motion.span
                    key={isPlain ? 'plain' : 'tech'}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                >
                    {isPlain ? plain : tech}
                </motion.span>
            </AnimatePresence>
        </div>
    );
}
