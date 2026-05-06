'use client';

import React from 'react';
import { usePlainEnglish } from '@/hooks/usePlainEnglish';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';

export function PlainEnglishToggle() {
    const { isPlain, togglePlain } = usePlainEnglish();

    return (
        <div className="flex items-center space-x-3 bg-charcoal/50 backdrop-blur-md p-2 px-4 rounded-full border border-gold/20 shadow-lg shadow-gold/5">
            <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                <Label htmlFor="plain-english" className="text-xs font-medium text-gold/80 uppercase tracking-widest cursor-pointer">
                    {isPlain ? "Plain English" : "Professional AI"}
                </Label>
            </div>
            <Switch
                id="plain-english"
                checked={isPlain}
                onCheckedChange={togglePlain}
                className="data-[state=checked]:bg-gold"
            />
        </div>
    );
}
