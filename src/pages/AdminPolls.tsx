import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, BarChart3, Eye, EyeOff, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface Poll {
  id: string;
  title: string;
  intro_copy: string;
  is_active: boolean;
  display_pages: string[];
  manual_total_votes: number | null;
  use_manual_total_votes: boolean | null;
  poll_options: PollOption[];
}

interface PollOption {
  id: string;
  text: string;
  icon: string;
  order_index: number;
}

interface PollResult {
  option_id: string;
  option_text: string;
  option_icon: string;
  vote_count: number;
  percentage: number;
  is_manual: boolean;
}

const AdminPolls = () => {
  const { user } = useSupabaseAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const { toast } = useToast();
  
  const [polls, setPolls] = useState<Poll[]>([]);
  const [results, setResults] = useState<Record<string, PollResult[]>>({});
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);
  const [editingPercentages, setEditingPercentages] = useState<Record<string, boolean>>({});
  const [tempPercentages, setTempPercentages] = useState<Record<string, Record<string, number>>>({});
  const [tempVoteCounts, setTempVoteCounts] = useState<Record<string, Record<string, number>>>({});
  const [tempTotalVotes, setTempTotalVotes] = useState<Record<string, number>>({});
  
  // Form states
  const [title, setTitle] = useState("");
  const [introCopy, setIntroCopy] = useState("");
  const [displayPages, setDisplayPages] = useState<string[]>([]);
  const [options, setOptions] = useState<Array<{text: string; icon: string}>>([
    { text: "", icon: "" }
  ]);

  useEffect(() => {
    if (!adminLoading && user) {
      loadPolls();
    }
  }, [user, adminLoading]);

  if (adminLoading) return <div>Loading...</div>;
  const emailAllow = ["me@adrianwatkins.com"];
  const effectiveIsAdmin = isAdmin || (user?.email ? emailAllow.includes(user.email) : false);
  if (!user || !effectiveIsAdmin) return <Navigate to="/" replace />;

  const loadPolls = async () => {
    try {
      const { data, error } = await supabase
        .from('polls')
        .select(`
          id,
          title,
          intro_copy,
          is_active,
          display_pages,
          manual_total_votes,
          use_manual_total_votes,
          poll_options (
            id,
            text,
            icon,
            order_index
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPolls(data || []);
      
      // Load results for each poll
      const resultsData: Record<string, PollResult[]> = {};
      for (const poll of data || []) {
        const { data: pollResults } = await supabase
          .rpc('get_poll_results_with_manual', { poll_id_param: poll.id });
        resultsData[poll.id] = pollResults || [];
      }
      setResults(resultsData);
      
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

  const resetForm = () => {
    setTitle("");
    setIntroCopy("");
    setDisplayPages([]);
    setOptions([{ text: "", icon: "" }]);
    setEditingPoll(null);
  };

  const handleCreatePoll = async () => {
    if (!title.trim() || !introCopy.trim() || options.some(opt => !opt.text.trim() || !opt.icon.trim())) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .insert({
          title: title.trim(),
          intro_copy: introCopy.trim(),
          display_pages: displayPages
        })
        .select()
        .single();

      if (pollError) throw pollError;

      // Insert options
      const optionsData = options.map((opt, index) => ({
        poll_id: pollData.id,
        text: opt.text.trim(),
        icon: opt.icon.trim(),
        order_index: index + 1
      }));

      const { error: optionsError } = await supabase
        .from('poll_options')
        .insert(optionsData);

      if (optionsError) throw optionsError;

      toast({
        title: "Success",
        description: "Poll created successfully"
      });

      setShowCreateDialog(false);
      resetForm();
      loadPolls();
    } catch (error) {
      console.error('Error creating poll:', error);
      toast({
        title: "Error",
        description: "Failed to create poll",
        variant: "destructive"
      });
    }
  };

  const handleToggleActive = async (pollId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('polls')
        .update({ is_active: !isActive })
        .eq('id', pollId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Poll ${!isActive ? 'activated' : 'deactivated'}`
      });

      loadPolls();
    } catch (error) {
      console.error('Error toggling poll status:', error);
      toast({
        title: "Error",
        description: "Failed to update poll status",
        variant: "destructive"
      });
    }
  };

  const handleDeletePoll = async (pollId: string) => {
    if (!confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('polls')
        .delete()
        .eq('id', pollId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Poll deleted successfully"
      });

      loadPolls();
    } catch (error) {
      console.error('Error deleting poll:', error);
      toast({
        title: "Error",
        description: "Failed to delete poll",
        variant: "destructive"
      });
    }
  };

  const addOption = () => {
    setOptions([...options, { text: "", icon: "" }]);
  };

  const removeOption = (index: number) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, field: 'text' | 'icon', value: string) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const pageOptions = [
    { value: 'all', label: 'All Pages' },
    { value: 'home', label: 'Home' },
    { value: 'library', label: 'Library' },
    { value: 'packs', label: 'Packs' },
    { value: 'scout', label: 'Scout' }
  ];

  const startEditingPercentages = (pollId: string) => {
    const pollResults = results[pollId] || [];
    setEditingPercentages(prev => ({ ...prev, [pollId]: true }));
    
    // Initialize temp percentages and vote counts with current values
    const tempPercs: Record<string, number> = {};
    const tempVotes: Record<string, number> = {};
    pollResults.forEach(result => {
      tempPercs[result.option_id] = result.percentage;
      tempVotes[result.option_id] = result.vote_count;
    });
    setTempPercentages(prev => ({ ...prev, [pollId]: tempPercs }));
    setTempVoteCounts(prev => ({ ...prev, [pollId]: tempVotes }));
    
    // Initialize manual total votes with current override or calculated total
    const poll = polls.find(p => p.id === pollId);
    const sumVotes = pollResults.reduce((sum, r) => sum + r.vote_count, 0);
    const initialTotal = (poll?.use_manual_total_votes && poll?.manual_total_votes != null)
      ? (poll.manual_total_votes as number)
      : sumVotes;
    setTempTotalVotes(prev => ({ ...prev, [pollId]: initialTotal }));
  };

  const cancelEditingPercentages = (pollId: string) => {
    setEditingPercentages(prev => ({ ...prev, [pollId]: false }));
    setTempPercentages(prev => {
      const newTemp = { ...prev };
      delete newTemp[pollId];
      return newTemp;
    });
    setTempVoteCounts(prev => {
      const newTemp = { ...prev };
      delete newTemp[pollId];
      return newTemp;
    });
    setTempTotalVotes(prev => {
      const newTemp = { ...prev };
      delete newTemp[pollId];
      return newTemp;
    });
  };

  const updateTempPercentage = (pollId: string, optionId: string, value: number) => {
    setTempPercentages(prev => ({
      ...prev,
      [pollId]: {
        ...prev[pollId],
        [optionId]: value
      }
    }));
  };

  const updateTempVoteCount = (pollId: string, optionId: string, value: number) => {
    setTempVoteCounts(prev => ({
      ...prev,
      [pollId]: {
        ...prev[pollId],
        [optionId]: value
      }
    }));
  };
  
  const updateTempTotalVotes = (pollId: string, value: number) => {
    setTempTotalVotes(prev => ({ ...prev, [pollId]: value }));
  };

  const saveManualPercentages = async (pollId: string) => {
    const tempPercs = tempPercentages[pollId] || {};
    const tempVotes = tempVoteCounts[pollId] || {};
    const pollResults = results[pollId] || [];

    try {
      // Update each option with manual percentage and vote count
      for (const result of pollResults) {
        const newPercentage = tempPercs[result.option_id];
        const newVoteCount = tempVotes[result.option_id];
        
        const updateData: any = {};
        
        if (newPercentage !== undefined) {
          updateData.manual_percentage = newPercentage;
          updateData.use_manual_percentage = true;
        }
        
        if (newVoteCount !== undefined) {
          updateData.manual_vote_count = newVoteCount;
          updateData.use_manual_vote_count = true;
        }
        
        if (Object.keys(updateData).length > 0) {
          const { error } = await supabase
            .from('poll_options')
            .update(updateData)
            .eq('id', result.option_id);

          if (error) throw error;
        }
      }

      // Update poll-level manual total votes if provided
      const totalOverride = tempTotalVotes[pollId];
      if (totalOverride !== undefined) {
        const { error: pollUpdateError } = await supabase
          .from('polls')
          .update({ manual_total_votes: totalOverride, use_manual_total_votes: true })
          .eq('id', pollId);
        if (pollUpdateError) throw pollUpdateError;
      }

      toast({
        title: "Success",
        description: "Manual settings saved"
      });

      setEditingPercentages(prev => ({ ...prev, [pollId]: false }));
      setTempPercentages(prev => {
        const newTemp = { ...prev };
        delete newTemp[pollId];
        return newTemp;
      });
      setTempVoteCounts(prev => {
        const newTemp = { ...prev };
        delete newTemp[pollId];
        return newTemp;
      });
      setTempTotalVotes(prev => {
        const newTemp = { ...prev };
        delete newTemp[pollId];
        return newTemp;
      });
      
      loadPolls();
    } catch (error) {
      console.error('Error saving manual data:', error);
      toast({
        title: "Error",
        description: "Failed to save manual data",
        variant: "destructive"
      });
    }
  };

  const toggleManualMode = async (pollId: string, useManual: boolean) => {
    const pollResults = results[pollId] || [];

    try {
      for (const result of pollResults) {
        const { error } = await supabase
          .from('poll_options')
          .update({ 
            use_manual_percentage: useManual,
            use_manual_vote_count: useManual
          })
          .eq('id', result.option_id);

        if (error) throw error;
      }

      // Also toggle poll-level manual total usage
      const { error: pollToggleError } = await supabase
        .from('polls')
        .update({ use_manual_total_votes: useManual })
        .eq('id', pollId);
      if (pollToggleError) throw pollToggleError;

      toast({
        title: "Success",
        description: useManual ? "Switched to manual mode" : "Switched to automatic mode"
      });

      loadPolls();
    } catch (error) {
      console.error('Error toggling manual mode:', error);
      toast({
        title: "Error",
        description: "Failed to toggle manual mode",
        variant: "destructive"
      });
    }
  };

  const startEditingPoll = (poll: Poll) => {
    setEditingPoll(poll);
    setTitle(poll.title);
    setIntroCopy(poll.intro_copy);
    setDisplayPages(poll.display_pages);
    setOptions(poll.poll_options.map(opt => ({ text: opt.text, icon: opt.icon })));
    setShowCreateDialog(true);
  };

  const handleUpdatePoll = async () => {
    if (!editingPoll || !title.trim() || !introCopy.trim() || options.some(opt => !opt.text.trim() || !opt.icon.trim())) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Update poll basic info
      const { error: pollError } = await supabase
        .from('polls')
        .update({
          title: title.trim(),
          intro_copy: introCopy.trim(),
          display_pages: displayPages
        })
        .eq('id', editingPoll.id);

      if (pollError) throw pollError;

      // Get current options to preserve vote data
      const currentOptions = editingPoll.poll_options;
      
      // Update existing options or create new ones (preserve votes and manual percentages)
      for (let i = 0; i < options.length; i++) {
        const newOption = options[i];
        const existingOption = currentOptions[i];
        
        if (existingOption) {
          // Update existing option (preserves votes and manual percentages)
          const { error: updateError } = await supabase
            .from('poll_options')
            .update({
              text: newOption.text.trim(),
              icon: newOption.icon.trim(),
              order_index: i + 1
            })
            .eq('id', existingOption.id);
            
          if (updateError) throw updateError;
        } else {
          // Create new option
          const { error: insertError } = await supabase
            .from('poll_options')
            .insert({
              poll_id: editingPoll.id,
              text: newOption.text.trim(),
              icon: newOption.icon.trim(),
              order_index: i + 1
            });
            
          if (insertError) throw insertError;
        }
      }
      
      // Delete any extra options if the new list is shorter
      if (options.length < currentOptions.length) {
        const optionsToDelete = currentOptions.slice(options.length);
        for (const optionToDelete of optionsToDelete) {
          const { error: deleteError } = await supabase
            .from('poll_options')
            .delete()
            .eq('id', optionToDelete.id);
            
          if (deleteError) throw deleteError;
        }
      }

      toast({
        title: "Success",
        description: "Poll updated successfully (vote data preserved)"
      });

      setShowCreateDialog(false);
      resetForm();
      loadPolls();
    } catch (error) {
      console.error('Error updating poll:', error);
      toast({
        title: "Error",
        description: "Failed to update poll",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="container mx-auto px-6 py-6">Loading...</div>;
  }

  return (
    <>
      <SEO 
        title="Poll Management - Admin"
        description="Manage polls and view voting results"
      />
      
      <div className="container mx-auto px-6 py-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin">Admin</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Polls</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Poll Management</h1>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setShowCreateDialog(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Create Poll
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPoll ? 'Edit Poll' : 'Create New Poll'}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Poll title"
                  />
                </div>

                <div>
                  <Label htmlFor="intro_copy">Intro Copy</Label>
                  <Textarea
                    id="intro_copy"
                    value={introCopy}
                    onChange={(e) => setIntroCopy(e.target.value)}
                    placeholder="Poll introduction text"
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Display Pages</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {pageOptions.map((page) => (
                      <Button
                        key={page.value}
                        variant={displayPages.includes(page.value) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (page.value === 'all') {
                            setDisplayPages(['all']);
                          } else if (page.value === 'none') {
                            setDisplayPages([]);
                          } else {
                            const newPages = displayPages.includes('all') 
                              ? [page.value]
                              : displayPages.includes(page.value)
                                ? displayPages.filter(p => p !== page.value)
                                : [...displayPages.filter(p => p !== 'all'), page.value];
                            setDisplayPages(newPages);
                          }
                        }}
                      >
                        {page.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Options</Label>
                  <div className="space-y-2 mt-2">
                    {options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Option text"
                          value={option.text}
                          onChange={(e) => updateOption(index, 'text', e.target.value)}
                        />
                        <Input
                          placeholder="Icon/Emoji"
                          value={option.icon}
                          onChange={(e) => updateOption(index, 'icon', e.target.value)}
                          className="w-20"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeOption(index)}
                          disabled={options.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addOption}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { setShowCreateDialog(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button onClick={editingPoll ? handleUpdatePoll : handleCreatePoll}>
                    {editingPoll ? 'Update Poll' : 'Create Poll'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {polls.map((poll) => {
            const pollResults = results[poll.id] || [];
            const totalVotes = pollResults.reduce((sum, result) => sum + result.vote_count, 0);
            const manualTotalActive = !!poll.use_manual_total_votes && poll.manual_total_votes !== null;
            const displayTotalVotes = manualTotalActive ? (poll.manual_total_votes as number) : totalVotes;
            return (
              <Card key={poll.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center gap-2">
                        {poll.title}
                        {poll.is_active ? (
                          <Badge variant="default">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {poll.intro_copy}
                      </p>
                      <div className="flex gap-1">
                        {poll.display_pages.map((page) => (
                          <Badge key={page} variant="outline" className="text-xs">
                            {page}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditingPoll(poll)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(poll.id, poll.is_active)}
                      >
                        {poll.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePoll(poll.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BarChart3 className="w-4 h-4" />
                        <span className="flex items-center gap-2">
                          Total votes: {displayTotalVotes}
                          {editingPercentages[poll.id] && (
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              value={tempTotalVotes[poll.id] ?? (poll.manual_total_votes ?? totalVotes)}
                              onChange={(e) => updateTempTotalVotes(poll.id, parseInt(e.target.value) || 0)}
                              className="w-24 h-7 text-xs"
                              placeholder="Total"
                            />
                          )}
                        </span>
                        {pollResults.some(r => r.is_manual) && (
                          <Badge variant="outline" className="text-xs">Manual Override</Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {editingPercentages[poll.id] ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cancelEditingPercentages(poll.id)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => saveManualPercentages(poll.id)}
                            >
                              Save
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleManualMode(poll.id, !pollResults.some(r => r.is_manual))}
                            >
                              {pollResults.some(r => r.is_manual) ? 'Auto Mode' : 'Manual Mode'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditingPercentages(poll.id)}
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {pollResults.map((result, index) => (
                        <div key={result.option_id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2">
                              <span className="text-lg">{result.option_icon}</span>
                              <span>{result.option_text}</span>
                              {result.is_manual && (
                                <Badge variant="secondary" className="text-xs">Manual</Badge>
                              )}
                            </span>
                            <div className="text-right text-sm flex items-center gap-2">
                              {editingPercentages[poll.id] ? (
                                <div className="flex items-center gap-2">
                                  <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-1">
                                      <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        value={tempPercentages[poll.id]?.[result.option_id] ?? result.percentage}
                                        onChange={(e) => updateTempPercentage(poll.id, result.option_id, parseFloat(e.target.value) || 0)}
                                        className="w-16 h-6 text-xs"
                                        placeholder="%"
                                      />
                                      <span className="text-xs">%</span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                      <Input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={tempVoteCounts[poll.id]?.[result.option_id] ?? result.vote_count}
                                        onChange={(e) => updateTempVoteCount(poll.id, result.option_id, parseInt(e.target.value) || 0)}
                                        className="w-16 h-6 text-xs"
                                        placeholder="votes"
                                      />
                                      <span className="text-xs text-muted-foreground">votes</span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div>{result.percentage}%</div>
                                  <div className="text-muted-foreground">{result.vote_count} votes</div>
                                </div>
                              )}
                            </div>
                          </div>
                          <Progress 
                            value={editingPercentages[poll.id] 
                              ? tempPercentages[poll.id]?.[result.option_id] ?? result.percentage
                              : result.percentage
                            } 
                            className="h-2" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {polls.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No polls created yet.</p>
                <Button 
                  className="mt-4" 
                  onClick={() => setShowCreateDialog(true)}
                >
                  Create Your First Poll
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminPolls;