import Editor, { EditorProps, loader, Monaco } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import React from 'react'

import CenterSpin from '../CenterSpin'
import { registerAutoCompletion } from './tools'

import './index.less'

loader.config({
  monaco,
})

const CodeEditor = (props: EditorProps) => {
  const onBeforeMount = (monaco: Monaco) => {
    registerAutoCompletion(monaco)
  }

  return (
    <Editor
      beforeMount={onBeforeMount}
      className="code-editor"
      defaultLanguage="json"
      height={300}
      loading={<CenterSpin />}
      options={{
        contextmenu: false,
        formatOnPaste: true,
        lineNumbersMinChars: 3,
        minimap: { enabled: false },
        tabSize: 2,
      }}
      theme="vs-dark"
      {...props}
    />
  )
}

export default CodeEditor
