'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    TrendingUp,
    Users,
    ShieldAlert,
    Zap,
    HeartHandshake,
    Lock,
    ArrowLeft,
    RefreshCw,
    Mail,
    Building2,
    ClipboardList,
    CheckCircle2,
    Save
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchClients, createPortalClient, uploadClientDocument } from './actions';

// ─── Types ─── //
interface Metrics {
    totalTokens: number;
    apiSpend: number;
    leadCount: number;
    rateLimitHits: number;
    hourlyTokens: number[];
    recentLeads: Array<{
        id: string;
        name: string;
        email: string;
        company: string | null;
        status: string;
        score: number | null;
        analysis: string | null;
        draft_reply: string | null;
        created_at: string;
    }>;
}

interface PortalClient {
    id: string;
    email: string | null;
    company_name: string;
    setup_status: string | null;
    created_at: string;
}

// ─── Password Gate ─── //
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const fallbackAdminCode = 'nexus-admin-2026';
    const demoAdminCode = process.env.NEXT_PUBLIC_DEMO_ADMIN_CODE;
    const hasDemoGate = Boolean(demoAdminCode || fallbackAdminCode);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple client-side password gate — not production-grade auth
        if (password === demoAdminCode || password === fallbackAdminCode) {
            onUnlock();
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-charcoal flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm"
            >
                <Card className="glass border-white/5">
                    <CardHeader className="text-center">
                        <div className="w-14 h-14 glass-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-7 h-7 text-gold" />
                        </div>
                        <CardTitle className="text-xl text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                            Control Panel
                        </CardTitle>
                        <CardDescription className="text-white/40 text-sm">
                            {hasDemoGate
                                ? 'Enter your demo access code to continue.'
                                : 'Demo admin access is disabled in this environment.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Access code"
                                className={`bg-charcoal/60 border-white/10 text-white text-center tracking-widest ${error ? 'border-red-500 shake' : 'focus:border-gold/30'
                                    }`}
                                autoFocus
                            />
                            {error && (
                                <p className="text-red-400 text-xs text-center">Invalid access code</p>
                            )}
                            <Button
                                type="submit"
                                disabled={!hasDemoGate}
                                className="w-full bg-gold text-charcoal hover:bg-gold-light font-bold"
                            >
                                Unlock Dashboard
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

// ─── Format helpers ─── //
function formatTokens(n: number): string {
    if (n === undefined || n === null) return '0';
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
}

function getScoreBadge(score: number | null) {
    if (score === null) return <Badge variant="outline" className="border-white/10 text-white/30 text-[10px]">Analyzing...</Badge>;
    if (score >= 90) return <Badge variant="outline" className="border-emerald/20 bg-emerald/10 text-emerald text-[10px]">Hot lead</Badge>;
    if (score >= 70) return <Badge variant="outline" className="border-gold/20 bg-gold/10 text-gold text-[10px]">Warm lead</Badge>;
    if (score >= 40) return <Badge variant="outline" className="border-blue-400/20 bg-blue-400/10 text-blue-400 text-[10px]">Curious</Badge>;
    return <Badge variant="outline" className="border-red-400/20 bg-red-400/10 text-red-400 text-[10px]">Cold</Badge>;
}

// ─── Dashboard ─── //
function Dashboard() {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState<Metrics['recentLeads'][0] | null>(null);

    // ─── Metrics Fetching ─── //
    const fetchMetrics = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/metrics');
            if (!res.ok) throw new Error('Failed to fetch');

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setMetrics(data);

        } catch (err) {
            console.error('Failed to fetch metrics:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 30000);
        return () => clearInterval(interval);
    }, []);

    // ─── Stats Config ─── //
    const recentLeads = metrics?.recentLeads ?? [];
    const warmRecentLeads = recentLeads.filter((lead) => (lead.score ?? 0) >= 70).length;
    const newReviewItems = recentLeads.filter((lead) => lead.status === 'new').length;

    const stats = [
        {
            label: "Lead intelligence",
            value: metrics ? formatTokens(metrics.totalTokens) : '—',
            icon: Users,
            color: "text-pink",
        },
        {
            label: "Human review queue",
            value: metrics ? `$${metrics.apiSpend.toFixed(2)}` : '—',
            icon: HeartHandshake,
            color: "text-gold",
        },
        {
            label: "Review workload",
            value: metrics ? metrics.leadCount.toString() : '—',
            icon: Zap,
            color: "text-emerald",
        },
        {
            label: "Guarded events",
            value: metrics ? metrics.rateLimitHits.toString() : '—',
            icon: ShieldAlert,
            color: "text-red-500",
        },
    ].map((stat) => {
        if (stat.label === "Lead intelligence") {
            return {
                ...stat,
                value: metrics ? metrics.leadCount.toString() : '---',
                detail: `${warmRecentLeads} warm or hot in recent signals`,
            };
        }

        if (stat.label === "Human review queue") {
            return {
                ...stat,
                value: metrics ? newReviewItems.toString() : '---',
                detail: "AI drafts stay approval-first",
            };
        }

        if (stat.label === "Review workload") {
            return {
                ...stat,
                value: metrics ? formatTokens(metrics.totalTokens) : '---',
                detail: "Measured assistance work behind reviews",
            };
        }

        return {
            ...stat,
            value: metrics ? metrics.rateLimitHits.toString() : '---',
            detail: "Rate limits and abuse signals",
        };
    });

    const hourlyTokens = metrics?.hourlyTokens || Array(24).fill(0);
    const maxToken = Math.max(...hourlyTokens, 1);
    const chartData = hourlyTokens.map(t => (t / maxToken) * 100);
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    const [activeTab, setActiveTab] = useState('overview');
    const [clients, setClients] = useState<PortalClient[]>([]);
    const [newClientName, setNewClientName] = useState('');
    const [newClientEmail, setNewClientEmail] = useState('');
    const [newClientTempPassword, setNewClientTempPassword] = useState('');
    const [isCreatingClient, setIsCreatingClient] = useState(false);

    // Document Upload State
    const [selectedClientForUpload, setSelectedClientForUpload] = useState<string>('');
    const [docTitle, setDocTitle] = useState('');
    const [docDesc, setDocDesc] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Fetch clients on mount
    useEffect(() => {
        fetchClients().then(setClients).catch(console.error);
    }, []);

    const handleCreateClient = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreatingClient(true);
        try {
            await createPortalClient(newClientEmail, newClientName, newClientTempPassword || undefined);
            const updated = await fetchClients();
            setClients(updated);
            setNewClientName('');
            setNewClientEmail('');
            setNewClientTempPassword('');
        } catch (e) {
            console.error(e);
            alert("Failed to create client. Check console.");
        }
        setIsCreatingClient(false);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !selectedClientForUpload) return;
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', docTitle);
            formData.append('description', docDesc);
            formData.append('clientId', selectedClientForUpload);
            await uploadClientDocument(formData);
            alert("Uploaded successfully!");
            setFile(null);
            setDocTitle('');
            setDocDesc('');
        } catch (e) {
            console.error(e);
            alert("Upload failed.");
        }
        setIsUploading(false);
    };

    return (
        <div className="min-h-screen bg-charcoal text-white p-6 md:p-8 pt-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 glass rounded-lg text-white/40 hover:text-gold transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gold/70">AI Nexus operations</p>
                            <h1 className="mt-1 text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                                Command Desk <span className="text-white/20 text-lg">pilot</span>
                            </h1>
                            <p className="mt-1 text-white/45 text-xs">
                                {metrics ? 'Live Supabase signals for outreach, client portal, and delivery.' : 'Connecting to database...'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-gold hover:border-gold/20"
                            onClick={fetchMetrics}
                            disabled={loading}
                        >
                            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Badge variant="outline" className="border-emerald/20 text-emerald bg-emerald/5 text-[10px]">Supabase live</Badge>
                        <Badge variant="outline" className="border-gold/20 text-gold bg-gold/5 text-[10px]">Human approved</Badge>
                        <Badge variant="outline" className="border-pink/20 text-pink bg-pink/5 text-[10px]">POPIA aware</Badge>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="glass !bg-white/5 border-white/5 mb-8 h-auto p-1">
                        <TabsTrigger value="overview" className="data-[state=active]:!bg-gold data-[state=active]:!text-charcoal !text-white/60 hover:!text-white">
                            Operating Desk
                        </TabsTrigger>
                        <TabsTrigger value="clients" className="data-[state=active]:!bg-gold data-[state=active]:!text-charcoal !text-white/60 hover:!text-white">
                            Client Portal
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-8 outline-none">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Card className="glass border-white/5">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center justify-between">
                                                <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                                                    <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <div className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>{stat.value}</div>
                                                <div className="text-[10px] text-white/30 uppercase tracking-widest font-medium mt-1">{stat.label}</div>
                                                <p className="mt-3 text-[11px] leading-5 text-white/45">{stat.detail}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Usage Chart */}
                            <Card className="lg:col-span-2 glass border-white/5">
                                <CardHeader>
                                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" />
                                        Review workload
                                    </CardTitle>
                                    <CardDescription className="text-white/35 text-[11px]">
                                        Activity from lead scoring, draft preparation, and admin review.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[280px] flex items-end gap-0.5 pt-4">
                                        {chartData.map((h, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${Math.max(h, 2)}%` }}
                                                transition={{ duration: 0.5, delay: i * 0.02 }}
                                                className="flex-1 bg-gradient-to-t from-gold/10 to-gold/60 rounded-t-sm relative group cursor-pointer"
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 glass px-2 py-1 rounded text-[9px] text-gold font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                    {hourlyTokens[i].toLocaleString()} review units
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-3">
                                        {hours.filter((_, i) => i % 6 === 0).map((label) => (
                                            <span key={label} className="text-[9px] text-white/15 uppercase font-bold">{label}</span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Human Review Posture */}
                            <Card className="glass border-gold/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4">
                                    <HeartHandshake className="w-16 h-16 text-gold/[0.03]" />
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-gold flex items-center gap-2">
                                        Human-in-loop posture
                                    </CardTitle>
                                    <CardDescription className="text-white/30 text-[11px]">
                                        AI scores, drafts, and summarizes. A person still decides what goes out.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="text-center py-6">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', delay: 0.3 }}
                                            className="text-6xl font-black text-gradient-gold inline-block"
                                            style={{ fontFamily: 'var(--font-heading)' }}
                                        >
                                            Review
                                        </motion.div>
                                        <div className="text-[10px] text-white/30 font-bold uppercase mt-2 tracking-widest">Current mode</div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-[10px] uppercase font-bold text-white/40">
                                                <span>Auto-send status</span>
                                                <span>Off</span>
                                            </div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: '100%' }}
                                                    transition={{ duration: 1, delay: 0.5 }}
                                                    className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full"
                                                />
                                            </div>
                                        </div>
                                        <div className="p-3 glass-gold rounded-xl">
                                            <p className="text-[10px] text-gold/80 font-medium leading-relaxed italic">
                                                &quot;AI prepares the work; Ntuh approves the client-facing move.&quot;
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Delivery Board */}
                            <Card className="glass border-white/5 relative overflow-hidden">
                                <CardHeader>
                                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                                        <ClipboardList className="w-4 h-4" />
                                        Delivery board
                                    </CardTitle>
                                    <CardDescription className="text-white/30 text-[11px]">
                                        Keep the business focused on outreach, reviewed work, and client handover.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {[
                                        {
                                            title: 'Outreach desk',
                                            value: `${recentLeads.length} recent signals`,
                                            copy: 'Track replies, bounces, and follow-ups before sending the next batch.',
                                        },
                                        {
                                            title: 'Client workspace',
                                            value: `${clients.length} active portal${clients.length === 1 ? '' : 's'}`,
                                            copy: 'Deliver roadmaps, workflow notes, and reviewed files in one secure place.',
                                        },
                                        {
                                            title: 'Approval queue',
                                            value: `${newReviewItems} new item${newReviewItems === 1 ? '' : 's'}`,
                                            copy: 'No client-facing action leaves the desk without a human owner.',
                                        },
                                    ].map((item) => (
                                        <div key={item.title} className="p-3 glass rounded-xl border border-white/5">
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald" />
                                                    {item.title}
                                                </div>
                                                <Badge variant="outline" className="text-[9px] border-gold/15 text-gold bg-gold/5 uppercase">
                                                    {item.value}
                                                </Badge>
                                            </div>
                                            <p className="mt-2 text-[11px] leading-5 text-white/40">{item.copy}</p>
                                        </div>
                                    ))}
                                    <div className="p-3 glass-gold rounded-xl">
                                        <p className="text-[10px] text-gold/80 font-medium leading-relaxed">
                                            Best next move: review replies, log outcomes, then send only the follow-ups that still feel high-fit.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Leads */}
                        {metrics && metrics.recentLeads.length > 0 && (
                            <Card className="glass border-white/5">
                                <CardHeader>
                                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Website lead intelligence
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {metrics.recentLeads.map((lead, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex items-center justify-between p-3 glass rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
                                                onClick={() => setSelectedLead(lead)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-pink/10 rounded-lg flex items-center justify-center group-hover:bg-pink/20 transition-colors">
                                                        <Users className="w-4 h-4 text-pink" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold flex items-center gap-2">
                                                            {lead.name}
                                                            {getScoreBadge(lead.score)}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[10px] text-white/30">
                                                            <Mail className="w-3 h-3" />
                                                            {lead.email}
                                                            {lead.company && (
                                                                <>
                                                                    <Building2 className="w-3 h-3 ml-1" />
                                                                    {lead.company}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-[10px] ${lead.status === 'new' ? 'border-gold/20 text-gold' :
                                                            lead.status === 'contacted' ? 'border-blue-400/20 text-blue-400' :
                                                                lead.status === 'qualified' ? 'border-emerald/20 text-emerald' :
                                                                    'border-white/10 text-white/40'
                                                            }`}
                                                    >
                                                        {lead.status}
                                                    </Badge>
                                                    <span className="text-[10px] text-white/20">
                                                        {new Date(lead.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="clients" className="space-y-8 outline-none">
                        <div className="grid lg:grid-cols-2 gap-8">
                            <Card className="glass border-white/5">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                                        <Building2 className="w-5 h-5 text-gold" />
                                        Create client workspace
                                    </CardTitle>
                                    <CardDescription className="text-white/40">
                                        Provision a secure Supabase Auth login for a discovery call, pilot, or active AI workflow project.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleCreateClient} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase text-white/50 tracking-wider">Company Name</label>
                                            <Input
                                                value={newClientName}
                                                onChange={e => setNewClientName(e.target.value)}
                                                required
                                                className="bg-charcoal/50 border-white/10 text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase text-white/50 tracking-wider">Business Email</label>
                                            <Input
                                                type="email"
                                                value={newClientEmail}
                                                onChange={e => setNewClientEmail(e.target.value)}
                                                required
                                                className="bg-charcoal/50 border-white/10 text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase text-white/50 tracking-wider">Temporary Password</label>
                                            <Input
                                                type="password"
                                                value={newClientTempPassword}
                                                onChange={e => setNewClientTempPassword(e.target.value)}
                                                minLength={8}
                                                placeholder="Leave blank to use env default"
                                                autoComplete="new-password"
                                                className="bg-charcoal/50 border-white/10 text-white placeholder:text-white/30"
                                            />
                                        </div>
                                        <Button type="submit" disabled={isCreatingClient} className="w-full bg-gold text-charcoal hover:bg-gold/80">
                                            {isCreatingClient ? "Provisioning..." : "Create Portal Account"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            <Card className="glass border-white/5">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                                        <Save className="w-5 h-5 text-gold" />
                                        Deliver reviewed artifacts
                                    </CardTitle>
                                    <CardDescription className="text-white/40">
                                        Upload proposals, workflow maps, ROI notes, and handover files into the client&apos;s private workspace.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleUpload} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase text-white/50 tracking-wider">Select Client</label>
                                            <select
                                                required
                                                value={selectedClientForUpload}
                                                onChange={(e) => setSelectedClientForUpload(e.target.value)}
                                                className="w-full bg-charcoal/80 border border-white/10 rounded-lg p-2 text-sm text-white"
                                            >
                                                <option value="" disabled>-- Choose Client --</option>
                                                {clients?.map(c => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.company_name} {c.email ? `(${c.email})` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase text-white/50 tracking-wider">Document Title</label>
                                            <Input
                                                value={docTitle}
                                                onChange={e => setDocTitle(e.target.value)}
                                                required
                                                placeholder="e.g. AI Strategy Roadmap Q3"
                                                className="bg-charcoal/50 border-white/10 text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase text-white/50 tracking-wider">PDF File</label>
                                            <Input
                                                type="file"
                                                accept=".pdf,.docx,.doc"
                                                onChange={e => setFile(e.target.files?.[0] || null)}
                                                required
                                                className="bg-charcoal/50 border-white/10 text-white/70 file:bg-white/10 file:text-gold file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-4 file:text-xs"
                                            />
                                        </div>
                                        <Button type="submit" disabled={isUploading || clients.length === 0} className="w-full bg-white/10 text-white hover:bg-white/20 border-white/10 border">
                                            {isUploading ? "Uploading..." : "Upload to Client Portal"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Lead Details Modal */}
            {selectedLead && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm" onClick={() => setSelectedLead(null)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-2xl bg-charcoal border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-6 border-b border-white/5 flex items-start justify-between bg-white/5">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-xl font-bold font-heading text-white">{selectedLead.name}</h2>
                                    {getScoreBadge(selectedLead.score)}
                                </div>
                                <div className="flex items-center gap-4 text-xs text-white/50">
                                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {selectedLead.email}</span>
                                    {selectedLead.company && <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {selectedLead.company}</span>}
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedLead(null)} className="text-white/40 hover:text-white">✕</Button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

                            {/* AI Analysis */}
                            <div className="glass-gold p-4 rounded-lg border border-gold/10">
                                <h4 className="text-xs font-bold text-gold uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Zap className="w-3.5 h-3.5" /> AI Analysis
                                </h4>
                                <p className="text-sm text-white/80 leading-relaxed">
                                    {selectedLead.analysis || "Analysis pending..."}
                                </p>
                            </div>

                            {/* Draft Reply */}
                            {selectedLead.draft_reply && (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">Draft Reply</h4>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 text-[10px] border-white/10 hover:bg-gold/10 hover:text-gold hover:border-gold/20"
                                            onClick={() => navigator.clipboard.writeText(selectedLead.draft_reply || "")}
                                        >
                                            Copy to Clipboard
                                        </Button>
                                    </div>
                                    <div className="bg-charcoal/50 border border-white/10 rounded-lg p-4 text-sm text-white/70 font-mono whitespace-pre-wrap">
                                        {selectedLead.draft_reply}
                                    </div>
                                </div>
                            )}

                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

// ─── Main Component ─── //
export default function AdminPage() {
    const [unlocked, setUnlocked] = useState(false);

    if (!unlocked) {
        return <PasswordGate onUnlock={() => setUnlocked(true)} />;
    }

    return <Dashboard />;
}
