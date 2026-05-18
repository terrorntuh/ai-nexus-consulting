'use client';

import React, { useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, isTextUIPart, type UIMessage } from 'ai';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AIText } from '@/components/AIText';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, AlertCircle, Calendar } from 'lucide-react';

const suggestedStarters = [
    "How can AI improve my business operations?",
    "What's the ROI of implementing an AI strategy?",
    "How do you handle data privacy and POPIA compliance?",
];

export function ConsultantBot() {
    const [input, setInput] = React.useState('');
    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/consultant-bot',
        }),
    });

    const isLoading = status === 'submitted' || status === 'streaming';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        sendMessage({ text: input });
        setInput('');
    };

    const handleSuggestion = (text: string) => {
        sendMessage({ text });
    };

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <Card className="glass border-white/5 flex flex-col h-[600px] overflow-hidden">
            <CardHeader className="border-b border-white/5 bg-charcoal-light/40">
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2 border-gold">
                        <AvatarFallback className="bg-gold text-charcoal font-bold">N</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-gold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
                            <AIText tech="Lead Consultant AI" plain="Chat with Ntuh" />
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald rounded-full animate-pulse" />
                            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Active Now</span>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden p-0 relative">
                <ScrollArea ref={scrollRef} className="h-full p-6 space-y-6">
                    <div className="space-y-6">
                        {/* Welcome message */}
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20 shrink-0">
                                <Bot className="w-4 h-4 text-gold" />
                            </div>
                            <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                                <p className="text-sm leading-relaxed">
                                    Greetings. I am the AI reflection of Ntuh. How can I assist you in navigating the AI landscape today?
                                </p>
                            </div>
                        </div>

                        {/* Suggested starters (show only if no messages) */}
                        {messages.length === 0 && (
                            <div className="space-y-2 pl-11">
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Try asking:</p>
                                <div className="flex flex-col gap-2">
                                    {suggestedStarters.map((starter) => (
                                        <button
                                            key={starter}
                                            onClick={() => handleSuggestion(starter)}
                                            className="text-left text-xs px-3 py-2 rounded-lg glass text-white/50 hover:text-gold hover:border-gold/20 transition-colors cursor-pointer"
                                        >
                                            {starter}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <AnimatePresence>
                            {messages.map((m: UIMessage) => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${m.role === 'user' ? 'bg-pink/10 border-pink/20' : 'bg-gold/10 border-gold/20'
                                        }`}>
                                        {m.role === 'user' ? <User className="w-4 h-4 text-pink" /> : <Bot className="w-4 h-4 text-gold" />}
                                    </div>
                                    <div className={`rounded-2xl p-4 max-w-[80%] ${m.role === 'user'
                                        ? 'bg-pink text-white rounded-tr-none'
                                        : 'bg-white/5 text-white rounded-tl-none'
                                        }`}>
                                        <p className="text-sm leading-relaxed">
                                            {m.parts.filter(isTextUIPart).map((p) => p.text).join('')}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Typing indicator */}
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex gap-3"
                            >
                                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20 shrink-0">
                                    <Bot className="w-4 h-4 text-gold" />
                                </div>
                                <div className="bg-white/5 rounded-2xl rounded-tl-none p-4">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-gold/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-gold/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-gold/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </ScrollArea>

                {/* Human Eject Prompt */}
                <AnimatePresence>
                    {messages.length > 4 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%]"
                        >
                            <Button
                                variant="destructive"
                                className="w-full h-12 rounded-xl bg-pink hover:bg-pink-light text-white shadow-lg shadow-pink/20 flex items-center justify-center gap-2 group"
                                onClick={() => window.open('https://calendly.com/ntuh', '_blank')}
                            >
                                <AlertCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="font-bold text-xs uppercase tracking-wider">High Complexity? Speak with Ntuh directly</span>
                                <Calendar className="ml-auto w-4 h-4 opacity-50" />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>

            <CardFooter className="p-4 border-t border-white/5 bg-charcoal-light/40">
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Describe your enterprise challenge..."
                        className="flex-1 bg-charcoal/80 border-white/5 text-white focus:ring-gold"
                    />
                    <Button type="submit" size="icon" disabled={isLoading} className="bg-gold text-charcoal hover:bg-gold-light rounded-full">
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
