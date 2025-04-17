'use client'

import type { Comment, Thread } from '../types/core.js'

import { createUID } from './id.js'

/**
 * Creates a comment object with the given properties
 */
export function createComment(
  content: string,
  author: string,
  id?: string,
  timeStamp?: number,
  deleted?: boolean,
): Comment {
  return {
    id: id === undefined ? createUID() : id,
    type: 'comment',
    author,
    content,
    deleted: deleted === undefined ? false : deleted,
    timeStamp:
      timeStamp === undefined
        ? performance.timeOrigin + performance.now()
        : timeStamp,
  }
}

/**
 * Creates a thread object with the given properties
 */
export function createThread(
  quote: string,
  comments: Array<Comment>,
  id?: string,
): Thread {
  return {
    id: id === undefined ? createUID() : id,
    type: 'thread',
    comments,
    quote,
  }
}

/**
 * Creates a clone of a thread with a new array of comments
 */
export function cloneThread(thread: Thread): Thread {
  return {
    id: thread.id,
    type: 'thread',
    comments: Array.from(thread.comments),
    quote: thread.quote,
  }
}

/**
 * Creates a new comment marked as deleted
 */
export function markDeleted(comment: Comment): Comment {
  return {
    id: comment.id,
    type: 'comment',
    author: comment.author,
    content: '[Deleted Comment]',
    deleted: true,
    timeStamp: comment.timeStamp,
  }
}
