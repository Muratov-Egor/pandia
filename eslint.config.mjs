import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';

export default [
	{
		files: ['**/*.{js,mjs,cjs,ts}']
	},
	{
		languageOptions: {
			globals: globals.browser,
			parser: tsParser,
		},
		plugins: {
			'@typescript-eslint': tseslint,
		},
		rules: {
			...pluginJs.configs.recommended.rules,
			...tseslint.configs.recommended.rules,
			'no-unused-vars': 'off', // Disable the rule for JavaScript files
			'@typescript-eslint/no-unused-vars': 'off', // Disable the rule for TypeScript files
		},
	},
	{
		ignores: ['**/temp.js', 'config/*']
	}
];

