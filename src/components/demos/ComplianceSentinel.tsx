'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { AIText } from '@/components/AIText';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Play, Lock, FileLock2 } from 'lucide-react';

export function ComplianceSentinel() {
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState<{ original: string, redacted: string[], threatLevel: string } | null>(null);

    const handleScan = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const text = formData.get('text') as string;

        if (!text?.trim()) return;

        setIsScanning(true);
        setResult(null);

        // Simulate an AI scan delay
        setTimeout(() => {
            // Fake redaction logic for demo purposes
            let redactedText = text;
            const piiMatches = text.match(/\b(?:\d{13}|\d{10}|\w+@\w+\.\w+)\b/g) || [];

            piiMatches.forEach(match => {
                redactedText = redactedText.replace(match, `<span class="bg-red-500/20 text-red-400 px-1 rounded mx-0.5 line-through decoration-red-500/50">${match}</span>`);
            });

            setResult({
                original: text,
                redacted: [redactedText], // Simulated steps
                threatLevel: piiMatches.length > 2 ? 'High (POPIA Violation Risk)' : piiMatches.length > 0 ? 'Medium (PII Detected)' : 'Safe'
            });
            setIsScanning(false);
        }, 1200);
    };

    const sampleText = "Client Name: John Doe. ID Number: 8503125043081. Email: john@example.com. Phone: 0825551234. Discussed enterprise contract worth R5M.";

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-start">
            <Card className="glass border-white/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-pink" style={{ fontFamily: 'var(--font-heading)' }}>
                        <ShieldCheck className="w-5 h-5" />
                        <AIText tech="PII Detection Flow" plain="Data Privacy Scanner" />
                    </CardTitle>
                    <CardDescription className="text-white/40">
                        Paste text to simulate an edge-hosted compliance scan that intercepts and redacts PII before it reaches external LLMs.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleScan} className="space-y-4">
                        <Textarea
                            name="text"
                            defaultValue={sampleText}
                            className="min-h-[200px] bg-charcoal/60 border-white/5 text-white/80 font-mono text-sm focus:ring-pink"
                        />

                        <Button
                            type="submit"
                            disabled={isScanning}
                            className="w-full bg-pink text-white hover:bg-pink/80 font-bold shadow-[0_0_15px_rgba(233,30,99,0.2)]"
                        >
                            {isScanning ? "Scanning..." : "Run Compliance Scan"}
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
                            <Card className="glass border-pink/20 overflow-hidden">
                                <div className="h-1 bg-gradient-to-r from-pink to-pink/20" />
                                <CardHeader>
                                    <CardTitle className="text-pink flex items-center justify-between" style={{ fontFamily: 'var(--font-heading)' }}>
                                        <div className="flex items-center gap-2">
                                            <FileLock2 className="w-5 h-5" />
                                            Intercepted Payload
                                        </div>
                                        <div className={`text-xs px-2 py-1 rounded border ${result.threatLevel.includes('High') ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-pink/10 text-pink border-pink/20'}`}>
                                            Risk: {result.threatLevel}
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 bg-charcoal/80 rounded-lg border border-white/5 font-mono text-xs overflow-x-auto text-white/50 leading-loose" dangerouslySetInnerHTML={{ __html: result.redacted[0] }} />

                                    <div className="p-4 rounded-lg bg-pink/5 border border-pink/20 flex items-start gap-3">
                                        <Lock className="w-5 h-5 text-pink shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-pink font-medium">Safe for LLM Processing</p>
                                            <p className="text-xs text-pink/60 mt-1">
                                                All identified PII has been redacted from the payload. This text can now be safely sent to third-party AI models without violating POPIA or GDPR guidelines.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <div className="h-full min-h-[400px] border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center text-white/20">
                            <div className="text-center space-y-4">
                                {isScanning ? (
                                    <>
                                        <ShieldCheck className="w-12 h-12 mx-auto text-pink animate-pulse" />
                                        <p className="max-w-[200px] text-sm text-pink/80 font-mono">Running regex filters and NLP scanning...</p>
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-12 h-12 mx-auto opacity-20" />
                                        <p className="max-w-[200px] text-sm">Intercepted API payloads will appear here.</p>
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
