import json
import numpy as np
from collections import defaultdict

MAX_RANK = 10

j = json.loads(open('static/movie0.json').read())

years = range(2007, 2015)

for year in years:
    print year

    movies = defaultdict(int)
    dates = defaultdict(int)

    movie_title = {}

    start_year = '%s0101' % year
    end_year  = '%s1231' % year

    for i in j:
        if start_year < i['date'] < end_year:
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
        if start_year < i['date'] < end_year:
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

    with open('fox-%s.json' % year,'w') as f:
        json.dump(ans, f)