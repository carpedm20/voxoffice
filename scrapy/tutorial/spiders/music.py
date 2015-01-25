__author__ = 'carpedm20'
__date__ = '2014.07.25'

from scrapy.spider import BaseSpider

# http://music.naver.com/listen/history/index.nhn?type=TOTAL&year=2008&month=01&week=3

from scrapy.item import Item, Field

class Music(Item):
    name = Field()
    artist = Field()
    artist_id = Field()
    track_id = Field()
    album_id = Field()
    rank = Field()
    date = Field()

#tgs = range(20)
#tgs.remove(9)

def make_urls(mode = "TOTAL"):
    # mode = TOTAL, DOMESTIC, OVERSEA
    base = "http://music.naver.com/listen/history/index.nhn?type=%s&year=%s&month=%s&week=%s"
    urls = []

    for year in xrange(2008, 2014):
        for month in xrange(1, 13):
            for week in xrange(1,5):
                url = base % (mode, year, month, week)

                urls.append(url)

    print "[*] length of urls : %s" % len(urls)

    return urls

import re
import urlparse

class RankSpider(BaseSpider):
    name = "music"
    allowed_domains = ["movie.naver.com"]
    start_urls = None

    def __init__(self, mode="TOTAL"):
        self.start_urls = make_urls(mode)

    def parse(self, response):
        parsed = urlparse.urlparse(response.url)
        dic = urlparse.parse_qs(parsed.query)

        date = dic['year'][0] + dic['month'][0] + dic['week'][0]

        items = []

        hrefs = response.xpath("//tbody/tr/td[@class='title']/a/@href").extract()
        titles = response.xpath("//tbody/tr/td[@class='name']//span[@class='ellipsis']/text()").extract()

        for idx, elem in enumerate(response.xpath("//tbody/tr")[1:]):
            music = elem.xpath("./td[@class='name']")

            href = music.xpath("./a/@href")[0].extract()
            album_id = int(re.findall(r'\d+',href)[0])

            href = music.xpath("./a/@href")[-1].extract()
            track_id = int(re.findall(r'\d+',href)[0])

            artist = elem.xpath("./td[@class='_artist artist']")

            if len(artist) == 0:
                artist = elem.xpath("./td[@class='_artist artist no_ell2']")
                artist_id = -1

                artist_name = artist.xpath("./a/text()")[0].extract()
            else:
                try:
                    href = artist.xpath("./a/@href")[0].extract()
                    artist_id = int(href[href.find('artistId=')+9:])

                    artist_name = artist.xpath("./a/span/text()")[0].extract().strip()
                except:
                    artist_name = artist.xpath("./span/span/text()")[0].extract().strip()
                    artist_id = -1

            try:
                music_name = music.xpath("./a/span/text()")[0].extract()
            except:
                music_name = music.xpath("./span/span/text()")[0].extract()
            #print idx

            music= Music()
            music['name'] = music_name
            music['artist'] = artist_name
            music['artist_id'] = artist_id
            music['track_id'] = track_id
            music['album_id'] = album_id
            music['rank'] = idx + 1
            music['date'] = date

            items.append(music)

        return items
