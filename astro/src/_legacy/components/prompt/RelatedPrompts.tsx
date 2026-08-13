import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prompts } from "@/data/prompts";
import { Link } from "react-router-dom";

interface RelatedPromptsProps {
  limit?: number;
}

const RelatedPrompts = ({ limit = 3 }: RelatedPromptsProps) => {
  const picks = prompts.slice(0, limit);
  return (
    <section aria-labelledby="related-prompts" className="mt-12">
      <h2 id="related-prompts" className="text-xl md:text-2xl font-semibold tracking-tight mb-4">
        Related prompts you can try now
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {picks.map((p) => (
          <Card key={p.id} className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-base leading-tight">{p.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{p.excerpt}</p>
            </CardHeader>
            <CardContent className="mt-auto">
              <div className="flex flex-wrap gap-2 mb-3">
                {p.tags.slice(0, 3).map((t) => (
                  <Badge key={t} variant="outline">{t}</Badge>
                ))}
              </div>
              <Button asChild variant="secondary">
                <Link to={`/library?q=${encodeURIComponent(p.title)}`}>Search in Library</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default RelatedPrompts;
