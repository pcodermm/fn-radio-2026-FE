import { FormEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { categoriesApi } from '../api/endpoints/categories';
import { podcastsApi } from '../api/endpoints/podcasts';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { PaginationControls } from '../components/common/PaginationControls';
import { PodcastCard } from '../components/podcast/PodcastCard';
import type { AppError } from '../lib/errors';
import { formatCount } from '../lib/format';
import { buildSearchParams, parseBooleanParam, parsePageParam } from '../lib/query';
import type { PaginationMeta } from '../types/api';
import type { Podcast, PodcastCategory } from '../types/podcast';

export function PodcastsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [categories, setCategories] = useState<PodcastCategory[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const featured = parseBooleanParam(searchParams.get('featured')) === true;
  const page = parsePageParam(searchParams.get('page'));

  const [filters, setFilters] = useState({
    category,
    search,
    featured,
  });

  useEffect(() => {
    setFilters({ category, search, featured });
  }, [category, featured, search]);

  useEffect(() => {
    let isMounted = true;

    async function loadPodcasts() {
      try {
        const [nextCategories, result] = await Promise.all([
          categoriesApi.getPodcastCategories(),
          podcastsApi.getPodcasts({
            category: category || undefined,
            search: search || undefined,
            featured: featured || undefined,
            page,
          }),
        ]);

        if (isMounted) {
          setCategories(nextCategories);
          setPodcasts(result.items);
          setMeta(result.meta);
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
    loadPodcasts();

    return () => {
      isMounted = false;
    };
  }, [category, featured, page, search]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearchParams(
      buildSearchParams({
        category: filters.category || undefined,
        search: filters.search || undefined,
        featured: filters.featured || undefined,
        page: 1,
      })
    );
  }

  function handlePageChange(nextPage: number) {
    setSearchParams(
      buildSearchParams({
        category: category || undefined,
        search: search || undefined,
        featured: featured || undefined,
        page: nextPage,
      })
    );
  }

  return (
    <div className="page-stack">
      <section className="page-hero">
        <span className="eyebrow">Podcasts</span>
        <h1>Browse featured interviews, music sessions, and full FN Radio episodes.</h1>
        <p>
          These filters map directly to the backend list params: category, featured,
          search, and page.
        </p>
      </section>

      <section className="section-card">
        <form className="filter-bar" onSubmit={handleSubmit}>
          <label className="field-group">
            <span>Search</span>
            <input
              onChange={(event) =>
                setFilters((current) => ({ ...current, search: event.target.value }))
              }
              placeholder="Search podcasts"
              type="search"
              value={filters.search}
            />
          </label>
          <label className="field-group">
            <span>Category</span>
            <select
              onChange={(event) =>
                setFilters((current) => ({ ...current, category: event.target.value }))
              }
              value={filters.category}
            >
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="checkbox-field">
            <input
              checked={filters.featured}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  featured: event.target.checked,
                }))
              }
              type="checkbox"
            />
            <span>Featured only</span>
          </label>
          <button className="button button-primary" type="submit">
            Apply filters
          </button>
        </form>
      </section>

      {isLoading ? <LoadingState title="Loading podcasts" /> : null}
      {!isLoading && error ? <ErrorState message={error.message} /> : null}

      {!isLoading && !error && meta ? (
        <section className="section-card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Results</span>
              <h2>{formatCount(meta.pagination.total)} episodes found</h2>
            </div>
            <p>Page {meta.pagination.current_page}</p>
          </div>

          {podcasts.length ? (
            <>
              <div className="media-grid">
                {podcasts.map((podcast) => (
                  <PodcastCard key={podcast.id} podcast={podcast} />
                ))}
              </div>
              <PaginationControls meta={meta} onPageChange={handlePageChange} />
            </>
          ) : (
            <EmptyState
              title="No podcasts matched this filter set"
              description="Try a broader search or clear the featured-only toggle."
            />
          )}
        </section>
      ) : null}
    </div>
  );
}
