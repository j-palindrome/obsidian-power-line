import {
	EditorState,
	Extension,
	Facet,
	RangeSetBuilder,
	StateEffect,
	StateField,
	Transaction,
} from '@codemirror/state'
import { EditorView, Decoration, DecorationSet } from '@codemirror/view'
import { syntaxTree } from '@codemirror/language'
import { App } from 'obsidian'

export const hideLineEffect = StateEffect.define<number>()

export const hiddenLines = StateField.define<DecorationSet>({
	create(state): DecorationSet {
		return Decoration.none
	},
	update(_oldState: DecorationSet, transaction: Transaction): DecorationSet {
		const builder = new RangeSetBuilder<Decoration>()

		const updatedLines: number[] = []
		for (let effect of transaction.effects) {
			if (effect.is(hideLineEffect)) {
				updatedLines.push(effect.value)
			}
		}

		syntaxTree(transaction.state).iterate({
			enter(node) {
				if (updatedLines.includes(node.from)) {
					builder.add(
						node.from,
						node.to + 1,
						Decoration.replace({
							block: true,
						})
					)
				}
			},
		})

		return builder.finish()
	},
	provide(field: StateField<DecorationSet>): Extension {
		return EditorView.decorations.from(field)
	},
})
