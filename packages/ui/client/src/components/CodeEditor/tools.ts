import { Monaco } from '@monaco-editor/react'

export interface IRange {
  /**
   * Column on which the range ends in line `endLineNumber`.
   */
  readonly endColumn: number
  /**
   * Line number on which the range ends.
   */
  readonly endLineNumber: number
  /**
   * Column on which the range starts in line `startLineNumber` (starts at 1).
   */
  readonly startColumn: number
  /**
   * Line number on which the range starts (starts at 1).
   */
  readonly startLineNumber: number
}

export interface CompletionItemRanges {
  insert: IRange
  replace: IRange
}

export const createDependencyProposals = (monaco: Monaco, range: CompletionItemRanges | IRange) => {
  return [
    {
      documentation: `object/function, rewrite target's url path. Object-keys will be used as RegExp to match paths`,
      insertText: `"pathRewrite": {}`,
      kind: monaco.languages.CompletionItemKind.Function,
      label: '"pathRewrite"',
      range: range,
    },
    {
      documentation: 'object/function, re-target option.target for specific requests',
      insertText: '"router": {}',
      kind: monaco.languages.CompletionItemKind.Function,
      label: '"router"',
      range: range,
    },
    {
      documentation: `string, ['debug', 'info', 'warn', 'error', 'silent']. Default: 'info']`,
      insertText: `"logLevel": "silent"`,
      kind: monaco.languages.CompletionItemKind.Function,
      label: 'logLevel',
      range: range,
    },
    {
      documentation: `function, subscribe to http-proxy's error event for custom error handling.`,
      insertText: `onError(err, req, res, target) {}`,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      kind: monaco.languages.CompletionItemKind.Function,
      label: '"onError"',
      range: range,
    },
  ]
}

export const registerAutoCompletion = (monaco: Monaco) => {
  monaco.languages.registerCompletionItemProvider('json', {
    provideCompletionItems: function (model, position) {
      const textUntilPosition = model.getValueInRange({
        endColumn: position.column,
        endLineNumber: position.lineNumber,
        startColumn: 1,
        startLineNumber: 1,
      })
      const match = textUntilPosition.match(/{\s*("[^"]*"\s*:\s*"[^"]*"\s*,\s*)*([^"]*)?$/)
      if (!match) {
        return { suggestions: [] }
      }
      const word = model.getWordUntilPosition(position)
      const range = {
        endColumn: word.endColumn,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        startLineNumber: position.lineNumber,
      }
      return {
        suggestions: createDependencyProposals(monaco, range),
      }
    },
  })
}
