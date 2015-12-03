build-pages:
	git checkout gh-pages
	git pull
	cp -r ../dist/* .
