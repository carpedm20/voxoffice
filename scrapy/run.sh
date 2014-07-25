#!/bin/bash
for i in 0 1 2 3 4 5 6 7 8 10 11 12 13 14 15 16 17 18 19
do
    scrapy crawl rank -a tg=$i -o movie$i.json
done
