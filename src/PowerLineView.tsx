import {
	Component,
	MarkdownPostProcessorContext,
	MarkdownRenderChild,
	parseYaml,
	App as ObsidianApp,
} from 'obsidian'
import { Root, createRoot } from 'react-dom/client'
import App from './App'

export default class PowerLineView extends MarkdownRenderChild {
	root: Root
	ctx: MarkdownPostProcessorContext
	source: FilterSettings
	app: ObsidianApp

	constructor(
		source: string,
		el: HTMLElement,
		ctx: MarkdownPostProcessorContext,
		app: ObsidianApp
	) {
		super(el)
		this.ctx = ctx
		this.source = parseYaml(source) ?? {}
		this.app = app
	}

	onload(): void {
		this.root = createRoot(this.containerEl)
		this.root.render(
			<App
				source={this.source}
				el={this.containerEl}
				ctx={this.ctx}
				app={this.app}
			/>
		)
	}

	onunload(): void {
		this.root.unmount()
	}
}
