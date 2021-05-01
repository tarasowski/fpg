publish:
	npm version patch --force && npm publish


bundle: 
	@npx browserify ./src/index.js -o ./dist/bundle.js -s fpg
