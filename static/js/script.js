(function() {
  var w = 650;
  var h = 480;

  var data = [{year: 2006, books: 54},
            {year: 2007, books: 43},
            {year: 2008, books: 41},
            {year: 2009, books: 44},
            {year: 2010, books: 35}];

  var barWidth = 40;
  var width = (barWidth + 10) * data.length;
  var height = 200;

  var x = d3.scale.linear().domain([0, data.length]).range([0, width]);
  var y = d3.scale.linear().domain([0, d3.max(data, function(d) { return d.books; })]).rangeRound([0, height]);

  var barDemo = d3.select("#FoxOffice").
    append("svg:svg").
    attr("width", width).
    attr("height", height);

  barDemo.selectAll("rect").
    data(data).
    enter().
    append("rect").
    attr("x", function(d, i) { return x(i); }).
    attr("y", function(d) { return height - y(d.books); }).
    attr("height", function(d) { return y(d.books); }).
    attr("width", barWidth).
    attr("fill", "#2d578b");

  barDemo.selectAll("text").
    data(data).
    enter().
    append("svg:text").
    attr("x", function(d, i) { return x(i); }).
    attr("y", function(d) { return height - y(d.books); }).
    attr("dx", +barWidth/2).
    attr("dy", "1.2em").
    attr("text-anchor", "middle").
    text(function(d) { return d.books; }).
    attr("fill", "white");

  barDemo.selectAll("text.yAxis").
    data(data).
    enter().append("svg:text").
    attr("x", function(d, i) { return x(i); }).
    attr("y", height).
    attr("dx", +barWidth/2).
    attr("text-anchor", "middle").
    attr("style", "font-size: 12px; font-family: Helvetica, sans-serif").
    text(function(d) { return d.year; }).
    attr("transform", "translate(0, 18)").
    attr("class", "yAxis").attr("fill", "black");

  var data = d3.json("/static/data/data.json", function(error, root) {
  });
})();
