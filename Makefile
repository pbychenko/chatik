install: install-deps install-flow-typed

start-backend:
	npx nodemon --exec npx babel-node ./server.js

start-frontend:
	npx webpack-dev-server

start:
	npx nodemon --exec npx babel-node index.js

install-deps:
	npm install

build:
	rm -rf dist
	npm run build

publish: 
	npm publish --dry-run

lint:
	npx eslint .