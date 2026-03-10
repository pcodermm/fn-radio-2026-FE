import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { podcastsApi } from '../api/endpoints/podcasts';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import type { AppError } from '../lib/errors';
import { formatDate } from '../lib/format';
import type { Podcast } from '../types/podcast';

export function PodcastDetailPage() {
  const { slug = '' } = useParams();
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadPodcast() {
      try {
        const nextPodcast = await podcastsApi.getPodcastBySlug(slug);

        if (isMounted) {
          setPodcast(nextPodcast);
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
    loadPodcast();

    return () => {
      isMounted = false;
    };
  }, [refreshKey, slug]);

  if (isLoading) {
    return <LoadingState title="Loading episode" />;
  }

  if (error || !podcast) {
    return (
      <ErrorState
        message={error?.message || 'The requested podcast could not be found.'}
        onAction={() => setRefreshKey((value) => value + 1)}
      />
    );
  }

  return (
    <article className="detail-stack">
      <Link className="text-link" to="/podcasts">
        Back to podcasts
      </Link>
      <header className="detail-hero">
        <div className="detail-copy">
          <span className="eyebrow">{podcast.category.name}</span>
          <h1>{podcast.title}</h1>
          <p>{podcast.description || 'Tune in to the latest FN Radio episode.'}</p>
          <div className="detail-meta">
            <span>{formatDate(podcast.published_at)}</span>
            {podcast.is_featured ? <span>Featured</span> : null}
          </div>
          <a
            className="button button-primary"
            href={podcast.youtube_url}
            rel="noreferrer"
            target="_blank"
          >
            Watch on YouTube
          </a>
        </div>
        {podcast.cover_image_url ? (
          <div
            className="detail-visual"
            style={{ backgroundImage: `url(${podcast.cover_image_url})` }}
          />
        ) : null}
      </header>
      {podcast.youtube_video_id ? (
        <section className="section-card">
          <div className="video-frame">
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              src={`https://www.youtube.com/embed/${podcast.youtube_video_id}`}
              title={podcast.title}
            />
          </div>
        </section>
      ) : null}
      <section className="section-card">
        <div className="detail-copy-block">
          <h2>Episode summary</h2>
          <p>{podcast.description || 'No episode summary was provided by the backend.'}</p>
        </div>
      </section>
    </article>
  );
}
