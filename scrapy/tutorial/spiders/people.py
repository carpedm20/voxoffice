__author__ = 'carpedm20'
__date__ = '2014.07.25'

from scrapy.spider import BaseSpider

# http://movie.naver.com/movie/sdb/rank/rmovie.nhn?sel=cnt&date=20050207&tg=0

from scrapy.item import Item, Field

class Movie(Item):
    name = Field()
    url = Field()
    rank = Field()
    date = Field()

#tgs = range(20)
#tgs.remove(9)

def make_urls():
    #url = "http://movie.naver.com/movie/sdb/rank/rmovie.nhn?sel=cnt&date=%s&tg=%s"
    url = "http://movie.naver.com/movie/sdb/rank/rpeople.nhn?date=%s"
    urls = []

    from datetime import date, timedelta

    current_date = date(2005, 2, 7)
    end_date = date.today()
    delta = timedelta(days=1)

    while current_date <= end_date:
        urls.append(url % (current_date.strftime("%Y%m%d")))
        current_date += delta

    print "[*] length of urls : %s" % len(urls)

    return urls

import urlparse

class RankSpider(BaseSpider):
    name = "people"
    allowed_domains = ["movie.naver.com"]
    start_urls = None

    def __init__(self):
        self.start_urls = make_urls()

    def parse(self, response):
        parsed = urlparse.urlparse(response.url)
        date = urlparse.parse_qs(parsed.query)['date']

        items = []

        hrefs = response.xpath("//tbody/tr/td[@class='title']/a/@href").extract()
        titles = response.xpath("//tbody/tr/td[@class='title']/a/text()").extract()

        for index, href in enumerate(hrefs):
            movie = Movie()
            movie['url'] = href
            movie['name'] = titles[index]
            movie['rank'] = index + 1
            movie['date'] = date[0]
            items.append(movie)

        return items
