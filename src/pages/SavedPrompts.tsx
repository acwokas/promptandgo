import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bookmark, Trash2, ExternalLink, Clock, Search, Grid3X3, List,
  Copy, Star, Download, ArrowUpDown, FolderPlus, Pencil, FolderOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useSavedPrompts } from '@/hooks/useSavedPrompts';
import SEO from '@/components/SEO';
import PageHero from '@/components/layout/PageHero';
import { toast } from 'sonner';

type SortKey = 'newest' | 'oldest' | 'alpha';
type ViewMode = 'grid' | 'list';

const SavedPrompts = () => {
  const { savedPrompts, removePrompt, clearAllSaved, count } = useSavedPrompts();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const handleRemove = (promptId: string, title: string) => {
    removePrompt(promptId);
    toast.success(`Removed "${title}"`);
  };

  const handleClearAll = () => {
    if (window.confirm('Remove all saved prompts?')) {
      clearAllSaved();
      toast.success('All saved prompts cleared');
    }
  };

  const handleExport = () => {
    toast.info('Export feature coming soon!');
  };

  const handleCopy = (title: string) => {
    navigator.clipboard.writeText(title);
    toast.success('Copied to clipboard');
  };

  const setRating = (id: string, r: number) => {
    setRatings(prev => ({ ...prev, [id]: r }));
  };

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const filtered = useMemo(() => {
    let items = [...savedPrompts];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    switch (sortBy) {
      case 'oldest': items.sort((a, b) => a.savedAt - b.savedAt); break;
      case 'alpha': items.sort((a, b) => a.title.localeCompare(b.title)); break;
      default: items.sort((a, b) => b.savedAt - a.savedAt);
    }
    return items;
  }, [savedPrompts, search, sortBy]);

  return (
    <>
      <SEO title="Saved Prompts" description="Your saved AI prompts for quick access." noindex />
      <PageHero
        title="Saved Prompts"
        subtitle={count > 0 ? `You have ${count} saved prompt${count !== 1 ? 's' : ''}` : 'Save prompts for quick access later'}
      />

      <div className="container max-w-4xl mx-auto px-4 py-8">
        {count > 0 ? (
          <>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search saved prompts..."
                  className="pl-9"
                  aria-label="Search saved prompts"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline" size="sm"
                  onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : sortBy === 'oldest' ? 'alpha' : 'newest')}
                  aria-label="Change sort order"
                >
                  <ArrowUpDown className="h-4 w-4 mr-1" />
                  {sortBy === 'newest' ? 'Newest' : sortBy === 'oldest' ? 'Oldest' : 'A-Z'}
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon"
                  onClick={() => setViewMode('grid')} aria-label="Grid view"
                ><Grid3X3 className="h-4 w-4" /></Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'} size="icon"
                  onClick={() => setViewMode('list')} aria-label="List view"
                ><List className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" onClick={handleExport} aria-label="Export prompts">
                  <Download className="h-4 w-4 mr-1" /> Export
                </Button>
                <Button variant="outline" size="sm" onClick={handleClearAll} aria-label="Clear all saved prompts">
                  <Trash2 className="h-4 w-4 mr-1" /> Clear
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-4">Saved locally on this device.</p>

            {/* Grid or List */}
            <div className={viewMode === 'grid' ? 'grid sm:grid-cols-2 gap-4' : 'space-y-3'}>
              {filtered.map((prompt) => (
                <Card key={prompt.id} className="group hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <Link to={prompt.slug} className="hover:text-primary transition-colors">
                          <CardTitle className="text-base font-semibold line-clamp-1">{prompt.title}</CardTitle>
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-[10px]">{prompt.category}</Badge>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {formatDate(prompt.savedAt)}
                          </span>
                        </div>
                        {/* Star rating */}
                        <div className="flex gap-0.5 mt-2">
                          {[1,2,3,4,5].map(s => (
                            <button
                              key={s}
                              onClick={() => setRating(prompt.id, s)}
                              className="focus:outline-none"
                              aria-label={`Rate ${s} star${s>1?'s':''}`}
                            >
                              <Star className={`h-3.5 w-3.5 ${(ratings[prompt.id] || 0) >= s ? 'fill-primary text-primary' : 'text-muted-foreground/40'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(prompt.title)} aria-label="Copy prompt title">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" asChild aria-label="Open prompt">
                          <Link to={prompt.slug}><ExternalLink className="h-4 w-4" /></Link>
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          onClick={() => handleRemove(prompt.id, prompt.title)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          aria-label="Remove saved prompt"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {prompt.excerpt && (
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2">{prompt.excerpt}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
              {filtered.length === 0 && (
                <p className="text-center text-muted-foreground py-8 col-span-full">No prompts match your search.</p>
              )}
            </div>
          </>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Bookmark className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-semibold mb-2">No saved prompts yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Browse our library and click the bookmark icon to save prompts for quick access. No login required!
              </p>
              <Button asChild>
                <Link to="/library">Browse Prompts</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default SavedPrompts;
