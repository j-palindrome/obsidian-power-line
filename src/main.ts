import { Notice, Plugin } from 'obsidian'
import { getAPI } from 'obsidian-dataview'
import { hiddenLines } from './extension'
import PowerLineView from './PowerLineView'

type MoveSettings = {}
const DEFAULT_SETTINGS: MoveSettings = {}

export default class MoveLine extends Plugin {
	settings: MoveSettings

	async onload() {
		const dv = getAPI()
		if (!dv) {
			new Notice('Please install Dataview to use this plugin')
			return
		}

		this.registerMarkdownCodeBlockProcessor(
			'powerline',
			(source, el, ctx) => {
				ctx.addChild(new PowerLineView(source, el, ctx, this.app))
			}
		)

		this.registerEditorExtension(hiddenLines)
		await this.loadSettings()
	}

	async loadSettings() {
		this.settings = Object.assign(DEFAULT_SETTINGS, await this.loadData())
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}

	async getDataView() {
		let dataViewPlugin = getAPI(this.app)
		if (!dataViewPlugin) {
			// wait for Dataview plugin to load (usually <100ms)
			dataViewPlugin = await new Promise((resolve) => {
				setTimeout(() => resolve(getAPI(this.app)), 350)
			})
			if (!dataViewPlugin) {
				new Notice(
					'Please enable the DataView plugin for Link Tree to work.'
				)
				throw new Error('no Dataview')
			}
		}
	}
}
