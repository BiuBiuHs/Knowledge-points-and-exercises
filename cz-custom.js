'use strict'

module.exports = {
	prompter: function (cz, commit) {
		return cz
			.prompt([
				{
					type: 'list',
					name: 'type',
					message: 'Select the type of change:',
					choices: [
						{ name: '🚀 Feature', value: 'feat' },
						{ name: '🐛 Bug Fix', value: 'fix' },
						{ name: '📚 Documentation', value: 'docs' },
						{ name: '💎 Style', value: 'style' },
						{ name: '📦 Refactor', value: 'refactor' },
						{ name: '🚀 Performance', value: 'perf' },
						{ name: '🚨 Tests', value: 'test' },
						{ name: '🛠 Build', value: 'build' },
						{ name: '⚙️ CI', value: 'ci' },
						{ name: '🔧 Chore', value: 'chore' },
						{ name: '↩ Revert', value: 'revert' },
					],
				},
				{
					type: 'input',
					name: 'scope',
					message: 'Scope of this change (optional):',
				},
				{
					type: 'input',
					name: 'subject',
					message: 'Short description:',
				},
				{
					type: 'input',
					name: 'body',
					message: 'Longer description (optional):',
				},
				{
					type: 'input',
					name: 'breaking',
					message: 'List any breaking changes (optional):',
				},
				{
					type: 'input',
					name: 'issues',
					message: 'List any issues closed (optional):',
				},
			])
			.then((answers) => {
				const scope = answers.scope ? `(${answers.scope})` : ''
				const head = `${answers.type}${scope}: ${answers.subject}`
				const body = answers.body ? answers.body : ''
				const breaking = answers.breaking
					? `BREAKING CHANGE: ${answers.breaking}`
					: ''
				const issues = answers.issues ? `Closes ${answers.issues}` : ''

				commit(`${head}\n\n${body}\n\n${breaking}\n\n${issues}`)
			})
	},
}
