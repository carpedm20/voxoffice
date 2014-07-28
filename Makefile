init:
	find ./ -name "migrations" -exec rm -rf {} \;
	rm db.sqlite3
	python ./manage.py syncdb
	python ./testcase.py

workon:
	workon comment
	# mkvirtualenv
	# rmvirtualenv
	# whereis virtualenvwrapper.sh

migrate:
	python ./manage.py migrate core
	python ./manage.py migrate users

clean:
	rm db.sqlite3
	find ./ -name "migrations" -exec rm -rf {} \;

freeze:
	pip freeze > requirements.txt
