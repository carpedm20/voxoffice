var format = d3.time.format("%Y%m%d");

var width = 9960,
    height = 500;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.linear()
    .range(["#B30000", "#FEF0D9"]);

var stack = d3.layout.stack()
    .offset("silhouette")
    .values(function(d) { return d.values; })
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

var area = d3.svg.area()
    .interpolate("cardinal")
    .x(function(d) { return x(d.x); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); });

var svg = d3.select("#foxoffice").append("svg")
    .attr("width", width)
    .attr("height", height);

var layers;

d3.json("./static/new.json", function(error, data) {
    console.log("Start");

    mindate = format.parse(data['mindate']);
    maxdate = format.parse(data['maxdate']);

    movies = data['movies'].length;

    y0 = data['y0'];
    y1 = data['y1'];

    layers = [];

    for (var idx in y0)
        for (var jdx in y0[idx]) {
            if (typeof layers[idx] == 'undefined') {
                layers[idx] = {key:data['movies'][idx], values:[]};
            }
            layers[idx].values.push({key:data['movies'][idx],
                                     x: Number(jdx),
                                     y: y1[idx][jdx]});
        }

    layers = stack(layers);

    var n = layers.length,
        m = ((maxdate-mindate)/(1000*60*60*24));

    x.domain([0, m - 1]);
    y.domain([0,100]);

    svg.selectAll("path")
        .data(layers)
        .enter().append("path")
        .attr("d", function(d) { return area(d.values); })
        .append("title")
        .text(function(d) { return d.name; })
        .style("fill", function() { return color(Math.random()); });
});

