import { Link } from 'react-router-dom';

import { formatDate } from '../../lib/format';
import type { Blog } from '../../types/blog';

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <article className="media-card">
      {blog.featured_image_url ? (
        <div
          className="media-card-image"
          style={{ backgroundImage: `url(${blog.featured_image_url})` }}
        />
      ) : (
        <div className="media-card-image media-card-image-placeholder">FN Radio</div>
      )}
      <div className="media-card-content">
        <div className="media-card-meta">
          <span>{blog.category.name}</span>
          <span>{formatDate(blog.published_at)}</span>
        </div>
        <h3>{blog.title}</h3>
        <p>{blog.excerpt || 'Fresh reporting from the FN Radio newsroom.'}</p>
        <Link className="text-link" to={`/blogs/${blog.slug}`}>
          Read article
        </Link>
      </div>
    </article>
  );
}
