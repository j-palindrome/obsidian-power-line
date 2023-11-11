import { StateEffect } from '@codemirror/state'
import {
	App,
	MarkdownEditView,
	MarkdownPostProcessorContext,
	MarkdownSourceView,
	MarkdownView,
} from 'obsidian'
import invariant from 'tiny-invariant'
import { convertSearchToRegExp } from './services/util'
import { hideLineEffect } from './extension'

export const hideLines = (
	search: string,
	el: HTMLElement,
	ctx: MarkdownPostProcessorContext,
	app: App
) => {
	const searchExp = convertSearchToRegExp(search)
	const view = app.workspace.getActiveViewOfType(MarkdownView)

	if (!view) return
	const info = ctx.getSectionInfo(el)
	invariant(info)
	let lines = info.text.split('\n').slice(info.lineEnd + 1)
	let beginning = info.text.split('\n').slice(0, info.lineEnd + 1)
	let firstLine = info.lineEnd + 1
	while (lines[0]?.length === 0) {
		beginning.push(...lines.splice(0, 1))
		firstLine++
	}
	// add newline at end of list (CM is character-based)
	let from = beginning.join('\n').length + 1

	let lastLine = lines.findIndex((line) => line.length === 0)
	if (lastLine !== -1) lines = lines.slice(0, lastLine)
	const effects: StateEffect<number>[] = []

	for (let line of lines) {
		if (search.length > 0 && !searchExp.test(line)) {
			effects.push(hideLineEffect.of(from))
		}
		// add newline for new from char
		from += line.length + 1

		// @ts-ignore
		view.editor.cm.dispatch({ effects })
	}
}
