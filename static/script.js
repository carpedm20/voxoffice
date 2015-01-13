var width = 800,
    height = 1500,
    padding = 40;

var tooltip = d3.select("body")
    .append("div")
    .attr("class", "remove")
    .style("position", "absolute")
    .style("z-index", "20")
    .style("visibility", "hidden")
    .style("top", "30px")
    .style("left", "55px");

var svg = d3.select("#foxoffice").append("svg:svg")
    .attr("width", width)
    .attr("height", height);

var data = [{"url": "/movie/bi/mi/basic.nhn?code=39470", "date": "20050208", "name": "\uc81c\ub2c8, \uc8fc\ub178", "rank": 1},
            {"url": "/movie/bi/mi/basic.nhn?code=39436", "date": "20050208", "name": "\ub9d0\uc544\ud1a4", "rank": 2},
            {"url": "/movie/bi/mi/basic.nhn?code=39510", "date": "20050208", "name": "B\ud615 \ub0a8\uc790\uce5c\uad6c", "rank": 3},
            {"url": "/movie/bi/mi/basic.nhn?code=39723", "date": "20050209", "name": "\ud074\ub85c\uc800", "rank": 1},
            {"url": "/movie/bi/mi/basic.nhn?code=39708", "date": "20050209", "name": "\ucf58\uc2a4\ud0c4\ud2f4", "rank": 2},
            {"url": "/movie/bi/mi/basic.nhn?code=39801", "date": "20050209", "name": "\uadf8\ub54c \uadf8\uc0ac\ub78c\ub4e4", "rank": 3},
            {"url": "/movie/bi/mi/basic.nhn?code=39482", "date": "20050210", "name": "\uacf5\uacf5\uc758 \uc801 2", "rank": 1},
            {"url": "/movie/bi/mi/basic.nhn?code=38766", "date": "20050210", "name": "\uce5c\uc808\ud55c \uae08\uc790\uc528", "rank": 2}
];

//var data = d3.json("./static/movie0.json", function(error, data) {
    movie = data;

    var format = d3.time.format("%Y%m%d").parse;

    var mindate = format(data[0]['date']),
        maxdate = format(data[data.length-1]['date']);

    var x = d3.time.scale()
        .domain([mindate, maxdate])
        .range([padding, width - padding * 2]); 

    var y = d3.scale.linear()
        .domain([0, 100])
        .range([height - padding, padding]); 

    var colorrange = ["#045A8D", "#2B8CBE", "#74A9CF", "#A6BDDB", "#D0D1E6", "#F1EEF6"];
    var z = d3.scale.ordinal()
        .range(colorrange);


    var xAxis = d3.svg.axis()
        .scale(x)
        .ticks(d3.time.weeks);

    var yAxis = d3.svg.axis()
        .scale(y);

    var area = d3.svg.area()
        .y(function(d) { return x(d.x); })
        .x0(function(d) { return y(null); })
        .x1(function(d) { return y(d.y0 + d.y); });

    svg.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate("+padding+",0)")
        .call(yAxis);

    svg.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis);
//});
