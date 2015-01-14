import json
import numpy as np
from collections import defaultdict

j = json.loads(open('static/movie0.json').read())

movies = defaultdict(int)
dates = defaultdict(int)

movie_title = {}

for i in j:
    if i['date'] > '20060101':
        break
    if i['rank'] > 10:
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

y0 = np.zeros((len(movies_key),len(dates)), dtype='int32')
y1 = np.zeros((len(movies_key),len(dates)), dtype='int32')

new_movie_title = {}

for i in j:
    if i['date'] > '20060101':
        break
    if i['rank'] > 10:
        continue
    url = i['url']
    code = int(url[url.index('code=')+5:])
    new_code = movies_key.index(code)
    date = dates.index(i['date'])

    new_movie_title[new_code] = movie_title[code]

    y1[new_code][date] = int(i['rank'])

y0[1] = y1[0]
for idx, row in enumerate(y1[1:-1]):
    y0[idx+2] = y0[idx+1] + row

ans = {'movies' : new_movie_title,
       'mindate' : dates[0],
       'maxdate' : dates[-1],
       'y0' : y0.tolist(),
       'y1' : y1.tolist() }

with open('new.json','w') as f:
    json.dump(ans, f)
