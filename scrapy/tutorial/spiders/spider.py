__author__ = 'carpedm20'
__date__ = '2014.07.25'

from scrapy.spider import BaseSpider
from scrapy.selector import HtmlXPathSelector

# http://movie.naver.com/movie/sdb/rank/rmovie.nhn?sel=cnt&date=20050207&tg=0

from scrapy.item import Item, Field

class Movie(Item):
    name = Field()
    url = Field()
    rank = Field()

#tgs = range(20)
#tgs.remove(9)

def make_urls(tg):
    url = "http://movie.naver.com/movie/sdb/rank/rmovie.nhn?sel=cnt&date=%s&tg=%s"
    urls = []

    from datetime import date, timedelta

    current_date = date(2005, 2, 7)
    end_date = date.today()
    delta = timedelta(days=1)

    while current_date <= end_date:
        urls.append(url % (current_date.strftime("%Y%m%d"), tg))
        current_date += delta

    print "[*] length of urls : %s" % len(urls)

    return urls

class RankSpider(BaseSpider):
    name = "rank"
    allowed_domains = ["movie.naver.com"]
    start_urls = None

    def __init__(self, tg='0'):
        self.tg = tg
        self.start_urls = make_urls(self.tg)

    def parse(self, response):
        hxs = HtmlXPathSelector(response)
        items = []

        hrefs = hxs.xpath("//tbody/tr/td/div/a/@href").extract()
        titles = hxs.xpath("//tbody/tr/td/div/a/text()").extract()

        for index, href in enumerate(hrefs):
            movie = Movie()
            movie['url'] = href
            movie['name'] = titles[index]
            movie['rank'] = index + 1
            items.append(movie)

        return items
