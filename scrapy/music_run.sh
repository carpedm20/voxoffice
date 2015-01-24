#!/bin/bash
#mode = TOTAL, DOMESTIC, OVERSEA
scrapy crawl music -a mode=TOTAL -o music_total.json
scrapy crawl music -a mode=DOMESTIC -o music_domestic.json
scrapy crawl music -a mode=OVERSEA -o music_oversea.json 
