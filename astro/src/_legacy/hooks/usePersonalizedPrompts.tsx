import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

interface UserContext {
  industry: string | null;
  project_type: string | null;
  preferred_tone: string | null;
  desired_outcome: string | null;
}

interface PersonalizedPrompt {
  id: string;
  categoryId: string;
  subcategoryId?: string | null;
  title: string;
  whatFor?: string | null;
  prompt: string;
  imagePrompt?: string | null;
  excerpt?: string | null;
  tags: string[];
  isPro?: boolean;
  relevanceScore: number;
  matchReason: string[];
}

export function usePersonalizedPrompts() {
  const { user } = useSupabaseAuth();
  const [personalizedPrompts, setPersonalizedPrompts] = useState<PersonalizedPrompt[]>([]);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState(false);

  // Industry to category/tag mapping
  const getIndustryKeywords = (industry: string): string[] => {
    const industryMap: Record<string, string[]> = {
      "Technology": ["tech", "software", "development", "coding", "digital", "startup", "saas"],
      "Healthcare": ["health", "medical", "patient", "healthcare", "clinical", "wellness"],
      "Finance": ["finance", "financial", "money", "investment", "banking", "budget", "accounting"],
      "Education": ["education", "teaching", "student", "learning", "academic", "course", "curriculum"],
      "Retail": ["retail", "ecommerce", "shopping", "product", "customer", "sales", "marketing"],
      "Manufacturing": ["manufacturing", "production", "supply chain", "operations", "quality"],
      "Marketing & Advertising": ["marketing", "advertising", "brand", "social media", "campaign", "content"],
      "Real Estate": ["real estate", "property", "housing", "investment", "rental"],
      "Legal Services": ["legal", "law", "contract", "compliance", "attorney"],
      "Consulting": ["consulting", "strategy", "business", "analysis", "advisory"],
      "Media & Entertainment": ["media", "entertainment", "content", "creative", "video", "audio"],
      "Non-profit": ["nonprofit", "charity", "community", "volunteer", "social impact"]
    };
    return industryMap[industry] || [];
  };

  // Project type to tag mapping
  const getProjectTypeKeywords = (projectType: string): string[] => {
    const projectMap: Record<string, string[]> = {
      "Content Creation": ["content", "writing", "blog", "article", "copy", "creative"],
      "Marketing Campaigns": ["marketing", "campaign", "advertising", "promotion", "brand"],
      "Business Strategy": ["strategy", "business", "planning", "analysis", "growth"],
      "Customer Support": ["customer", "support", "service", "help", "FAQ"],
      "Product Development": ["product", "development", "feature", "design", "user"],
      "Research & Analysis": ["research", "analysis", "data", "report", "study"],
      "Educational Content": ["education", "teaching", "learning", "tutorial", "training"],
      "Creative Writing": ["creative", "writing", "story", "fiction", "poetry", "narrative"],
      "Technical Documentation": ["documentation", "technical", "guide", "manual", "instructions"],
      "Sales & Outreach": ["sales", "outreach", "lead", "prospect", "pitch", "follow-up"]
    };
    return projectMap[projectType] || [];
  };

  // Tone keywords mapping
  const getToneKeywords = (tone: string): string[] => {
    const toneMap: Record<string, string[]> = {
      "Professional": ["professional", "business", "formal", "corporate"],
      "Casual": ["casual", "friendly", "conversational", "informal"],
      "Friendly": ["friendly", "warm", "approachable", "welcoming"],
      "Authoritative": ["authoritative", "expert", "confident", "leadership"],
      "Conversational": ["conversational", "natural", "dialogue", "chat"],
      "Formal": ["formal", "official", "structured", "proper"],
      "Creative": ["creative", "innovative", "imaginative", "artistic"],
      "Direct": ["direct", "clear", "straightforward", "concise"],
      "Empathetic": ["empathetic", "understanding", "supportive", "caring"],
      "Persuasive": ["persuasive", "compelling", "convincing", "influential"]
    };
    return toneMap[tone] || [];
  };

  // Calculate relevance score for a prompt based on user context
  const calculateRelevanceScore = (prompt: any, tags: string[], context: UserContext): { score: number; reasons: string[] } => {
    let score = 0;
    const reasons: string[] = [];

    // Get all relevant keywords for the user
    const industryKeywords = context.industry ? getIndustryKeywords(context.industry) : [];
    const projectKeywords = context.project_type ? getProjectTypeKeywords(context.project_type) : [];
    const toneKeywords = context.preferred_tone ? getToneKeywords(context.preferred_tone) : [];
    const outcomeKeywords = context.desired_outcome ? context.desired_outcome.toLowerCase().split(/[,\s]+/).filter(w => w.length > 2) : [];

    // Combine all searchable text
    const allTags = tags.map(t => t.toLowerCase());
    const contentText = [prompt.title, prompt.what_for, prompt.excerpt, prompt.prompt].join(" ").toLowerCase();
    const searchableContent = [...allTags, contentText].join(" ");
    
    // Industry match (25 points max)
    let industryMatches = 0;
    industryKeywords.forEach(keyword => {
      if (searchableContent.includes(keyword.toLowerCase())) {
        industryMatches++;
        score += 5;
      }
    });
    if (industryMatches > 0) {
      reasons.push(`${context.industry} industry focus`);
    }

    // Project type match (25 points max) 
    let projectMatches = 0;
    projectKeywords.forEach(keyword => {
      if (searchableContent.includes(keyword.toLowerCase())) {
        projectMatches++;
        score += 5;
      }
    });
    if (projectMatches > 0) {
      reasons.push(`Perfect for ${context.project_type}`);
    }

    // Tone match (15 points max)
    let toneMatches = 0;
    toneKeywords.forEach(keyword => {
      if (searchableContent.includes(keyword.toLowerCase())) {
        toneMatches++;
        score += 3;
      }
    });
    if (toneMatches > 0) {
      reasons.push(`${context.preferred_tone} tone`);
    }

    // Desired outcome match (15 points max)
    let outcomeMatches = 0;
    outcomeKeywords.forEach(keyword => {
      if (searchableContent.includes(keyword)) {
        outcomeMatches++;
        score += 3;
      }
    });
    if (outcomeMatches > 0) {
      reasons.push("Aligns with your goals");
    }

    // Category relevance bonus (10 points max)
    const relevantCategories = ["Content Creation", "Marketing Campaigns", "Business Strategy", "Customer Support"];
    if (context.project_type && relevantCategories.some(cat => 
      contentText.includes(cat.toLowerCase()) || 
      allTags.some(tag => tag.includes(cat.toLowerCase()))
    )) {
      score += 5;
    }

    // Popular/quality indicators (10 points max)
    if (prompt.excerpt && prompt.excerpt.length > 50) score += 2; // Well-documented
    if (allTags.length >= 3) score += 3; // Well-tagged
    if (prompt.what_for && prompt.what_for.length > 20) score += 2; // Good description

    // Convert raw score to percentage with better scaling
    // Scores typically range from 10-40, so let's scale them better
    let percentage;
    if (score >= 30) percentage = 90 + Math.min(10, score - 30); // 90-100% for high scores
    else if (score >= 20) percentage = 70 + (score - 20) * 2; // 70-90% for good scores  
    else if (score >= 10) percentage = 50 + (score - 10) * 2; // 50-70% for decent scores
    else if (score >= 5) percentage = 30 + score * 4; // 30-50% for low scores
    else percentage = score * 6; // 0-30% for very low scores
    
    return { score: Math.min(100, Math.round(percentage)), reasons: reasons.slice(0, 3) };
  };

  const loadPersonalizedPrompts = async (context: UserContext) => {
    if (!user) return;
    
    if (!context.industry && !context.project_type && !context.preferred_tone && !context.desired_outcome) {
      setPersonalizedPrompts([]);
      return;
    }

    setLoading(true);
    try {
      // Get a broader set of prompts to analyze
      const { data: prompts, error } = await supabase
        .from("prompts")
        .select("id, category_id, subcategory_id, title, what_for, prompt, image_prompt, excerpt, is_pro, ribbon")
        .order("created_at", { ascending: false })
        .limit(100); // Analyze top 100 recent prompts

      if (error) throw error;

      // Get user preferences
      const { data: userPreferences, error: preferencesError } = await supabase
        .from('user_prompt_preferences')
        .select('prompt_id, preference_type')
        .eq('user_id', user.id);

      if (preferencesError) throw preferencesError;

      console.log('🔍 Debug - User preferences loaded:', userPreferences);
      console.log('🔍 Debug - Number of prompts to analyze:', prompts?.length);

      if (!prompts || prompts.length === 0) {
        setPersonalizedPrompts([]);
        return;
      }

      // Get tags for all prompts
      const promptIds = prompts.map(p => p.id);
      const { data: tagData, error: tagError } = await supabase
        .from("prompt_tags")
        .select("prompt_id, tags:tag_id(name)")
        .in("prompt_id", promptIds);

      if (tagError) throw tagError;

      // Build tag map
      const tagMap = new Map<string, string[]>();
      (tagData || []).forEach((r: any) => {
        const promptId = r.prompt_id;
        const tagName = r.tags?.name;
        if (promptId && tagName) {
          const existing = tagMap.get(promptId) || [];
          existing.push(tagName);
          tagMap.set(promptId, existing);
        }
      });

      // Create a map of user preferences for quick lookup
      const preferencesMap = new Map(
        userPreferences?.map(p => [p.prompt_id, p.preference_type]) || []
      );

      console.log('🔍 Debug - Preferences map size:', preferencesMap.size);
      console.log('🔍 Debug - User context:', context);

      // Score and filter prompts
      const scoredPrompts = prompts
        .map(prompt => {
          const tags = tagMap.get(prompt.id) || [];
          const { score, reasons } = calculateRelevanceScore(prompt, tags, context);
          
          // Boost score based on user preferences
          let finalScore = score;
          const userPreference = preferencesMap.get(prompt.id);
          if (userPreference === 'liked') {
            finalScore += 20; // Significant boost for user-liked prompts
          } else if (userPreference === 'disliked') {
            finalScore = Math.max(0, finalScore - 10); // Reduce score for disliked prompts
          }
          
          return {
            id: prompt.id,
            categoryId: prompt.category_id,
            subcategoryId: prompt.subcategory_id,
            title: prompt.title,
            whatFor: prompt.what_for,
            prompt: prompt.prompt,
            imagePrompt: prompt.image_prompt,
            excerpt: prompt.excerpt,
            tags,
            isPro: prompt.is_pro,
            relevanceScore: finalScore,
            matchReason: userPreference === 'liked'
              ? ["✨ You liked this prompt", ...reasons]
              : reasons
          };
        })
        .filter(p => p.relevanceScore > 0) // Only show prompts with some relevance
        .sort((a, b) => b.relevanceScore - a.relevanceScore) // Sort by relevance
        .slice(0, 6); // Top 6 most relevant

      console.log('🔍 Debug - Scored prompts:', scoredPrompts.map(p => ({
        title: p.title,
        score: p.relevanceScore,
        reasons: p.matchReason,
        hasUserPreference: preferencesMap.has(p.id)
      })));

      setPersonalizedPrompts(scoredPrompts);
    } catch (error) {
      console.error("Error loading personalized prompts:", error);
      setPersonalizedPrompts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setUserContext(null);
      setPersonalizedPrompts([]);
      return;
    }

    const loadUserContext = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("industry, project_type, preferred_tone, desired_outcome, context_fields_completed")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data && data.context_fields_completed) {
          const context: UserContext = {
            industry: data.industry,
            project_type: data.project_type,
            preferred_tone: data.preferred_tone,
            desired_outcome: data.desired_outcome
          };
          setUserContext(context);
          await loadPersonalizedPrompts(context);
        } else {
          setUserContext(null);
          setPersonalizedPrompts([]);
        }
      } catch (error) {
        console.error("Error loading user context:", error);
        setUserContext(null);
        setPersonalizedPrompts([]);
      }
    };

    loadUserContext();
  }, [user]);

  const hasPersonalization = userContext && (
    userContext.industry || 
    userContext.project_type || 
    userContext.preferred_tone || 
    userContext.desired_outcome
  );

  return {
    personalizedPrompts,
    userContext,
    hasPersonalization,
    loading,
    refresh: () => userContext && loadPersonalizedPrompts(userContext)
  };
}