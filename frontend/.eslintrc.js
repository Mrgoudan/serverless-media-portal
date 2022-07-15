module.exports = {
	"env": {
		"browser": true,
		"es2021": true,
		"node": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended"
	],
	"parserOptions": {
		"ecmaFeatures": {
			"jsx": true
		},
		"ecmaVersion": 12,
		"sourceType": "module"
	},
	"plugins": [
		"react"
	],
	"rules": {
		"linebreak-style": 0,
		"semi": [
			"error",
			"always"
		],
		"no-unused-vars": [
			"warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }
		],
		"react/prop-types": [
			0
		],
	}
};
