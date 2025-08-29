import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Sparkles, ShoppingBag, Zap } from "lucide-react";

interface Pack {
  id: string;
  name: string;
  description: string;
  slug: string;
  price_cents: number;
  tags: string[];
}

interface UserProfile {
  industry?: string;
  project_type?: string;
  preferred_tone?: string;
  desired_outcome?: string;
}

export function MatchedPowerPacks() {
  const { user } = useSupabaseAuth();
  const [matchedPacks, setMatchedPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadMatchedPacks = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get user profile first
        const { data: profileData } = await supabase
          .from('profiles')
          .select('industry, project_type, preferred_tone, desired_outcome')
          .eq('id', user.id)
          .maybeSingle();

        setUserProfile(profileData);

        // Get all packs with their tags
        const { data: packsData, error } = await supabase
          .from('packs')
          .select(`
            id,
            name,
            description,
            slug,
            price_cents
          `)
          .eq('is_active', true)
          .limit(6);

        if (error) throw error;

        // Get tags for each pack separately to handle the relationship properly
        const packsWithTags = await Promise.all(
          (packsData || []).map(async (pack) => {
            const { data: tagData } = await supabase
              .from('pack_tags')
              .select(`tags (name)`)
              .eq('pack_id', pack.id);
            
            return {
              ...pack,
              tags: tagData?.map((pt: any) => pt.tags?.name).filter(Boolean) || []
            };
          })
        );

        // Score packs based on user profile
        const scoredPacks = packsWithTags.map(pack => {
          let score = 0;
          
          if (profileData) {
            // Match industry
            if (profileData.industry) {
              const industryKeywords = profileData.industry.toLowerCase().split(' ');
              const packText = `${pack.name} ${pack.description}`.toLowerCase();
              industryKeywords.forEach(keyword => {
                if (packText.includes(keyword)) score += 3;
              });
            }

            // Match project type
            if (profileData.project_type) {
              const projectKeywords = profileData.project_type.toLowerCase().split(' ');
              const packText = `${pack.name} ${pack.description}`.toLowerCase();
              projectKeywords.forEach(keyword => {
                if (packText.includes(keyword)) score += 2;
              });
            }

            // Match desired outcome
            if (profileData.desired_outcome) {
              const outcomeKeywords = profileData.desired_outcome.toLowerCase().split(' ');
              const packText = `${pack.name} ${pack.description}`.toLowerCase();
              outcomeKeywords.forEach(keyword => {
                if (packText.includes(keyword)) score += 2;
              });
            }
          }

          // Add some randomness to avoid always showing the same packs
          score += Math.random() * 2;

          return { ...pack, score };
        });

        // Sort by score and take top 3
        const topPacks = scoredPacks
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);

        setMatchedPacks(topPacks);
      } catch (error) {
        console.error('Error loading matched packs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMatchedPacks();
  }, [user]);

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (matchedPacks.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">⚡ Power Packs for You</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            Discover our curated Power Packs designed for professionals like you.
          </p>
          <Button asChild variant="hero" size="sm">
            <Link to="/packs">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Browse All Packs
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">⚡ Recommended Power Packs</h3>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4">
          Based on your profile{userProfile?.industry && ` in ${userProfile.industry}`}, here are packs perfect for you:
        </p>

        <div className="space-y-3 mb-4">
          {matchedPacks.map((pack) => (
            <div key={pack.id} className="bg-background/50 rounded-lg p-3 border">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{pack.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {pack.description}
                  </p>
                  {pack.tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {pack.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-medium">
                    ${(pack.price_cents / 100).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button asChild variant="hero" size="sm" className="flex-1">
            <Link to="/packs">
              <Zap className="h-4 w-4 mr-2" />
              View All Packs
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/account/profile">Update Profile</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}