build-pages:
	git checkout gh-pages
	cp ../dist/* .
	git commit --all --message 'build dist'
	git push
