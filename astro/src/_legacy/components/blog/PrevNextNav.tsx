import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BLOG_POSTS } from "@/pages/blog/posts";
import { Button } from "@/components/ui/button";

const PrevNextNav = () => {
  const location = useLocation();
  const idx = BLOG_POSTS.findIndex((p) => p.path === location.pathname);
  const prev = idx > 0 ? BLOG_POSTS[idx - 1] : null;
  const next = idx >= 0 && idx < BLOG_POSTS.length - 1 ? BLOG_POSTS[idx + 1] : null;

  return (
    <>
      <Helmet>
        {prev && <link rel="prev" href={prev.path} />}
        {next && <link rel="next" href={next.path} />}
      </Helmet>
      <nav aria-label="Blog navigation" className="mt-10">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          {prev ? (
            <Button asChild variant="secondary">
              <Link to={prev.path} rel="prev">← {prev.title}</Link>
            </Button>
          ) : <span />}
          {next && (
            <Button asChild variant="secondary" className="sm:ml-auto">
              <Link to={next.path} rel="next">{next.title} →</Link>
            </Button>
          )}
        </div>
      </nav>
    </>
  );
};

export default PrevNextNav;
