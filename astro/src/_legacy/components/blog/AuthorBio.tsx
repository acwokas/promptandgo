import React from "react";

interface Author {
  name: string;
  title?: string;
  bio?: string;
  sameAs?: string[];
}

const AuthorBio = ({ author }: { author: Author }) => {
  const domains = (author.sameAs || []).map((u) => {
    try {
      const d = new URL(u).hostname.replace(/^www\./, "");
      return { url: u, label: d };
    } catch {
      return { url: u, label: u };
    }
  });

  return (
    <aside aria-labelledby="about-author" className="mt-10 border rounded-lg p-4 bg-card text-card-foreground">
      <h2 id="about-author" className="text-lg font-semibold">About the author</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        <strong className="font-medium">{author.name}</strong>
        {author.title ? ` - ${author.title}` : ""}
        {author.bio ? ` · ${author.bio}` : ""}
      </p>
      {domains.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-3">
          {domains.map(({ url, label }) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="me noopener noreferrer"
              className="underline underline-offset-4"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </aside>
  );
};

export default AuthorBio;
