#-*- coding: utf-8 -*-
import json
import numpy as np
from bs4 import BeautifulSoup
import requests
from collections import defaultdict

MAX_RANK = 20

#for chart_type in ['total', 'domestic', 'oversea']:
chart_type = 'total'
j = json.loads(open('scrapy/music_%s.json' % chart_type).read())

artist_name = {}

for i in j:
    code = i['artist_id']
    if code != -1:
        artist_name[i['artist']] = code

for year in xrange(2008, 2015):
    print year

    artists = defaultdict(int)
    dates = defaultdict(int)

    artist_id = {}
    artist = {}

    start_year = '%s0101' % year
    end_year  = '%s1231' % year

    for i in j:
        dd = int(i['date'][:4])
        if dd == year:
            code = i['artist_id']

            if i['rank'] > MAX_RANK:
                continue

            if code == -1:
                try:
                    code = i['artist_id'] = artist_name[i['artist']]
                except:
                    try:
                        item = [item for item in artist_name.items() if i['artist'][:-2] in item[0]][0]
                        code = item[1]
                    except:
                        if i['artist'] == u'HIGH4':
                            code = i['artist_id'] = 326950
                        elif i['artist'] == u'신용재(포맨)':
                            code = i['artist_id'] = 125963

                if code == -1:
                    continue

            artists[code] += 1

            artist[code] = i['artist']
            artist_id[code] = i['artist_id']

            dates[int(i['date'])] += 1

    artists_key = artists.keys()
    artists_key.sort()

    dates = dates.keys()
    dates.sort()

    print "Distinct artists : %s" % len(artists_key)
    print "Distinct dates : %s" % len(dates)

    y1 = np.zeros((len(artists_key),len(dates)), dtype='int16')

    new_music_title = {}

    artists_key = [i[0] for i in sorted(artists.iteritems(), key=lambda (k,v): v,reverse=True)]

    for i in j:
        dd = int(i['date'][:4])
        if dd == year:
            code = i['artist_id']

            if i['rank'] > MAX_RANK:
                continue
            if i['artist'] == u'Various Artists':
                continue

            try:
                new_code = artists_key.index(code)
            except:
                continue

            date = dates.index(int(i['date']))
            new_music_title[new_code] = [code, artist[code] ]

            tmp = y1[new_code][date]

            if tmp == 0:
                y1[new_code][date] = int(i['rank'])
            else:
                if (int(i['rank']) > tmp):
                    pass

            if y1[new_code][date]:
                pass
                #print y1[new_code][date] 

    ans = {'musics' : new_music_title,
            'y1' : y1.tolist() }

    with open('artist-%s.json' % (year),'w') as f:
        json.dump(ans, f)
