import json
import numpy as np
from bs4 import BeautifulSoup
import requests
from collections import defaultdict

MAX_RANK = 10
SKIP_DATE = 6

j = json.loads(open('static/movie0.json').read())

years = range(2007, 2015)

poster_dict = {}

def poster_url(code):
    b = BeautifulSoup(requests.get('http://movie.naver.com/movie/bi/mi/photoViewPopup.nhn?movieCode='+str(code)).text)
    try:
        img = b.find('img')
        return [img['src']+"?type=m203_290_2", img['alt']]
    except:
        return ['http://static.naver.net/movie/2012/06/dft_img203x290.png','']

for year in years:
    print year

    movies = defaultdict(int)
    dates = defaultdict(int)

    movie_title = {}

    start_year = '%s0101' % year
    end_year  = '%s1231' % year

    for i in j:
        dd = int(i['date'][-2:])
        if dd % SKIP_DATE == 0 or dd in [28,29,30,31]:
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
        dd = int(i['date'][-2:])
        if dd % SKIP_DATE == 0 or dd in [28,29,30,31]:
            if start_year < i['date'] < end_year:
                url = i['url']
                code = int(url[url.index('code=')+5:])
                try:
                    url = poster_dict[code]
                except:
                    url = poster_dict[code] = poster_url(code)
                try:
                    new_code = movies_key.index(code)
                except:
                    continue
                date = dates.index(i['date'])
                new_movie_title[new_code] = [code, url, movie_title[code]]
                y1[new_code][date] = int(i['rank'])

    ans = {'movies' : new_movie_title,
        'mindate' : dates[0],
        'maxdate' : dates[-1],
        'skipdate' : SKIP_DATE,
        'y1' : y1.tolist() }

    with open('fox-%s.json' % year,'w') as f:
        json.dump(ans, f)
