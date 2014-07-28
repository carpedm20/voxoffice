#!/usr/bin/python
import json
import sys

if len(sys.argv) < 2:
    print "Error: need 1 argument"
    sys.exit(1)

f=open(sys.argv[1], 'r')
j=json.loads(f.read())
f.close()

movie_dict = {}

for idx, i in enumerate(j):
    print "[%s/%s] %s. %s" % (idx, len(j), i['rank'], i['name'])

    i_copy = i.copy()
    i_copy.pop('date')

    try:
        ovie_dict[i['date']].append(i_copy)
    except:
        movie_dict[i['date']] = [i_copy]

f_name = "filtered_%s" % sys.argv[1]

f=open(f_name, 'w')
json.dump(movie_dict, f)
f.close()

print "Finished!"
