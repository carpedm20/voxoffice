(function() {
  var w = 650;
  var h = 480;

  var data = d3.json("/static/data/data.json", function(error, root) {
    var bodySelection = d3.select("#FoxOffice");

    var svgSelection = bodySelection.append("svg")
         .attr("width", w)
         .attr("height", h).style("border", "1px solid black");

    var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
                    11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

    bodySelection.selectAll("rect").data(dataset).enter().append("rect")
                .attr("x", function (d, i) { return i*21; })
                .attr("y", 0)
                .attr("width", 20)
                .attr("height", function (d) { return d*4; }).style("fill", "black");

    /*var d = [1,2,3];
    var p = bodySelection.selectAll("p").data(d).enter().append("p")
              .text(function(d) { return "Data: " + d; });

    console.log(p);

    var r = [40, 20, 10];

    var c = svgSelection.selectAll("p").data(r).enter().append("circle");

    var cAttributes = c.attr("cx", w/2)
                       .attr("cy", h/2)
                       .attr("r", function(d) { return d; })
                       .style("fill", function(d) {
                         var returnColor;
                         if (d === 40)
                           returnColor = "green";
                         else if (d === 20)
                           returnColor = "purple";
                         else if (d === 10)
                           returnColor = "red";
                         return returnColor;
                       });

    var spaceCircles = [30, 70, 110];
    var circles = svgSelection.selectAll("ci")
                              .data(spaceCircles)
                              .enter()
                              .append("circle");

    var cAttributes = circles.attr("cx", function (d) { return d; })
                             .attr("cy", function (d) { return d; })
                             .attr("r", 20)
                             .style("fill", function(d) {
                                var returnColor;
                                if (d === 30)
                                  returnColor = "green";
                                else if (d === 70)
                                  returnColor = "purple";
                                else if (d === 110)
                                  returnColor = "red";
                                return returnColor;
                              });*/
  });
})();
