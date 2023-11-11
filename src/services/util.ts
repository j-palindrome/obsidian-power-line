import _ from 'lodash'

export const convertSearchToRegExp = (search: string) =>
	new RegExp(
		search
			.split(' ')
			.map((word) => _.escapeRegExp(word))
			.join('.*'),
		'i'
	)
