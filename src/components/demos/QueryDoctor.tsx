'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { AIText } from '@/components/AIText';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Play, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

export function QueryDoctor() {
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleOptimize = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setResult(null);
        setError(null);
        const formData = new FormData(e.currentTarget);
        const sql = formData.get('sql') as string;

        if (!sql?.trim()) {
            setError('Please enter a SQL query first.');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/query-doctor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: sql }),
            });

            if (!res.ok) throw new Error(`Server error: ${res.status}`);

            const text = await res.text();
            // Strip markdown code blocks if Gemini wraps in ```json ... ```
            let cleaned = text.trim();
            cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
            const parsed = JSON.parse(cleaned);
            setResult(parsed);
        } catch (e) {
            console.error("Query Doctor error:", e);
            setError('AI returned an unexpected format. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const sampleQueries = [
        "SELECT * FROM users WHERE active = true ORDER BY created_at DESC",
        "SELECT u.*, o.* FROM users u JOIN orders o ON u.id = o.user_id WHERE o.status = 'pending'",
        "SELECT COUNT(*) FROM transactions WHERE DATE(created_at) = CURDATE()",
    ];

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-start">
            <Card className="glass border-white/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gold" style={{ fontFamily: 'var(--font-heading)' }}>
                        <Activity className="w-5 h-5" />
                        <AIText tech="SQL Input" plain="Enter your code" />
                    </CardTitle>
                    <CardDescription className="text-white/40">
                        Paste your raw SQL query here for AI-driven optimization.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleOptimize} className="space-y-4">
                        <Textarea
                            name="sql"
                            placeholder="SELECT * FROM users WHERE active = true..."
                            className="min-h-[200px] bg-charcoal/60 border-white/5 text-white font-mono text-sm focus:ring-gold"
                        />

                        {/* Sample SQL buttons */}
                        <div className="space-y-2">
                            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Try a sample:</p>
                            <div className="flex flex-wrap gap-2">
                                {sampleQueries.map((q, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={(e) => {
                                            const form = (e.target as HTMLElement).closest('form');
                                            const textarea = form?.querySelector('textarea');
                                            if (textarea) textarea.value = q;
                                        }}
                                        className="text-[10px] px-2.5 py-1 rounded-full glass text-white/50 hover:text-gold hover:border-gold/20 transition-colors cursor-pointer"
                                    >
                                        Sample {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gold text-charcoal hover:bg-gold-light font-bold"
                        >
                            {isLoading ? "Consulting the Doctor..." : "Run Optimization"}
                            <Play className="ml-2 w-4 h-4 fill-current" />
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <AnimatePresence mode="wait">
                    {result ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <Card className="glass border-gold/20 overflow-hidden">
                                <div className="h-1 bg-gradient-to-r from-gold to-pink" />
                                <CardHeader>
                                    <CardTitle className="text-gold flex items-center justify-between" style={{ fontFamily: 'var(--font-heading)' }}>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5" />
                                            Optimized Query
                                        </div>
                                        <div className="text-xs px-2 py-1 rounded bg-gold/10 text-gold border border-gold/20">
                                            +{result.speed_improvement}% Potential
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 bg-charcoal/80 rounded-lg border border-white/5 font-mono text-xs overflow-x-auto text-gold/80">
                                        {result.optimized_sql}
                                    </div>
                                    <div className="p-4 rounded-lg bg-pink/5 border border-pink/20">
                                        <p className="text-sm text-pink font-medium italic">
                                            Doctor&apos;s Note: {result.explanation}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Visualization */}
                            <Card className="glass border-white/5">
                                <CardContent className="pt-6 space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-white/40 uppercase tracking-widest">
                                            <span>Execution Time</span>
                                            <span>100ms vs 20ms</span>
                                        </div>
                                        <div className="h-8 bg-charcoal/80 rounded-full overflow-hidden flex">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "100%" }}
                                                className="h-full bg-white/10 flex items-center px-4"
                                            >
                                                <span className="text-[10px] font-bold">Old</span>
                                            </motion.div>
                                        </div>
                                        <div className="h-8 bg-charcoal/80 rounded-full overflow-hidden flex">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${100 - result.speed_improvement}%` }}
                                                className="h-full bg-gold text-charcoal flex items-center px-4"
                                            >
                                                <span className="text-[10px] font-bold">New</span>
                                            </motion.div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Button
                                variant="destructive"
                                className="w-full h-14 rounded-xl glass hover:bg-white/5 flex items-center justify-center gap-3 group"
                                onClick={() => window.open('https://calendly.com/ntuh', '_blank')}
                            >
                                <AlertCircle className="w-5 h-5 text-pink group-hover:animate-pulse" />
                                <div className="text-left">
                                    <div className="text-xs text-white/40 uppercase font-bold tracking-tighter">Need more help?</div>
                                    <div className="font-bold">Book a 15-min call with Ntuh</div>
                                </div>
                                <Calendar className="ml-auto w-5 h-5 opacity-40" />
                            </Button>
                        </motion.div>
                    ) : (
                        <div className="h-full min-h-[400px] border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center text-white/20">
                            <div className="text-center space-y-4">
                                {error ? (
                                    <>
                                        <AlertCircle className="w-12 h-12 mx-auto text-red-400/60" />
                                        <p className="max-w-[250px] text-sm text-red-400/80">{error}</p>
                                    </>
                                ) : (
                                    <>
                                        <Activity className="w-12 h-12 mx-auto opacity-20" />
                                        <p className="max-w-[200px] text-sm">Optimization results will appear here after analysis.</p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
