from scrapy.spider import BaseSpider
from scrapy.selector import HtmlXPathSelector
from scrapy.item import Item, Field
 
class Movie(Item):
    name = Field()
    url = Field()
    rank = Field()

# http://movie.naver.com/movie/sdb/rank/rmovie.nhn?sel=cnt&date=20050207&tg=0

tgs = range(20)
tgs.remove(9)

url = "http://movie.naver.com/movie/sdb/rank/rmovie.nhn?sel=cnt&date=%s&tg=%s"
urls = []

from datetime import date

current_date = date(2005, 2, 7)
end_date = date.today()

while current_date <= end_date:
    for tg in tgs:
        urls.append(url % (current_date.strftime("%Y%m%d"), tg))

print "[*] length of urls : %s" % len(urls)
 
class RankSpider(BaseSpider):
    name = "rank"
    allowed_domains = ["movie.naver.com"]
    start_urls = urls
 
    def parse(self, response):
        hxs = HtmlXPathSelector(response)
        items = []
 
        movies = hxs.select('//ul[@class="directory-url"]/li') 
 
        for movie in movies:
            
             
        return items
