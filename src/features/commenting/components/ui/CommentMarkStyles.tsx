'use client'

import React from 'react'
import './CommentMarks.css'
import './DisabledCommentMarks.css'

/**
 * CommentMarkStyles component
 * 
 * This component conditionally applies the appropriate CSS class for comment marks
 * based on whether the plugin is enabled or disabled.
 * 
 * When enabled, it adds the 'comments-enabled' class to the document body.
 * When disabled, it adds the 'comments-disabled' class to the document body.
 */
export const CommentMarkStyles: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  // Apply classes immediately on mount and when enabled changes
  React.useEffect(() => {
    // Function to apply classes
    const applyClasses = () => {
      if (typeof document !== 'undefined') {
        if (enabled) {
          document.body.classList.add('comments-enabled')
          document.body.classList.remove('comments-disabled')
          console.log('Comment marks enabled - applied comments-enabled class')
        } else {
          document.body.classList.add('comments-disabled')
          document.body.classList.remove('comments-enabled')
          console.log('Comment marks disabled - applied comments-disabled class')
        }
      }
    }

    // Apply classes immediately
    applyClasses()

    // Also apply after a short delay to ensure DOM is fully loaded
    const timeoutId = setTimeout(applyClasses, 100)

    // Cleanup function
    return () => {
      clearTimeout(timeoutId)
      if (typeof document !== 'undefined') {
        document.body.classList.remove('comments-enabled')
        document.body.classList.remove('comments-disabled')
      }
    }
  }, [enabled])

  // Create a style element with direct CSS overrides
  React.useEffect(() => {
    if (typeof document === 'undefined') return;

    // Create a style element
    const styleElement = document.createElement('style');
    styleElement.id = 'comment-marks-override-styles';
    
    // Add the CSS content
    if (!enabled) {
      styleElement.textContent = `
        /* Direct override for disabled comment marks - with highest specificity */
        [data-lexical-mark],
        span[data-lexical-mark],
        .editor-container [data-lexical-mark],
        .editor-container span[data-lexical-mark],
        div.editor-container [data-lexical-mark],
        div.editor-container span[data-lexical-mark],
        [data-lexical-editor] [data-lexical-mark],
        [data-lexical-editor] span[data-lexical-mark],
        *[data-lexical-mark],
        * [data-lexical-mark] {
          background-color: transparent !important;
          background: none !important;
          cursor: default !important;
          border: none !important;
          box-shadow: none !important;
          text-decoration: none !important;
          color: inherit !important;
          border-bottom: none !important;
          border-top: none !important;
          border-left: none !important;
          border-right: none !important;
          outline: none !important;
          text-shadow: none !important;
          -webkit-text-decoration: none !important;
          -moz-text-decoration: none !important;
          text-decoration-line: none !important;
          text-decoration-style: none !important;
          text-decoration-color: transparent !important;
          text-decoration-thickness: 0 !important;
          text-underline-offset: 0 !important;
          text-decoration-skip-ink: all !important;
          text-emphasis: none !important;
          -webkit-text-emphasis: none !important;
        }
        
        /* Target mark elements directly */
        mark,
        span.mark,
        .editor-container mark,
        [data-lexical-editor] mark,
        * mark,
        *[class*="mark"],
        *[class*="comment"] {
          background-color: transparent !important;
          background: none !important;
          color: inherit !important;
          border-bottom: none !important;
          border-top: none !important;
          border-left: none !important;
          border-right: none !important;
          outline: none !important;
          text-shadow: none !important;
          -webkit-text-decoration: none !important;
          -moz-text-decoration: none !important;
          text-decoration-line: none !important;
          text-decoration-style: none !important;
          text-decoration-color: transparent !important;
          text-decoration-thickness: 0 !important;
          text-underline-offset: 0 !important;
          text-decoration-skip-ink: all !important;
          text-emphasis: none !important;
          -webkit-text-emphasis: none !important;
        }
      `;
    }
    
    // Add the style element to the head
    document.head.appendChild(styleElement);
    
    // Cleanup function
    return () => {
      const existingStyle = document.getElementById('comment-marks-override-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [enabled]);

  return null
}
