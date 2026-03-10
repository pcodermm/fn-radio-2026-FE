import { FormEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { blogsApi } from '../api/endpoints/blogs';
import { categoriesApi } from '../api/endpoints/categories';
import { BlogCard } from '../components/blog/BlogCard';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { PaginationControls } from '../components/common/PaginationControls';
import type { AppError } from '../lib/errors';
import { formatCount } from '../lib/format';
import { buildSearchParams, parseBooleanParam, parsePageParam } from '../lib/query';
import type { PaginationMeta } from '../types/api';
import type { Blog, BlogCategory } from '../types/blog';

export function BlogsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
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

    async function loadBlogs() {
      try {
        const [nextCategories, result] = await Promise.all([
          categoriesApi.getBlogCategories(),
          blogsApi.getBlogs({
            category: category || undefined,
            search: search || undefined,
            featured: featured || undefined,
            page,
          }),
        ]);

        if (isMounted) {
          setCategories(nextCategories);
          setBlogs(result.items);
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
    loadBlogs();

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
        <span className="eyebrow">Blogs</span>
        <h1>Editorial updates, behind-the-scenes notes, and station coverage.</h1>
        <p>
          Filter by category slug, featured status, search term, and page directly
          through the backend list contract.
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
              placeholder="Search blogs"
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

      {isLoading ? <LoadingState title="Loading blogs" /> : null}
      {!isLoading && error ? <ErrorState message={error.message} /> : null}

      {!isLoading && !error && meta ? (
        <section className="section-card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Results</span>
              <h2>{formatCount(meta.pagination.total)} stories found</h2>
            </div>
            <p>Page {meta.pagination.current_page}</p>
          </div>

          {blogs.length ? (
            <>
              <div className="media-grid">
                {blogs.map((blog) => (
                  <BlogCard blog={blog} key={blog.id} />
                ))}
              </div>
              <PaginationControls meta={meta} onPageChange={handlePageChange} />
            </>
          ) : (
            <EmptyState
              title="No blogs matched this filter set"
              description="Try clearing a category or search term to widen the results."
            />
          )}
        </section>
      ) : null}
    </div>
  );
}
