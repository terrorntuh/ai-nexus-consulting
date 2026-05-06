// Verification script for AI Lead Scoring
// Usage: node scripts/verify-crm.mjs

import fetch from 'node-fetch'; // or use native fetch if node 18+

const BASE_URL = 'http://localhost:3000';

async function testLeadFlow() {
    console.log('🚀 Starting CRM Verification...');

    // 1. Submit a high-value dummy lead
    const dummyLead = {
        name: 'Veronica Test',
        email: 'veronica@enterprise-corp.com',
        company: 'Enterprise Corp',
        message: 'We are looking to implement AI across our 5000 employee workforce. Budget is flexible.',
    };

    console.log('📝 Submitting lead:', dummyLead.email);

    try {
        const res = await fetch(`${BASE_URL}/api/leads`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dummyLead),
        });

        if (!res.ok) {
            throw new Error(`Failed to submit lead: ${res.status} ${res.statusText}`);
        }

        const { id } = await res.json();
        console.log('✅ Lead submitted successfully. ID:', id);

        // 2. Trigger Analysis (mimic client-side)
        console.log('🧠 Triggering AI analysis...');
        const analyzeRes = await fetch(`${BASE_URL}/api/leads/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });

        if (!analyzeRes.ok) {
            throw new Error(`Analysis failed: ${analyzeRes.status}`);
        }

        const analysisData = await analyzeRes.json();
        console.log('✅ AI Analysis complete!');
        console.log('--------------------------------------------------');
        console.log('Score:', analysisData.score);
        console.log('Analysis:', analysisData.analysis);
        console.log('Draft Reply:', analysisData.draft_reply?.substring(0, 100) + '...');
        console.log('--------------------------------------------------');

        if (analysisData.score > 80) {
            console.log('🎉 SUCCESS: High value lead correctly identified!');
        } else {
            console.log('⚠️ WARNING: Score seems low for a high value lead.');
        }

    } catch (error) {
        console.error('❌ Verification Failed:', error.message);
        process.exit(1);
    }
}

testLeadFlow();
