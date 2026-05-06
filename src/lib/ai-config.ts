import { createServerClient } from '@/lib/supabase';
import { google } from '@ai-sdk/google';

export async function getActiveAIModel(featureName: string, defaultModelId: string) {
    const supabase = createServerClient();
    if (!supabase) {
        return google(defaultModelId);
    }

    try {
        const { data, error } = await supabase
            .from('ai_settings')
            .select('provider, model_id')
            .eq('feature_name', featureName)
            .single();

        if (error || !data) {
            console.warn(`[AI Config] Failed to load settings for ${featureName}, using default.`);
            return google(defaultModelId);
        }

        // Initialize the correct provider
        if (data.provider === 'google') {
            return google(data.model_id);
        }

        // Add more providers here (openai, anthropic) when needed
        console.warn(`[AI Config] Provider ${data.provider} not implemented yet. Falling back to Google.`);
        return google(defaultModelId);

    } catch (err) {
        console.error(`[AI Config ERROR]`, err);
        return google(defaultModelId);
    }
}
