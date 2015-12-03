build-pages:
	git checkout gh-pages
	cp -r ../dist/* .
	git commit --all --message 'build dist'
	# git push
