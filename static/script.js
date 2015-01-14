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

var data = [{"url": "/movie/bi/mi/basic.nhn?code=39470", "date": "20050208", "name": "\uc81c\ub2c8, \uc8fc\ub178", "rank": 1},
            {"url": "/movie/bi/mi/basic.nhn?code=39436", "date": "20050208", "name": "\ub9d0\uc544\ud1a4", "rank": 2},
            {"url": "/movie/bi/mi/basic.nhn?code=39510", "date": "20050208", "name": "B\ud615 \ub0a8\uc790\uce5c\uad6c", "rank": 3},
            {"url": "/movie/bi/mi/basic.nhn?code=39723", "date": "20050209", "name": "\ud074\ub85c\uc800", "rank": 1},
            {"url": "/movie/bi/mi/basic.nhn?code=39708", "date": "20050209", "name": "\ucf58\uc2a4\ud0c4\ud2f4", "rank": 2},
            {"url": "/movie/bi/mi/basic.nhn?code=39801", "date": "20050209", "name": "\uadf8\ub54c \uadf8\uc0ac\ub78c\ub4e4", "rank": 3},
            {"url": "/movie/bi/mi/basic.nhn?code=39482", "date": "20050210", "name": "\uacf5\uacf5\uc758 \uc801 2", "rank": 1},
            {"url": "/movie/bi/mi/basic.nhn?code=38766", "date": "20050210", "name": "\uce5c\uc808\ud55c \uae08\uc790\uc528", "rank": 2}
];

var array;

d3.json("./static/new.json", function(error, data) {
    console.log("Start");
    dates = data['dates'];
    movies = data['movies'];

    d = data['data'];

    for (var idx in d)
        for (var jdx in d[idx])
            d[idx][jdx] = {x: Number(jdx), y: d[idx][jdx]};

    array = d;
    console.log("End");

    var n = array.length,
        m = array[0].length,
        stack = d3.layout.stack().offset("wiggle"),
        layers0 = array;

    var width = 960,
        height = 500;

    var x = d3.scale.linear()
        .domain([0, m - 1])
        .range([0, width]);

    var y = d3.scale.linear()
        //.domain([0, d3.max(layer0, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); })])
        .domain([0,10])
        .range([height, 0]);

    var color = d3.scale.linear()
        .range(["#aad", "#556"]);

    var area = d3.svg.area()
        .x(function(d) { return x(d.x); })
        //.y0(function(d) { return y(d.y0); })
        //.y1(function(d) { return y(d.y0 + d.y); });
        .y(function(d) { return y(d.y); });

    var svg = d3.select("#foxoffice").append("svg:svg")
        .attr("width", width)
        .attr("height", height);

    svg.selectAll("path")
        .data(layers0)
        .enter().append("path")
        .attr("d", area)
        .style("fill", function() { return color(Math.random()); });

});

function transition() {
  d3.selectAll("path")
      .data(function() {
        var d = layers1;
        layers1 = layers0;
        return layers0 = d;
      })
    .transition()
      .duration(2500)
      .attr("d", area);
}

function bumpLayer(n) {

  function bump(a) {
    var x = 1 / (.1 + Math.random()),
        y = 2 * Math.random() - .5,
        z = 10 / (.1 + Math.random());
    for (var i = 0; i < n; i++) {
      var w = (i / n - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }

  var a = [], i;
  for (i = 0; i < n; ++i) a[i] = 0;
  for (i = 0; i < 5; ++i) bump(a);
  return a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
}

//});
