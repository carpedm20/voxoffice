import json
import numpy as np
from collections import defaultdict

MAX_RANK = 5

j = json.loads(open('static/movie0.json').read())

movies = defaultdict(int)
dates = defaultdict(int)

movie_title = {}

for i in j:
    if i['date'] < '20130101':
        continue
    if i['rank'] > MAX_RANK:
        continue
    url = i['url']
    code = int(url[url.index('code=')+5:])
    movies[code] += 1
    movie_title[code] = i['name']
    dates[i['date']] += 1

movies_key = movies.keys()
movies_key.sort()

dates = dates.keys()
dates.sort()

print "Distinct movies : %s" % len(movies_key)
print "Distinct dates : %s" % len(dates)

y1 = np.zeros((len(movies_key),len(dates)), dtype='int16')

new_movie_title = {}

movies_key = [i[0] for i in sorted(movies.iteritems(), key=lambda (k,v): v,reverse=True)]

for i in j:
    if i['date'] < '20130101':
        continue
    url = i['url']
    code = int(url[url.index('code=')+5:])
    try:
        new_code = movies_key.index(code)
    except:
        continue
    date = dates.index(i['date'])
    new_movie_title[new_code] = movie_title[code]
    y1[new_code][date] = int(i['rank'])


ans = {'movies' : new_movie_title,
       'mindate' : dates[0],
       'maxdate' : dates[-1],
       'y1' : y1.tolist() }

with open('new.json','w') as f:
    json.dump(ans, f)
