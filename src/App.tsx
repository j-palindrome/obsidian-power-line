import {
	App as ObsidianApp,
	MarkdownPostProcessorContext,
	ToggleComponent,
	parseYaml,
	MarkdownView,
	MarkdownEditView,
	MarkdownRenderer,
} from 'obsidian'
import { useEffect, useMemo, useState } from 'react'
import { convertSearchToRegExp } from './services/util'
import Button from 'packages/obsidian-components/Button'
import Toggle from '../../../packages/obsidian-components/Toggle'
import invariant from 'tiny-invariant'
import { hideLineEffect } from './extension'
import { StateEffect, StateEffectType } from '@codemirror/state'
import { hideLines } from './logic'

export default function App({
	source,
	el,
	ctx,
	app,
}: {
	source: FilterSettings
	el: HTMLElement
	ctx: MarkdownPostProcessorContext
	app: ObsidianApp
}) {
	const [search, setSearch] = useState(source.search ?? '')
	const [show, setShow] = useState(false)

	useEffect(() => hideLines(search, el, ctx, app), [search])

	return (
		<div className='relative bg-[var(--workspace-background-translucent)] font-sans'>
			<div className='flex w-full items-center'>
				<input
					className='prompt-input font-menu'
					placeholder='filter...'
					value={search}
					onChange={(ev) => setSearch(ev.target.value)}
				></input>
				<Toggle
					title='show'
					value={show}
					callback={(value) => setShow(value)}
				/>
			</div>
		</div>
	)
}
