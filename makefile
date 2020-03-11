release:
	standard-version &&  git push --follow-tags origin master

update_all_docs:
	make doc=gorm update_doc
	make doc=gin update_doc
	make doc=dayjs update_doc
	make doc=reactjs update_doc

update_doc:
	cd origin-docs/${doc} git pull \
	&& cd ../../ \
	&& utools doc -p docs/${doc}/plugin.json docs/${doc}
