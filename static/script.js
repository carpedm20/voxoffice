current_section = 3;
global_type = 'wiggle';

window.onresize = function(event) {
    $("#sticker").css('width', $("#base").width()+20);
    $("#sticker").css('height', $(".section").height());

    $("#sticker").sticky({
        topSpacing : 100,
        bottomSpacing: document.getElementById('footer').scrollHeight + 10,
    });

    /*$("svg").each(function() {
        var width = $(this).width();
        
        array = this.getAttribute("viewBox").match(/\d+/g);
        array[2] = width;
        this.setAttribute("viewBox",array.join(" "));
    });*/
};

var move_to = function(id) {
    $('html,body').animate({scrollTop: $(id).offset().top});
};

$(document).ready(function() {
    $("#fullpage").fullpage({
        autoScrolling: false,
        onLeave: function(index, nextIndex, direction){
            current_section = nextIndex;

            if (nextIndex % 2 == 1) {
                var chart = charts[Math.floor(nextIndex/2)-1];
            } else {
                var chart = charts2[nextIndex/2-2];
            }

            if (global_type == 'zero' && chart.type == 'wiggle') {
                chart.zero_transition();
            } else if (global_type == 'wiggle' && chart.type == 'zero') {
                chart.wiggle_transition();
            }

            idx = chart.get_idx();
            $("#title").text(chart.get_layer()[idx].title);
            
            var node = chart.get_layer()[idx];

            if (node.type == 0)
                $("#naver-link").attr("href", "http://movie.naver.com/movie/bi/mi/basic.nhn?code="+node.code);
            else
                $("#naver-link").attr("href", "http://movie.naver.com/movie/bi/pi/basic.nhn?code="+node.code);
            $("#poster").attr('src', chart.get_layer()[idx].url);
        }
    });

    $(".dropdown-button").dropdown();

    $("a.genre").click(function() {
        genre = $(this).attr('id');

        $("a.genre").removeClass('teal');
        $(this).addClass('teal');

        charts = [];
        $(".foxoffice").each(function() {
            $(this).html('<div class="row center loading" width="1085" height="620"><div class="preloader-wrapper big active"> <div class="spinner-layer spinner-blue"> <div class="circle-clipper left"> <div class="circle"></div> </div><div class="gap-patch"> <div class="circle"></div> </div><div class="circle-clipper right"> <div class="circle"></div> </div> </div> </div>'); 
        });

        $(".foxoffice").each(function() {
            year = $(this).attr('id');
            chart = new Chart(year, 'foxoffice', genre);
            chart.get_json();
            charts.push(chart);
        });
    });

    $("a.theme").click(function() {
        color = $(this).attr('id');

        if (color == "cyan") {
            color1 = "#006064",
            color2 = "#e0f7fa";
        } else if (color == "default") {
            color1 = "#045A8D",
            color2 = "#F1EEF6";
        } else if (color == "bg") {
            color1 = "#263238",
            color2 = "#eceff1";
        } else if (color == "teal") {
            color1 = "#004d40",
            color2 = "#e0f2f1";
        }
        for (var idx in charts) {
            chart = charts[idx];
            chart.update_color(color1, color2);
        }
        for (var idx in charts2) {
            chart = charts2[idx];
            chart.update_color(color1, color2);
        }
    });

    $("#sticker").sticky({
        topSpacing : 100,
        bottomSpacing: document.getElementById('footer').scrollHeight + 10,
    });

    $("#sticker").css('width', $("#base").width()+20);
    $("#sticker").css('height', $(".section").height());

    $('#graph-style input:radio').change( function(){
        console.log(current_section);

        if (current_section % 2 == 1) {
            var chart = charts[Math.floor(current_section/2)-1];
        } else {
            var chart = charts2[current_section/2-2];
        }

        var type = $(this).attr('id');

        if (type == 'test1') {
            chart.wiggle_transition();
            global_type = 'wiggle';
        } else if (type == 'test2') {
            chart.zero_transition();
            global_type = 'zero';
        }
    });
});

var format = d3.time.format("%Y%m%d");
var format2 = d3.time.format("%b");

var charts = [];
var charts2 = [];

zero_stack = d3.layout.stack()
    .offset("zero")
    //.offset("silhouette")
    .values(function(d) { return d.values; })
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

wiggle_stack = d3.layout.stack()
    .offset("wiggle")
    //.offset("silhouette")
    .values(function(d) { return d.values; })
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

var Chart = function(year, class_name, genre) {
    var class_name = class_name;
    var year = year;
    var cidx;

    var margin = {top: 10, right: 10, bottom: 100, left: 20},
        margin2 = {top: 600, right: 10, bottom: 20, left: 20},
        width = $("."+class_name).parent().width() - margin.left - margin.right - 3,
        height = 680 - margin.top - margin.bottom,
        height2 = 680 - margin2.top - margin2.bottom;

    var svg, context, focus;

    var x = d3.scale.linear().range([0, width]),
        x2 = d3.scale.linear().range([0, width]),
        y = d3.scale.linear().range([height, 0]),
        y2 = d3.scale.linear().range([height2, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom")
        .ticks(3, function(d, i) {}),
        xAxis2 = d3.svg.axis().scale(x2).orient("bottom")
        .ticks(12, function(d, i) {});

    var brush = d3.svg.brush()
        .x(x2)
        .on("brush", brushed);

    function brushed() {
        x.domain(brush.empty() ? x2.domain() : brush.extent());
        focus.select(".x.axis").call(xAxis);
        focus.selectAll(".layer").attr("d", function(d) { return area(d.values); });
    };

    var color = d3.scale.linear()
        .range(["#045A8D", "#F1EEF6"]);

    var context_color = "#FC8D59";
    var context_idx = 0;

    this.get_idx = function() {
        return context_idx;
    }

    var area = d3.svg.area()
        //.interpolate("basis")
        .x(function(d) { return x(d.x); })
        .y0(function(d) { return y(d.y0); })
        .y1(function(d) { return y(d.y0 + d.y); });

    var area2 = d3.svg.area()
        .x(function(d) { return x2(d.x); })
        .y0(height2)
        .y1(function(d) { return y2(d.y); });

    /*var vertical_line = d3.select("#"+year).append("div")
        .attr("class", "remove")
        .style("position", "absolute")
        .style("z-index", "19")
        .style("width", "1px")
        .style("height", height+"px")
        .style("top", margin.top+"px")
        .style("bottom", margin.bottom+"px")
        .style("left", "0px")
        .style("background", "rgba(255,255,255,0.5)");*/

    var tooltip = d3.select("#"+year)
        .append("div")
        .attr("class", "remove")
        .style("position", "absolute")
        .style("z-index", "20")
        .style("visibility", "hidden")
        .style("top", "20px")
        .style("left", "75px");

    this.genre = genre;

    var get_year = function() {
        return year.match(/\d+/g)[0];
    }

    this.get_json = function() {
        year_number = year.match(/\d+/g)[0];
        d3.json("./static/"+this.genre+"-"+year_number+".json", this.process);
    };

    this.change_genre = function(genre) {
        this.genre = genre;
        year_number = year.match(/\d+/g)[0];
        d3.json("./static/"+this.genre+"-"+year_number+".json", this.process_update);
    };

    var layers = [];
    var layers0 = [];

    this.get_layer = function() {
        return layers;
    }

    this.type = 'wiggle';

    this.zero_transition = function() {
        this.type = 'zero';
        zer = zero_stack(layers);
        y.domain([0, d3.max(zer, function(layer) { return d3.max(layer.values, function(d) { return  d.y0 + d.y; }); })+0.5]);
        focus.selectAll(".layer")
            .data(function() {
                return zer;
            })
            .transition()
            .duration(2500)
            .attr("d", function(d) { return area(d.values); });
    }

    this.wiggle_transition = function() {
        this.type = 'wiggle';
        wig = wiggle_stack(layers);
        y.domain([0, d3.max(wig, function(layer) { return d3.max(layer.values, function(d) { return  d.y0 + d.y; }); })]);
        focus.selectAll(".layer")
            .data(function() {
                return wig;
            })
            .transition()
            .duration(2500)
            .attr("d", function(d) { return area(d.values); });
    }

    this.transition = function() {
        focus.selectAll(".layer")
            .data(function() {
                d = layers0;
                layers0 = layers;
                return layers = d;
            })
            .transition()
            .duration(2500)
            .attr("d", function(d) { return area(d.values); });
    }

    this.update_color = function(color1, color2) {
        color = d3.scale.linear()
            .range([color1, color2]);

        color.domain([0, layers.length]);

        focus.selectAll("path")
            .style("fill", function(d) {
                if (d.idx == context_idx)
                    return context_color;
                else
                    return color(d.idx);
            });
    };

    var update_context = function(idx) {
        context_idx = idx;

        path = context.select("path");

        y2.domain([0, d3.max(layers[context_idx].values, function(value) {
            return value.y;
        })]);

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
    };

    var clicked_idx = 0;

    this.process = function(error, data) {
        d3.select("#"+year).html('');

        var big_width = width + margin.left + margin.right,
            big_height = height + margin.top + margin.bottom;

        svg = d3.select("#"+year).append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 "+big_width+" "+big_height)
            .attr("width", "100%")
            //.attr("width", big_width)
            .attr("height", big_height);

        context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

        focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        mindate = format.parse(data['mindate']);
        maxdate = format.parse(data['maxdate']);
        skipdate = 5;
        y1 = data['y1'];

        xAxis.tickFormat(function(d) {
            date = new Date(mindate);
            date.setDate(mindate.getDate() + d*skipdate);
            return format2(date);
        });

        xAxis2.tickFormat(function(d) {
            date = new Date(mindate);
            date.setDate(mindate.getDate() + d*skipdate);
            return format2(date);
        });

        if (class_name == 'people')
            nocde_type = 1;
        else
            node_type= 0;

        for (var idx in y1) {
            for (var jdx in y1[idx]) {
                if (typeof layers[idx] == 'undefined') {
                    a =  data['movies'][idx][1];
                    layers[idx] = {title : data['movies'][idx][2],
                                   url : data['movies'][idx][1][0],
                                   code : data['movies'][idx][0],
                                   type : node_type,
                                   idx : idx,values:[]};
                    layers0[idx] = {title : data['movies'][idx][1],
                                    code : data['movies'][idx][0],
                                    type : node_type,
                                    idx : idx,values:[]};
                }
                tmp = y1[idx][jdx];
                tmp = 1.0/tmp == Infinity ? 0 : 1.0/tmp;
                layers[idx].values.push({title:data['movies'][idx][1],
                                        x: Number(jdx),
                                        y: tmp});
                layers0[idx].values.push({title:data['movies'][idx][1],
                                        x: Number(jdx),
                                        y: 0});
            }
        }

        var n = layers.length;

        x.domain([0, d3.max(wiggle_stack(layers), function(layer) { return d3.max(layer.values, function(d) { return  d.x; }); })]);
        x2.domain([0, d3.max(wiggle_stack(layers), function(layer) { return d3.max(layer.values, function(d) { return  d.x; }); })]);
        y.domain([0, d3.max(wiggle_stack(layers), function(layer) { return d3.max(layer.values, function(d) { return  d.y0 + d.y; }); })]);

        color.domain([0, layers.length]);

        focus.selectAll(".layer")
            .data(wiggle_stack(layers))
            .enter().append("path")
            .attr("class", "layer")
            .attr("d", function(d) { return area(d.values); })
            .style("fill", function(d) {
                if (d.idx == context_idx)
                    return context_color;
                else
                    return color(d.idx);
            })
            .append("title")
            .text(function (d,i) { return d.title; });

        focus.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        update_context(clicked_idx);

        context.append("g")
            .attr("class", "x brush")
            .call(brush)
        .selectAll("rect")
            .attr("y", -6)
            .attr("height", height2 + 7);

        svg.selectAll(".layer")
            .attr("opacity", 1)
            .on("dblclick", function(d, i) {
                var win = window.open($("#naver-link").attr('href'), '_blank');
                win.focus();
            })
            .on("mouseover", function(d, i) {
                change_poster_specific(d.title, d.code, d.url);
                /*svg.selectAll(".layer")
                    .attr("opacity", function(d, j) {
                        return j != i ? 0.8 : 1;
                    })

                mousex = d3.mouse(this);
                mousex = mousex[0] + 15;
                vertical_line.style("left", mousex + "px");*/
            })
            .on("mousemove", function(d, i){
                /*mousex = d3.mouse(this);
                mousex = mousex[0] + 15;
                vertical_line.style("left", mousex + "px" );

                current_x = Math.floor(x.invert(d3.mouse(this)[0]));
                var list = [];

                for (var idx in layers) {
                    layer = layers[idx];

                    list.push(layer.values[current_x]);
                }

                var sorted = list.sort(function (a,b) { return (b.y > a.y); });

                body = ''

                for (var idx in [0,1,2,3,4]) {
                    body += sorted[idx].title[1] + '<br>';
                }

                html =  "<p>" + body + "</p>";
                tooltip.html(html).style("visibility", "visible");*/
            })
            .on("click", function(d, i) {
                clicked_idx = d.idx;

                update_context(d.idx);
                change_poster();

                cidx = get_cidx();

                if (class_name == 'people')
                    charts_to_find = charts2;
                else
                    charts_to_find = charts;

                for (var idx in charts_to_find) {
                    if (idx != cidx) {
                        chart = charts_to_find[idx];
                        result = chart.find_code(d.code);
                    }
                }
            })
            .on("mouseout", function(d, i) {
                svg.selectAll(".layer")
                    .attr("opacity", "1");
                d3.select(this)
                    .classed("hover", false)
                    .attr("stroke-width", "0px");

                update_context(clicked_idx);
                change_poster();

                /*html =  "<p>" + d.title + "<br>" + d.code + "</p>";
                tooltip.html(html).style("visibility", "hidden");*/
            });
        change_poster();
    };

    var get_cidx = function() {
        return cidx;
    }

    this.set_cidx = function(idx) {
        cidx = idx;
    }

    this.find_code = function(code) {
        for (var idx in layers) {
            layer = layers[idx];

            if (layer.code == code) {
                var year = get_year();

                if (class_name == 'people')
                    var id = "#peo-" + year;
                else
                    var id = "#mov-" + year;

                toast("<a class='year-toast orange-text'; href='javascript:void(0);' onclick='move_to(\"" + id + "\")'>" + layer.title + " found in " + year + "</a>", 4000);

                clicked_idx = layer.idx;
                update_context(layer.idx);
            }
        }
    }

    var change_poster = function() {
        $("#title").text(layers[context_idx].title);
        if (layers[context_idx].type == 0)
            $("#naver-link").attr('href', "http://movie.naver.com/movie/bi/mi/basic.nhn?code="+layers[context_idx].code);
        else
            $("#naver-link").attr('href', "http://movie.naver.com/movie/bi/pi/basic.nhn?code="+layers[context_idx].code);
        $("#poster").attr('src', layers[context_idx].url);
    }

    var change_poster_specific = function(title, code, url) {
        $("#title").text(title);
        if (class_name == 'people')
            $("#naver-link").attr('href', "http://movie.naver.com/movie/bi/pi/basic.nhn?code="+code);
        else
            $("#naver-link").attr('href', "http://movie.naver.com/movie/bi/mi/basic.nhn?code="+code);
        $("#poster").attr('src', url);
    }
};

$(".foxoffice").each(function() {
    year = $(this).attr('id');

    chart = new Chart(year, 'foxoffice', 'all');
    chart.set_cidx(charts.length);
    chart.get_json();
    charts.push(chart);
});

$(".people").each(function() {
    year = $(this).attr('id');

    chart = new Chart(year, 'people', 'people');
    chart.get_json();
    chart.set_cidx(charts2.length);
    charts2.push(chart);
});
