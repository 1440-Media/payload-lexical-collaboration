'use client'

import React, { useState } from 'react'

type CommentComposerProps = {
  placeholder?: string
  submitAddComment: (content: string) => void
}

/**
 * Component for composing and submitting new comments
 */
export const CommentComposer: React.FC<CommentComposerProps> = ({
  placeholder = 'Type a comment...',
  submitAddComment,
}) => {
  const [content, setContent] = useState('')
  const [canSubmit, setCanSubmit] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    setCanSubmit(newContent.trim().length > 0)
  }

  const handleSubmit = () => {
    if (canSubmit) {
      submitAddComment(content)
      setContent('')
      setCanSubmit(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && canSubmit) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="CommentPlugin_CommentsPanel_Composer">
      <textarea
        className="CommentPlugin_CommentsPanel_Editor"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        value={content}
      />
      <button
        aria-label="Send comment"
        className="CommentPlugin_CommentsPanel_SendButton"
        disabled={!canSubmit}
        onClick={handleSubmit}
      >
        <i className="send" />
      </button>
    </div>
  )
}
