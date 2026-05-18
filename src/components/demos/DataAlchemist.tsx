'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { AIText } from '@/components/AIText';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Play, FileJson, ArrowRightLeft } from 'lucide-react';

export function DataAlchemist() {
    const [isTransforming, setIsTransforming] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleTransform = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsTransforming(true);
        setResult(null);

        // Simulate ETL process delay
        setTimeout(() => {
            const cleanedData = [
                { id: "USR-001", name: "Alice Johnson", signup_date: "2023-11-01T00:00:00Z", status: "ACTIVE" },
                { id: "USR-002", name: "Bob Smith", signup_date: "2023-11-15T00:00:00Z", status: "PENDING" },
                { id: "USR-003", name: "Charlie Davis", signup_date: "2023-12-05T00:00:00Z", status: "ACTIVE" }
            ];
            setResult(JSON.stringify(cleanedData, null, 2));
            setIsTransforming(false);
        }, 1500);
    };

    const messyData = `id, Full_Name, Date joined, acc_status\n1, Alice Johnson, 11/1/23, 1\n2, bob smith  , nov 15th, 0\n3, Charlie Davis , 2023-12-05, 1\n4, NULL, NULL, NULL`;

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-start">
            <Card className="glass border-white/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gold/80" style={{ fontFamily: 'var(--font-heading)' }}>
                        <Database className="w-5 h-5" />
                        <AIText tech="ETL Ingestion Node" plain="Messy Data Input" />
                    </CardTitle>
                    <CardDescription className="text-white/40">
                        Drop messy CSVs or unstructured logs to simulate our automated AI data cleaning pipelines.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleTransform} className="space-y-4">
                        <Textarea
                            name="data"
                            defaultValue={messyData}
                            className="min-h-[200px] bg-charcoal/60 border-white/5 text-white/60 font-mono text-xs focus:ring-gold/50"
                        />

                        <Button
                            type="submit"
                            disabled={isTransforming}
                            className="w-full bg-white/10 text-white hover:bg-white/20 font-bold border border-white/5"
                        >
                            {isTransforming ? "Aligning Schemas..." : "Start Data Transformation"}
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
                            <Card className="glass border-white/10 overflow-hidden">
                                <div className="h-1 bg-gradient-to-r from-emerald-500/50 to-blue-500/50" />
                                <CardHeader>
                                    <CardTitle className="text-emerald-400 flex items-center justify-between" style={{ fontFamily: 'var(--font-heading)' }}>
                                        <div className="flex items-center gap-2">
                                            <FileJson className="w-5 h-5" />
                                            Cleaned JSON Payload
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 bg-charcoal/80 rounded-lg border border-white/5 font-mono text-xs overflow-x-auto text-emerald-400/80">
                                        <pre>{result}</pre>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="p-3 glass rounded-lg border border-white/5">
                                            <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Standardized</div>
                                            <div className="text-xs text-white/70">ISO-8601 Dates</div>
                                        </div>
                                        <div className="p-3 glass rounded-lg border border-white/5">
                                            <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Cleaned</div>
                                            <div className="text-xs text-white/70">Removed Null Rows</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <div className="h-full min-h-[400px] border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center text-white/20">
                            <div className="text-center space-y-4">
                                {isTransforming ? (
                                    <>
                                        <ArrowRightLeft className="w-12 h-12 mx-auto text-emerald-400/50 animate-spin-slow" />
                                        <p className="max-w-[200px] text-sm text-emerald-400/80 font-mono">Mapping schemas and resolving types...</p>
                                    </>
                                ) : (
                                    <>
                                        <Database className="w-12 h-12 mx-auto opacity-20" />
                                        <p className="max-w-[200px] text-sm">Transformed data structures will appear here.</p>
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
