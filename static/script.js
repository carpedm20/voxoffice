var vertical = false;

var format = d3.time.format("%Y%m%d");

var margin = {top: 10, right: 10, bottom: 100, left: 40},
    margin2 = {top: 430, right: 10, bottom: 20, left: 40},
    width = $("#foxoffice").parent().width() - margin.left - margin.right - 30,
    height = 600 - margin.top - margin.bottom,
    height2 = 600 - margin2.top - margin2.bottom;

var svg = d3.select("#foxoffice").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

//var long = 2400 - m[1] - m[3], short = 760 - m[0] - m[2];

if (vertical) {
    var width = height, height = width;
    var x = d3.scale.linear().range([0, height]),
        y = d3.scale.linear().range([width, 0]);
} else {
    var x = d3.scale.linear().range([width, 0]),
        x2 = d3.scale.linear().range([width, 0]),
        y = d3.scale.linear().range([0, height]);
        y2 = d3.scale.linear().range([0, 1]);
}

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");

var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);

var color = d3.scale.linear()
    .range(["#045A8D", "#F1EEF6"]);

var context_color = "#E34A33";
var context_idx = 0;

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

var area2 = d3.svg.area()
    .x(function(d) { return x2(d.x); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); });

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

var layers = [];

d3.json("./static/new.json", function(error, data) {
    mindate = format.parse(data['mindate']);
    maxdate = format.parse(data['maxdate']);
    y1 = data['y1'];

    for (var idx in y1) {
        for (var jdx in y1[idx]) {
            if (typeof layers[idx] == 'undefined') {
                layers[idx] = {key:data['movies'][idx], idx: idx,values:[]};
            }
            tmp = y1[idx][jdx];
            tmp = 1.0/tmp == Infinity ? 0 : 1.0/tmp;
            layers[idx].values.push({//key:data['movies'][idx],
                                     x: Number(jdx),
                                     y: tmp});
        }
    }

    layers = stack(layers);

    var n = layers.length,
        m = ((maxdate-mindate)/(1000*60*60*24));

    x.domain([0, m - 1]);
    x2.domain([0, m - 1]);
    y.domain([0,5.5]);
    y2.domain([0, d3.max(layers[0].values, function(value) { return value.y;})]);
    color.domain([0, layers.length]);

    var path = focus.selectAll(".layer")
        .data(layers)
        .enter().append("path")
        .attr("class", "layer")
        .attr("d", function(d) { return area(d.values); })
        .style("fill", function(d) {
            if (d.idx == context_idx)
                return context_color;
            else
                return color(d.idx);
        });

    focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    update_context(0);

    context.append("g")
        .attr("class", "x brush")
        .call(brush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);

    svg.selectAll(".layer")
        .attr("opacity", 1)
        .on("mouseover", function(d, i) {
            svg.selectAll(".layer").transition()
                .duration(250)
                .attr("opacity", function(d, j) {
                    return j != i ? 0.6 : 1;
                })
        })
        .on("click", function(d, i) {
            update_context(d.idx);
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

function update_context(idx) {
    var path = context.select("path");

    if (path[0][0] == null)
        path = context.append("path");
    
    path.datum(layers[idx])
        .attr("class", "area")
        .attr("d", function(d) { return area2(d.values); })
        .style("fill", function(d) { return context_color; });

    context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    focus.selectAll("path")
        .style("fill", function(d) {
            if (d.idx == idx)
                return context_color;
            else
                return color(d.idx);
        });
}


function brushed() {
    x.domain(brush.empty() ? x2.domain() : brush.extent());
    focus.selectAll("path").attr("d", function(d) { return area(d.values); });
    focus.select(".x.axis").call(xAxis);
}

function type(d) {
  d.date = parseDate(d.date);
  d.price = +d.price;
  return d;
}

