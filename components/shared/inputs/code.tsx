import { tags } from '@lezer/highlight'
import createTheme from '@uiw/codemirror-themes'
import ReactCodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror'
import { amber, blue, gray, purple, rose } from 'tailwindcss/colors'

import { cn } from '@/lib/util'

export default function Code({ className, ...props }: ReactCodeMirrorProps) {
  const theme = createTheme({
    theme: 'dark',
    settings: {
      background: 'transparent',
      foreground: 'inherit',
      caret: gray[400],
      selection: gray[900],
      selectionMatch: gray[900],
      gutterBackground: gray[900],
      gutterForeground: 'inherit',
      lineHighlight: 'transparent',
      fontSize: '1rem',
    },
    styles: [
      { tag: tags.string, color: rose[700] },
      { tag: tags.keyword, color: rose[700] },
      { tag: tags.definitionKeyword, color: amber[700] },
      { tag: tags.propertyName, color: blue[700] },
      { tag: tags.attributeName, color: purple[700] },
    ],
  })

  return (
    <ReactCodeMirror
      className={cn('outline outline-1 outline-base-200 size-full', className)}
      theme={theme}
      {...props}
    />
  )
}
