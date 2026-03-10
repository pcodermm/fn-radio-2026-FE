import { CSSProperties, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { commentsApi } from '../../api/endpoints/comments';
import { useAuth } from '../../features/auth/useAuth';
import type { AppError } from '../../lib/errors';
import { formatDate } from '../../lib/format';
import type { PaginationMeta } from '../../types/api';
import type { Comment } from '../../types/comment';
import { PaginationControls } from '../common/PaginationControls';
import { CommentComposer } from './CommentComposer';

type CommentableType = 'blog' | 'podcast';
type ComposerTarget = 'root' | number | null;

interface CommentSectionProps {
  slug: string;
  type: CommentableType;
  commentsCount: number;
}

interface CommentNodeProps {
  comment: Comment;
  depth: number;
  isAuthenticated: boolean;
  activeReplyId: number | null;
  isSubmitting: boolean;
  submitTarget: ComposerTarget;
  submitError: AppError | null;
  submitResetSignal: number;
  deletingId: number | null;
  onReplyStart: (commentId: number) => void;
  onReplyCancel: () => void;
  onReplySubmit: (parentId: number, body: string) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
}

function CommentNode({
  comment,
  depth,
  isAuthenticated,
  activeReplyId,
  isSubmitting,
  submitTarget,
  submitError,
  submitResetSignal,
  deletingId,
  onReplyStart,
  onReplyCancel,
  onReplySubmit,
  onDelete,
}: CommentNodeProps) {
  const isReplying = activeReplyId === comment.id;
  const depthStyle = {
    '--comment-depth': Math.min(depth, 4),
  } as CSSProperties;

  return (
    <div
      className={`comment-card${depth > 0 ? ' comment-card-reply' : ''}`}
      style={depthStyle}
    >
      <div className="comment-card-header">
        <div>
          <strong>{comment.user.name || 'Listener'}</strong>
          <p>{formatDate(comment.created_at)}</p>
        </div>
        <span className="page-chip">{comment.replies_count} repl{comment.replies_count === 1 ? 'y' : 'ies'}</span>
      </div>
      <p className="comment-body">{comment.body}</p>
      <div className="comment-card-actions">
        {isAuthenticated ? (
          <button
            className="button button-secondary"
            onClick={() => (isReplying ? onReplyCancel() : onReplyStart(comment.id))}
            type="button"
          >
            {isReplying ? 'Close reply' : 'Reply'}
          </button>
        ) : null}
        {comment.can_delete ? (
          <button
            className="button button-secondary"
            disabled={deletingId === comment.id}
            onClick={() => onDelete(comment.id)}
            type="button"
          >
            {deletingId === comment.id ? 'Deleting...' : 'Delete thread'}
          </button>
        ) : null}
      </div>

      {isReplying ? (
        <CommentComposer
          autoFocus
          compact
          error={submitTarget === comment.id ? submitError : null}
          isSubmitting={isSubmitting && submitTarget === comment.id}
          onCancel={onReplyCancel}
          onSubmit={(body) => onReplySubmit(comment.id, body)}
          placeholder="Reply to this comment"
          resetSignal={submitResetSignal}
          submitLabel="Post reply"
          title="Reply"
        />
      ) : null}

      {comment.replies.length ? (
        <div className="comment-children">
          {comment.replies.map((reply) => (
            <CommentNode
              activeReplyId={activeReplyId}
              comment={reply}
              deletingId={deletingId}
              depth={depth + 1}
              isAuthenticated={isAuthenticated}
              isSubmitting={isSubmitting}
              key={reply.id}
              onDelete={onDelete}
              onReplyCancel={onReplyCancel}
              onReplyStart={onReplyStart}
              onReplySubmit={onReplySubmit}
              submitError={submitError}
              submitResetSignal={submitResetSignal}
              submitTarget={submitTarget}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function CommentSection({ slug, type, commentsCount }: CommentSectionProps) {
  const auth = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [submitTarget, setSubmitTarget] = useState<ComposerTarget>(null);
  const [submitError, setSubmitError] = useState<AppError | null>(null);
  const [submitResetSignal, setSubmitResetSignal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    setPage(1);
    setActiveReplyId(null);
  }, [slug, type]);

  useEffect(() => {
    let isMounted = true;

    async function loadComments() {
      try {
        const result =
          type === 'blog'
            ? await commentsApi.getBlogComments(slug, { page })
            : await commentsApi.getPodcastComments(slug, { page });

        if (isMounted) {
          setComments(result.items);
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
    loadComments();

    return () => {
      isMounted = false;
    };
  }, [page, refreshKey, slug, type]);

  async function handleCreateComment(body: string, parentId?: number) {
    setSubmitTarget(parentId ?? 'root');
    setIsSubmitting(true);

    try {
      if (type === 'blog') {
        await commentsApi.createBlogComment(slug, {
          body,
          parent_id: parentId,
        });
      } else {
        await commentsApi.createPodcastComment(slug, {
          body,
          parent_id: parentId,
        });
      }

      setSubmitError(null);
      setActiveReplyId(null);
      setSubmitResetSignal((value) => value + 1);

      if (!parentId && page !== 1) {
        setPage(1);
      } else {
        setRefreshKey((value) => value + 1);
      }
    } catch (requestError) {
      setSubmitError(requestError as AppError);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteComment(commentId: number) {
    const confirmed = window.confirm(
      'Deleting this comment will remove every nested reply underneath it. Continue?'
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(commentId);

    try {
      await commentsApi.deleteComment(commentId);
      setSubmitError(null);
      setActiveReplyId(null);

      if (comments.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        setRefreshKey((value) => value + 1);
      }
    } catch (requestError) {
      setError(requestError as AppError);
    } finally {
      setDeletingId(null);
    }
  }

  const totalComments = meta?.pagination.total ?? commentsCount;

  return (
    <section className="section-card comment-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Conversation</span>
          <h2>{totalComments} comments on this {type}</h2>
        </div>
        <p>Newest top-level comments first. Replies stay nested in the same thread.</p>
      </div>

      {auth.isAuthenticated ? (
        <CommentComposer
          error={submitTarget === 'root' ? submitError : null}
          isSubmitting={isSubmitting && submitTarget === 'root'}
          onSubmit={(body) => handleCreateComment(body)}
          placeholder={`Share your thoughts about this ${type}`}
          resetSignal={submitResetSignal}
          submitLabel="Post comment"
          title="New comment"
        />
      ) : (
        <div className="comment-auth-card">
          <div>
            <span className="eyebrow">Join the thread</span>
            <h3>Log in to post comments and nested replies.</h3>
            <p>
              You can browse the conversation without signing in, but posting and
              deleting your own threads requires an authenticated session.
            </p>
          </div>
          <div className="comment-auth-actions">
            <Link className="button button-secondary" to="/login">
              Login
            </Link>
            <Link className="button button-primary" to="/register">
              Create account
            </Link>
          </div>
        </div>
      )}

      {error ? (
        <div className="form-alert" role="alert">
          <strong>{error.message}</strong>
        </div>
      ) : null}

      {isLoading ? <p className="muted-copy">Loading comments...</p> : null}

      {!isLoading && !error && !comments.length ? (
        <div className="comment-empty">
          <h3>No comments yet</h3>
          <p>Start the first thread for this {type}.</p>
        </div>
      ) : null}

      {!isLoading && !error && comments.length ? (
        <>
          <div className="comment-thread">
            {comments.map((comment) => (
              <CommentNode
                activeReplyId={activeReplyId}
                comment={comment}
                deletingId={deletingId}
                depth={0}
                isAuthenticated={auth.isAuthenticated}
                isSubmitting={isSubmitting}
                key={comment.id}
                onDelete={handleDeleteComment}
                onReplyCancel={() => {
                  setActiveReplyId(null);
                  setSubmitError(null);
                }}
                onReplyStart={(commentId) => {
                  setActiveReplyId(commentId);
                  setSubmitError(null);
                }}
                onReplySubmit={(parentId, body) => handleCreateComment(body, parentId)}
                submitError={submitError}
                submitResetSignal={submitResetSignal}
                submitTarget={submitTarget}
              />
            ))}
          </div>
          {meta ? <PaginationControls meta={meta} onPageChange={setPage} /> : null}
        </>
      ) : null}
    </section>
  );
}
