import { Link } from 'react-router-dom';

import { formatDate } from '../../lib/format';
import type { Podcast } from '../../types/podcast';

interface PodcastCardProps {
  podcast: Podcast;
}

export function PodcastCard({ podcast }: PodcastCardProps) {
  return (
    <article className="media-card">
      {podcast.cover_image_url ? (
        <div
          className="media-card-image"
          style={{ backgroundImage: `url(${podcast.cover_image_url})` }}
        />
      ) : (
        <div className="media-card-image media-card-image-placeholder">ON AIR</div>
      )}
      <div className="media-card-content">
        <div className="media-card-meta">
          <span>{podcast.category.name}</span>
          <span>{formatDate(podcast.published_at)}</span>
        </div>
        <h3>{podcast.title}</h3>
        <p>{podcast.description || 'A new FN Radio episode is ready to play.'}</p>
        <Link className="text-link" to={`/podcasts/${podcast.slug}`}>
          Open episode
        </Link>
      </div>
    </article>
  );
}
