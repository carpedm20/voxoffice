(function() {
  var w = 650;
  var h = 480;

  var data = d3.json("/static/data/data.json", function(error, root) {
    var bodySelection = d3.select("#FoxOffice");

    var svgSelection = bodySelection.append("svg")
          .attr("width", w)
          .attr("height", h);
    var circleSelection = svgSelection.append("circle")
          .attr("cx", w/2)
          .attr("cy", h/2)
          .attr("r", 50)
          .style("fill", "purple");

  });
})();
