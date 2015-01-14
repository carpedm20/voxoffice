var vertical = false;

var format = d3.time.format("%Y%m%d");

var m = [80, 80, 80, 80]; // margins
var long = 2400 - m[1] - m[3], short = 760 - m[0] - m[2];

if (vertical) {
    var width = short, height = long;
    var x = d3.scale.linear().range([0, height]);
    var y = d3.scale.linear().range([width, 0]);
} else {
    var width = long, height = short;
    var y = d3.scale.linear().range([0, height]);
    var x = d3.scale.linear().range([width, 0]);
}

var color = d3.scale.linear()
    .range(["#045A8D", "#F1EEF6"]);

var stack = d3.layout.stack()
    .offset("wiggle")
    //.offset("silhouette")
    .values(function(d) { return d.values; })
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

if (vertical)
    var area = d3.svg.area()
        //.interpolate("basis")
        .y(function(d) { return x(d.x); })
        .x0(function(d) { return y(d.y0); })
        .x1(function(d) { return y(d.y0 + d.y); });
else
    var area = d3.svg.area()
        //.interpolate("basis")
        .x(function(d) { return x(d.x); })
        .y0(function(d) { return y(d.y0); })
        .y1(function(d) { return y(d.y0 + d.y); });

var svg = d3.select("#foxoffice").append("svg:svg")
    .attr("width", width + m[1] + m[3])
    .attr("height", height + m[0] + m[2])
    .append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

var layers;

d3.json("./static/new.json", function(error, data) {
    console.log("Start");

    mindate = format.parse(data['mindate']);
    maxdate = format.parse(data['maxdate']);

    movies = data['movies'].length;

    y1 = data['y1'];

    layers = [];

    for (var idx in y1)
        for (var jdx in y1[idx]) {
            if (typeof layers[idx] == 'undefined') {
                layers[idx] = {key:data['movies'][idx], idx: idx,values:[]};
            }
            tmp = y1[idx][jdx];
            tmp = 1.0/tmp == Infinity ? 0 : 1.0/tmp;
            layers[idx].values.push({key:data['movies'][idx],
                                     x: Number(jdx),
                                     y: tmp});
        }

    layers = stack(layers);

    var n = layers.length,
        m = ((maxdate-mindate)/(1000*60*60*24));

    x.domain([0, m - 1]);
    y.domain([0,5.5]);
    color.domain([0, layers.length]);

    g_size = 1

    var xAxis = d3.svg.axis().scale(x).tickSize(-height).tickSubdivide(true);
    svg.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
    svg.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(-25,0)")
        .call(yAxisLeft);

    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("id", "clip-rect")
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", width)
        .attr("height", height);

    var path = svg.selectAll(".layer")
        .data(layers)
        .enter().append("path")
        .attr("class", "layer")
        .attr("d", function(d) { return area(d.values); })
        .style("fill", function(d) { return color(d.idx); });

    var toolTip = svg.selectAll("path")
        .append("svg:title")
        .text(function(d) { 
            console.log(d.key);
            return (d.key);
        }
    );

    svg.selectAll(".layer")
        .attr("opacity", 1)
        .on("mouseover", function(d, i) {
            svg.selectAll(".layer").transition()
                .duration(250)
                .attr("opacity", function(d, j) {
                    return j != i ? 0.6 : 1;
                })
        })
        .on("mouseout", function(d, i) {
            svg.selectAll(".layer")
                .transition()
                .duration(250)
                .attr("opacity", "1");
            d3.select(this)
                .classed("hover", false)
                .attr("stroke-width", "0px");
        });
});

