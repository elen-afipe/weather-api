import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from 'globals'

export default defineConfig([
	{
		files: ["**/*.js"],
		plugins: {
			js,
		},
		extends: ["js/recommended"],
		rules: {
			"no-unused-vars": "warn",
			"no-undef": "warn",
		},
		languageOptions: {
			globals: {
			...globals.node,
			...globals.browser,
			},
		},
		ignores: ["dist/", "node_modules/", "build/", "**webpack.*.js"]
	},
    eslintConfigPrettier,
]);

