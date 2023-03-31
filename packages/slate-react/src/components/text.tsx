import React, { useRef, useCallback } from 'react'
import { Element, Range, Text as SlateText } from 'slate'
import { ReactEditor, useSlateStatic } from '..'
import { useIsomorphicLayoutEffect } from '../hooks/use-isomorphic-layout-effect'
import { isTextDecorationsEqual } from '../utils/range-list'
import {
  EDITOR_TO_KEY_TO_ELEMENT,
  ELEMENT_TO_NODE,
  NODE_TO_ELEMENT,
} from '../utils/weak-maps'
import { RenderLeafProps, RenderPlaceholderProps, RenderTextProps } from './editable'
import Leaf from './leaf'

export const DefaultText = (props: RenderTextProps) => {
  const { attributes, callback, children } = props
  return <span {...attributes} ref={callback}>{children}</span>
}

/**
 * Text.
 */

const Text = (props: {
  decorations: Range[]
  isLast: boolean
  parent: Element
  renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element
  renderText?: (props: RenderTextProps) => JSX.Element
  renderLeaf?: (props: RenderLeafProps) => JSX.Element
  text: SlateText
}) => {
  const {
    decorations,
    isLast,
    parent,
    renderPlaceholder,
    renderText = (props: RenderTextProps) => <DefaultText {...props} />,
    renderLeaf,
    text,
  } = props
  const editor = useSlateStatic()
  const ref = useRef<HTMLSpanElement | null>(null)
  const leaves = SlateText.decorations(text, decorations)
  const key = ReactEditor.findKey(editor, text)
  const children = []

  for (let i = 0; i < leaves.length; i++) {
    const leaf = leaves[i]

    children.push(
      <Leaf
        isLast={isLast && i === leaves.length - 1}
        key={`${key.id}-${i}`}
        renderPlaceholder={renderPlaceholder}
        leaf={leaf}
        text={text}
        parent={parent}
        renderLeaf={renderLeaf}
      />
    )
  }

  // Update element-related weak maps with the DOM element ref.
  const callbackRef = useCallback(
    (span: HTMLSpanElement | null) => {
      const KEY_TO_ELEMENT = EDITOR_TO_KEY_TO_ELEMENT.get(editor)
      if (span) {
        KEY_TO_ELEMENT?.set(key, span)
        NODE_TO_ELEMENT.set(text, span)
        ELEMENT_TO_NODE.set(span, text)
      } else {
        KEY_TO_ELEMENT?.delete(key)
        NODE_TO_ELEMENT.delete(text)
        if (ref.current) {
          ELEMENT_TO_NODE.delete(ref.current)
        }
      }
      ref.current = span
    },
    [ref, editor, key, text]
  )

  const attributes: {
    'data-slate-node': 'text';
  } = {
    'data-slate-node': 'text',
  };

  return renderText({
    attributes,
    callback: callbackRef,
    children,
    text,
  });
}

const MemoizedText = React.memo(Text, (prev, next) => {
  return (
    next.parent === prev.parent &&
    next.isLast === prev.isLast &&
    next.renderLeaf === prev.renderLeaf &&
    next.renderText === prev.renderText &&
    next.renderPlaceholder === prev.renderPlaceholder &&
    next.text === prev.text &&
    isTextDecorationsEqual(next.decorations, prev.decorations)
  )
})

export default MemoizedText
