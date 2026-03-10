import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { homeApi } from '../api/endpoints/home';
import { BlogCard } from '../components/blog/BlogCard';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { PodcastCard } from '../components/podcast/PodcastCard';
import type { AppError } from '../lib/errors';
import { formatDate } from '../lib/format';
import type { HomeData } from '../types/home';

export function HomePage() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadHome() {
      try {
        const nextHomeData = await homeApi.getHome();

        if (isMounted) {
          setHomeData(nextHomeData);
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
    loadHome();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState
        message={error.message}
        onAction={() => setRefreshKey((value) => value + 1)}
      />
    );
  }

  if (!homeData) {
    return (
      <EmptyState
        title="The station is warming up"
        description="No home content is available yet."
      />
    );
  }

  const leadBanner = homeData.banners[0] || null;

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">FN Radio Myanmar</span>
          <h1>Late-night radio energy, interviews, and fresh drops in one dark feed.</h1>
          <p>
            The home screen now leans closer to the channel mood: darker, tighter,
            more like a live broadcast desk than a generic content app.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/podcasts">
              Explore podcasts
            </Link>
            <Link className="button button-secondary" to="/blogs">
              Read blogs
            </Link>
          </div>
        </div>
        <aside className="hero-spotlight">
          <span className="eyebrow">Current spotlight</span>
          <h2>{leadBanner?.title || 'On-air this week'}</h2>
          <p>{leadBanner?.subtitle || 'Highlights pulled directly from the FN Radio Myanmar API feed.'}</p>
          <dl className="hero-facts">
            <div>
              <dt>Banners</dt>
              <dd>{homeData.banners.length}</dd>
            </div>
            <div>
              <dt>Featured podcasts</dt>
              <dd>{homeData.featured_podcasts.length}</dd>
            </div>
            <div>
              <dt>Latest blogs</dt>
              <dd>{homeData.latest_blogs.length}</dd>
            </div>
          </dl>
          {leadBanner?.starts_at ? (
            <p className="hero-note">Live from {formatDate(leadBanner.starts_at)}</p>
          ) : null}
        </aside>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Browse by topic</span>
            <h2>Category channels</h2>
          </div>
          <p>Use backend-managed category slugs to jump straight into filtered lists.</p>
        </div>
        <div className="category-columns">
          <div className="category-column">
            <h3>Blog categories</h3>
            <div className="chip-list">
              {homeData.blog_categories.length ? (
                homeData.blog_categories.map((category) => (
                  <Link
                    className="filter-chip"
                    key={category.id}
                    to={`/blogs?category=${encodeURIComponent(category.slug)}`}
                  >
                    {category.name}
                  </Link>
                ))
              ) : (
                <p className="muted-copy">No blog categories available.</p>
              )}
            </div>
          </div>
          <div className="category-column">
            <h3>Podcast categories</h3>
            <div className="chip-list">
              {homeData.podcast_categories.length ? (
                homeData.podcast_categories.map((category) => (
                  <Link
                    className="filter-chip"
                    key={category.id}
                    to={`/podcasts?category=${encodeURIComponent(category.slug)}`}
                  >
                    {category.name}
                  </Link>
                ))
              ) : (
                <p className="muted-copy">No podcast categories available.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Featured audio</span>
            <h2>Featured voices</h2>
          </div>
          <Link className="text-link" to="/podcasts">
            See all podcasts
          </Link>
        </div>
        {homeData.featured_podcasts.length ? (
          <div className="media-grid">
            {homeData.featured_podcasts.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No featured podcasts yet"
            description="When the backend marks episodes as featured, they will surface here."
          />
        )}
      </section>

      <section className="section-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Fresh reporting</span>
            <h2>Latest from the station</h2>
          </div>
          <Link className="text-link" to="/blogs">
            See all blogs
          </Link>
        </div>
        {homeData.latest_blogs.length ? (
          <div className="media-grid">
            {homeData.latest_blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No blog posts published yet"
            description="The home feed is ready; it just needs published content."
          />
        )}
      </section>
    </div>
  );
}
