'use strict'

const emojiMap = {
	feat: '✨',
	fix: '🐛',
	docs: '📚',
	style: '💎',
	refactor: '♻️',
	perf: '⚡',
	test: '✅',
	build: '🔨',
	ci: '👷',
	chore: '🔧',
	revert: '⏪',
}

module.exports = {
	prompter: function (cz, commit) {
		return cz
			.prompt([
				{
					type: 'list',
					name: 'type',
					message: 'Select the type of change:',
					choices: [
						{ name: '🚀 Feature (新功能)', value: 'feat' },
						{ name: '🐛 Bug Fix (修复)', value: 'fix' },
						{ name: '📚 Documentation (文档)', value: 'docs' },
						{ name: '💎 Style (格式)', value: 'style' },
						{ name: '📦 Refactor (重构)', value: 'refactor' },
						{ name: '🚀 Performance (性能)', value: 'perf' },
						{ name: '🚨 Tests (测试)', value: 'test' },
						{ name: '🛠 Build (构建)', value: 'build' },
						{ name: '⚙️ CI (持续集成)', value: 'ci' },
						{ name: '🔧 Chore (琐事)', value: 'chore' },
						{ name: '↩ Revert (回退)', value: 'revert' },
					],
					validate: function (input) {
						if (!input) {
							return 'You must select a type'
						}
						return true
					},
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
					validate: function (input) {
						if (!input) {
							return 'Short description cannot be empty'
						}
						return true
					},
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
				const emoji = emojiMap[answers.type] || ''
				const scope = answers.scope ? `(${answers.scope})` : ''
				const head = `${emoji} ${answers.type}${scope}: ${answers.subject}`
				const body = answers.body ? answers.body : ''
				const breaking = answers.breaking
					? `BREAKING CHANGE: ${answers.breaking}`
					: ''
				const issues = answers.issues ? `Closes ${answers.issues}` : ''

				commit(`${head}\n\n${body}\n\n${breaking}\n\n${issues}`)
			})
	},
}
