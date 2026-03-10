import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { blogsApi } from '../api/endpoints/blogs';
import { CommentSection } from '../components/comment/CommentSection';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import type { AppError } from '../lib/errors';
import { formatDate } from '../lib/format';
import type { Blog } from '../types/blog';

export function BlogDetailPage() {
  const { slug = '' } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadBlog() {
      try {
        const nextBlog = await blogsApi.getBlogBySlug(slug);

        if (isMounted) {
          setBlog(nextBlog);
          setError(null);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError as AppError);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    setIsLoading(true);
    loadBlog();

    return () => {
      isMounted = false;
    };
  }, [refreshKey, slug]);

  if (isLoading) {
    return <LoadingState title="Loading article" />;
  }

  if (error || !blog) {
    return (
      <ErrorState
        message={error?.message || 'The requested blog could not be found.'}
        onAction={() => setRefreshKey((value) => value + 1)}
      />
    );
  }

  return (
    <article className="detail-stack">
      <Link className="text-link" to="/blogs">
        Back to blogs
      </Link>
      <header className="detail-hero">
        <div className="detail-copy">
          <span className="eyebrow">{blog.category.name}</span>
          <h1>{blog.title}</h1>
          <p>{blog.excerpt || blog.meta_description || 'FN Radio story detail.'}</p>
          <div className="detail-meta">
            <span>{formatDate(blog.published_at)}</span>
            <span>{blog.comments_count} comments</span>
            {blog.is_featured ? <span>Featured</span> : null}
          </div>
        </div>
        {blog.featured_image_url ? (
          <div
            className="detail-visual"
            style={{ backgroundImage: `url(${blog.featured_image_url})` }}
          />
        ) : null}
      </header>
      <section
        className="rich-content"
        dangerouslySetInnerHTML={{ __html: blog.content_html }}
      />
      <CommentSection commentsCount={blog.comments_count} slug={blog.slug} type="blog" />
    </article>
  );
}
