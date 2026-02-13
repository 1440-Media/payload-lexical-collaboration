'use client';
import { createUID } from './id.js';
/**
 * Creates a comment object with the given properties
 */ export function createComment(content, author, id, timeStamp, deleted) {
    return {
        id: id === undefined ? createUID() : id,
        type: 'comment',
        author,
        content,
        deleted: deleted === undefined ? false : deleted,
        timeStamp: timeStamp === undefined ? performance.timeOrigin + performance.now() : timeStamp
    };
}
/**
 * Creates a thread object with the given properties
 */ export function createThread(quote, comments, id, resolved) {
    return {
        id: id === undefined ? createUID() : id,
        type: 'thread',
        comments,
        quote,
        resolved
    };
}
/**
 * Creates a clone of a thread with a new array of comments
 */ export function cloneThread(thread) {
    return {
        id: thread.id,
        type: 'thread',
        comments: Array.from(thread.comments),
        quote: thread.quote,
        resolved: thread.resolved
    };
}
/**
 * Creates a new comment marked as deleted
 */ export function markDeleted(comment) {
    return {
        id: comment.id,
        type: 'comment',
        author: comment.author,
        content: '[Deleted Comment]',
        deleted: true,
        timeStamp: comment.timeStamp
    };
}

//# sourceMappingURL=factory.js.map