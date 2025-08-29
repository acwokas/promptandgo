import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSharing } from "@/hooks/useSharing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface PollOption {
  id: string;
  text: string;
  icon: string;
  vote_count: number;
  percentage: number;
}

interface Poll {
  id: string;
  title: string;
  intro_copy: string;
  options: PollOption[];
}

interface PollCarouselProps {
  currentPage?: string;
}

export const PollCarousel = ({ currentPage = "home" }: PollCarouselProps) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [currentPollIndex, setCurrentPollIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { shareToClipboard, isSharing } = useSharing();

  const currentPoll = polls[currentPollIndex];

  useEffect(() => {
    loadPolls();
  }, [currentPage]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && showResults && polls.length > 1) {
      // Move to next poll
      setCurrentPollIndex((prev) => (prev + 1) % polls.length);
      setShowResults(false);
      setUserVote(null);
    }
    return () => clearTimeout(timer);
  }, [countdown, showResults, polls.length]);

  const loadPolls = async () => {
    try {
      const { data: pollsData, error } = await supabase
        .from('polls')
        .select(`
          id,
          title,
          intro_copy,
          display_pages,
          poll_options (
            id,
            text,
            icon,
            order_index
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter polls based on current page
      const filteredPolls = pollsData?.filter(poll => 
        poll.display_pages.includes('all') || 
        poll.display_pages.includes(currentPage)
      ) || [];

      const pollsWithResults = await Promise.all(
        filteredPolls.map(async (poll) => {
          const { data: results } = await supabase
            .rpc('get_poll_results', { poll_id_param: poll.id });

          return {
            id: poll.id,
            title: poll.title,
            intro_copy: poll.intro_copy,
            options: (results || []).map((result: any) => ({
              id: result.option_id,
              text: result.option_text,
              icon: result.option_icon,
              vote_count: result.vote_count,
              percentage: result.percentage
            }))
          };
        })
      );

      setPolls(pollsWithResults);
      setLoading(false);
    } catch (error) {
      console.error('Error loading polls:', error);
      toast({
        title: "Error",
        description: "Failed to load polls",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleVote = async (optionId: string) => {
    if (!currentPoll || userVote) return;

    try {
      const { error } = await supabase
        .from('poll_votes')
        .insert({
          poll_id: currentPoll.id,
          option_id: optionId
        });

      if (error) throw error;

      setUserVote(optionId);
      setShowResults(true);
      setCountdown(10);
      
      // Refresh results
      loadPolls();
      
      toast({
        title: "Vote recorded!",
        description: "Thank you for your vote"
      });
    } catch (error: any) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: error.message.includes('duplicate') 
          ? "You've already voted on this poll" 
          : "Failed to record vote",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    if (!currentPoll) return;

    await shareToClipboard({
      url: window.location.href,
      contentType: 'poll',
      contentId: currentPoll.id,
      title: `Vote on: ${currentPoll.title}`
    });
  };

  const navigatePoll = (direction: 'prev' | 'next') => {
    if (polls.length <= 1) return;
    
    setCurrentPollIndex(prev => 
      direction === 'prev' 
        ? (prev - 1 + polls.length) % polls.length
        : (prev + 1) % polls.length
    );
    setShowResults(false);
    setUserVote(null);
    setCountdown(0);
  };

  if (loading || !currentPoll) {
    return null;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-foreground">
            {currentPoll.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {polls.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigatePoll('prev')}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Badge variant="secondary" className="text-xs">
                  {currentPollIndex + 1} / {polls.length}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigatePoll('next')}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              disabled={isSharing}
              className="h-8 w-8 p-0"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {currentPoll.intro_copy}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {showResults && countdown > 0 && polls.length > 1 && currentPollIndex < polls.length - 1 && (
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-2">Loading next question in...</p>
            <div className="text-2xl font-bold text-primary">{countdown}</div>
          </div>
        )}

        <div className="space-y-3">
          {currentPoll.options.map((option) => {
            const isSelected = userVote === option.id;

            return (
              <div key={option.id} className="space-y-2">
                <div className="relative">
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className={`w-full justify-between text-left h-auto p-4 relative overflow-hidden ${
                      showResults ? 'bg-muted/20 border-muted' : ''
                    }`}
                    onClick={() => handleVote(option.id)}
                    disabled={showResults || userVote !== null}
                  >
                    {/* Progress bar background when showing results */}
                    {showResults && (
                      <div 
                        className="absolute left-0 top-0 h-full bg-primary/20 transition-all duration-1000 ease-out"
                        style={{ width: `${option.percentage}%` }}
                      />
                    )}
                    
                    {/* Content */}
                    <div className="flex items-center gap-3 relative z-10">
                      <span className="text-lg">{option.icon}</span>
                      <span className="flex-1">{option.text}</span>
                    </div>
                    
                    {/* Results display on the right */}
                    {showResults && (
                      <div className="text-right text-sm relative z-10">
                        <div className="font-medium">{option.percentage}%</div>
                        <div className="text-muted-foreground">{option.vote_count} votes</div>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {!showResults && (
          <p className="text-xs text-muted-foreground text-center">
            Click an option to vote and see results
          </p>
        )}
      </CardContent>
    </Card>
  );
};