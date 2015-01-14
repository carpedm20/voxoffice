import json
import numpy as np
from collections import defaultdict

j = json.loads(open('static/movie0.json').read())

movies = defaultdict(int)
dates = defaultdict(int)

for i in j:
    if i['date'] > '20060101':
        break
    if i['rank'] > 10:
        continue
    url = i['url']
    code = int(url[url.index('code=')+5:])
    movies[code] += 1
    dates[i['date']] += 1

movies = movies.keys()
movies.sort()

dates = dates.keys()
dates.sort()

print "Distinct movies : %s" % len(movies)
print "Distinct dates : %s" % len(dates)

np_arr = np.zeros((len(movies),len(dates)), dtype='int32')

for i in j:
    if i['date'] > '20060101':
        break
    if i['rank'] > 10:
        continue
    url = i['url']
    code = int(url[url.index('code=')+5:])
    code = movies.index(code)
    date = dates.index(i['date'])

    np_arr[code][date] = int(i['rank'])

ans = {'movies' : len(movies),
       'dates' : len(dates),
       'data' : np_arr.tolist() }

with open('new.json','w') as f:
    json.dump(ans, f)
