'use client'

import type { RangeSelection } from '@payloadcms/richtext-lexical/lexical'

import { $getSelection, $isRangeSelection } from '@payloadcms/richtext-lexical/lexical'
import { createDOMRange, createRectsFromDOMRange } from '@payloadcms/richtext-lexical/lexical/selection'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { CommentInputBoxProps } from '../../types/props.js'

import { createComment, createThread } from '../../utils/factory.js'

export const CommentInputBox: React.FC<CommentInputBoxProps> = ({
  author,
  cancelAddComment,
  editor,
  setActiveAnchorKey,
  setShowCommentInput,
  submitAddComment,
}) => {
  const [content, setContent] = useState('')
  const [canSubmit, setCanSubmit] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const selectionState = useMemo(
    () => ({
      container: document.createElement('div'),
      elements: [],
    }),
    [],
  )
  const selectionRef = useRef<null | RangeSelection>(null)

  const updateLocation = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection()

      if ($isRangeSelection(selection)) {
        selectionRef.current = selection.clone()
        const anchor = selection.anchor
        const focus = selection.focus
        const range = createDOMRange(
          editor,
          anchor.getNode(),
          anchor.offset,
          focus.getNode(),
          focus.offset,
        )
        const boxElem = boxRef.current
        const editorRoot = editor.getRootElement()
        
        if (range !== null && boxElem !== null && editorRoot !== null) {
          const editorRect = editorRoot.getBoundingClientRect()
          const rangeRect = range.getBoundingClientRect()
          const selectionRects = createRectsFromDOMRange(editor, range)
          
          // Calculate left position relative to viewport
          let correctedLeft =
            selectionRects.length === 1 
              ? rangeRect.left + rangeRect.width / 2 - 125 
              : rangeRect.left - 125
          
          // Ensure the box stays within the editor bounds
          correctedLeft = Math.max(10, Math.min(correctedLeft, editorRect.width - 260))
          
          // Calculate top position relative to viewport
          const viewportHeight = window.innerHeight
          let topPosition = rangeRect.bottom + window.scrollY + 20
          
          // If the box would overflow the viewport bottom, position it above the selection
          const absoluteTop = rangeRect.bottom + 20 // Viewport-relative top position
          if (boxElem.offsetHeight && absoluteTop + boxElem.offsetHeight > viewportHeight) {
            topPosition = rangeRect.top + window.scrollY - (boxElem.offsetHeight + 10)
          }
          
          // Apply the calculated positions
          boxElem.style.position = 'absolute'
          boxElem.style.left = `${correctedLeft}px`
          boxElem.style.top = `${topPosition}px`
          
          // Update highlight overlays
          const selectionRectsLength = selectionRects.length
          const { container } = selectionState
          const elements: Array<HTMLSpanElement> = selectionState.elements
          const elementsLength = elements.length

          for (let i = 0; i < selectionRectsLength; i++) {
            const selectionRect = selectionRects[i]
            let elem: HTMLSpanElement = elements[i]
            if (elem === undefined) {
              elem = document.createElement('span')
              elements[i] = elem
              container.appendChild(elem)
            }
            const color = '255, 212, 0'
            const style = `position:absolute;top:${
              selectionRect.top + window.scrollY
            }px;left:${selectionRect.left}px;height:${
              selectionRect.height
            }px;width:${
              selectionRect.width
            }px;background-color:rgba(${color}, 0.3);pointer-events:none;z-index:5;`
            elem.style.cssText = style
          }
          
          // Clean up any extra highlight elements
          for (let i = elementsLength - 1; i >= selectionRectsLength; i--) {
            const elem = elements[i]
            container.removeChild(elem)
            elements.pop()
          }
        }
      }
    })
  }, [editor, selectionState])

  useLayoutEffect(() => {
    updateLocation()
    const container = selectionState.container
    const body = document.body
    if (body !== null) {
      body.appendChild(container)
      return () => {
        body.removeChild(container)
      }
    }
  }, [selectionState.container, updateLocation])

  useEffect(() => {
    window.addEventListener('resize', updateLocation)
    window.addEventListener('scroll', updateLocation, true)

    return () => {
      window.removeEventListener('resize', updateLocation)
      window.removeEventListener('scroll', updateLocation, true)
    }
  }, [updateLocation])

  // Focus the textarea after a small delay to prevent scroll jump
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [])

  const submitComment = () => {
    if (canSubmit) {
      let quote = editor.getEditorState().read(() => {
        const selection = selectionRef.current
        return selection ? selection.getTextContent() : ''
      })
      if (quote.length > 100) {
        quote = quote.slice(0, 99) + '…'
      }
      submitAddComment(
        createThread(quote, [createComment(content, author)]),
        true,
        undefined,
        selectionRef.current,
      )
      selectionRef.current = null
      // Reset the active anchor key to hide the AddCommentBox tooltip
      setActiveAnchorKey(null)
      // Close the comment input form
      setShowCommentInput(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    setCanSubmit(newContent.trim().length > 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      cancelAddComment()
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && canSubmit) {
      e.preventDefault()
      submitComment()
    }
  }

  return createPortal(
    <div className="CommentPlugin_CommentInputBox" ref={boxRef}>
      <div className="CommentPlugin_CommentInputBox_EditorContainer">
        <textarea
          aria-label="Comment text"
          className="CommentPlugin_CommentInputBox_Editor"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a comment..."
          ref={textareaRef}
          value={content}
        />
      </div>
      <div className="CommentPlugin_CommentInputBox_Buttons">
        <button
          className="CommentPlugin_CommentInputBox_Button"
          onClick={cancelAddComment}
          type="button"
        >
          Cancel
        </button>
        <button
          className="CommentPlugin_CommentInputBox_Button primary"
          disabled={!canSubmit}
          onClick={submitComment}
          type="button"
        >
          Comment
        </button>
      </div>
    </div>,
    document.body,
  )
}
