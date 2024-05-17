// Components
export {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  RenderPlaceholderProps,
  DefaultPlaceholder,
} from './components/editable'

// eslint-disable-next-line no-console
console.log('target1 in local slate-react')

export { DefaultElement } from './components/element'
export { DefaultLeaf } from './components/leaf'
export { Slate } from './components/slate'

// Hooks
export { useEditor } from './hooks/use-editor'
export { useSlateStatic } from './hooks/use-slate-static'
export { useFocused } from './hooks/use-focused'
export { useReadOnly } from './hooks/use-read-only'
export { useSelected } from './hooks/use-selected'
export { useSlate, useSlateWithV } from './hooks/use-slate'
export { useSlateSelector } from './hooks/use-slate-selector'
export { useSlateSelection } from './hooks/use-slate-selection'
export { DecorateContext, useDecorate } from './hooks/use-decorate'

// Plugin
export { ReactEditor } from './plugin/react-editor'
export { withReact } from './plugin/with-react'
