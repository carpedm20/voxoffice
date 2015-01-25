import json
import numpy as np
from bs4 import BeautifulSoup
import requests
from collections import defaultdict

MAX_RANK = 10

for chart_type in ['total', 'domestic', 'oversea']:
    print " ******** %s ********* " % chart_type

    j = json.loads(open('scrapy/music_%s.json' % chart_type).read())

    for year in xrange(2008, 2015):
        print year

        musics = defaultdict(int)
        dates = defaultdict(int)

        music_title = {}
        album_id = {}
        artist_id = {}
        track_id = {}

        start_year = '%s0101' % year
        end_year  = '%s1231' % year

        for i in j:
            dd = int(i['date'][:4])
            if dd == year:
                if i['rank'] > MAX_RANK:
                    continue
                code = i['track_id']
                musics[code] += 1
                music_title[code] = i['name']
                album_id[code] = i['album_id']
                artist_id[code] = i['artist_id']
                track_id[code] = i['track_id']
                dates[int(i['date'])] += 1

        musics_key = musics.keys()
        musics_key.sort()

        dates = dates.keys()
        dates.sort()

        print "Distinct musics : %s" % len(musics_key)
        print "Distinct dates : %s" % len(dates)

        y1 = np.zeros((len(musics_key),len(dates)), dtype='int16')

        new_music_title = {}

        musics_key = [i[0] for i in sorted(musics.iteritems(), key=lambda (k,v): v,reverse=True)]

        for i in j:
            dd = int(i['date'][:4])
            if dd == year:
                code = i['track_id']

                try:
                    new_code = musics_key.index(code)
                except:
                    continue

                date = dates.index(int(i['date']))
                new_music_title[new_code] = [code,
                                             music_title[code],
                                             album_id[code],
                                             artist_id[code],
                                             track_id[code],
                                             ]
                y1[new_code][date] = int(i['rank'])

        ans = {'musics' : new_music_title,
               'y1' : y1.tolist() }

        with open('%s-%s.json' % (chart_type, year),'w') as f:
            json.dump(ans, f)
