window.mobilecheck = function() {
  var check = false;
  (function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

if (window.mobilecheck()) {
    alert("VoxMusic은 모바일 브라우저를 지원하지 않습니다");
}

progressJs().start();

current_section = 3;
global_type = 'wiggle';

window.onresize = function(event) {
    $("#sticker").css('width', $("#base").width()+20);
    $("#sticker").css('height', $(".section").height());

    $("#sticker").sticky({
        topSpacing : 100,
        bottomSpacing: document.getElementById('footer').scrollHeight + 10,
    });

    $("svg").each(function() {
        /*var width = $(this).width();
        
        array = this.getAttribute("viewBox").match(/\d+/g);
        array[2] = width;
        this.setAttribute("viewBox",array.join(" "));*/
    });
};

var move_to = function(id) {
    $('html,body').animate({scrollTop: $(id).offset().top - 40 - $("h2").height()});
};

$(document).ready(function() {
    $("#fullpage").fullpage({
        autoScrolling: false,
        onLeave: function(index, nextIndex, direction){
            current_section = nextIndex;
            console.log(current_section);

            if (current_section % 2 == 1) {
                var chart = charts2[Math.floor(current_section/2)-2];
            } else {
                var chart = charts[current_section/2-2];
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
                $("#naver-link").attr("href", "http://music.naver.com/music/bi/mi/basic.nhn?code="+node.code);
            else
                $("#naver-link").attr("href", "http://music.naver.com/music/bi/pi/basic.nhn?code="+node.code);
            $("#poster").attr('src', chart.get_layer()[idx].url);
        }
    });

    $("a.genre").click(function() {
        genre = $(this).attr('id');

        $("a.genre").removeClass('indigo');
        $(this).addClass('indigo');

        charts = [];
        $(".foxoffice").each(function() {
            $(this).html('<div class="row center loading" width="1085" height="620"><div class="preloader-wrapper big active"> <div class="spinner-layer spinner-blue"> <div class="circle-clipper left"> <div class="circle"></div> </div><div class="gap-patch"> <div class="circle"></div> </div><div class="circle-clipper right"> <div class="circle"></div> </div> </div> </div>'); 
        });

        update_music(genre, global_type);
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
        if (current_section % 2 == 1) {
            var chart = charts2[Math.floor(current_section/2)-2];
        } else {
            var chart = charts[current_section/2-2];
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

var Chart = function(year, class_name, genre, type) {
    var class_name = class_name;
    var year = year;
    var cidx;

    var height_base = $(window).height()*0.6;

    var margin = {top: 10, right: 10, bottom: 100, left: 20},
        margin2 = {top: height_base, right: 10, bottom: 20, left: 20},
        width = $("."+class_name).parent().width() - margin.left - margin.right - 3,
        height = height_base + 80 - margin.top - margin.bottom,
        height2 = height_base + 80 - margin2.top - margin2.bottom;

    var svg, context, focus;

    this.get_svg = function () {
        return svg;
    }

    var x = d3.scale.linear().range([0, width]),
        x2 = d3.scale.linear().range([0, width]),
        y = d3.scale.linear().range([height, 0]),
        y2 = d3.scale.linear().range([height2, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom")
        .ticks(3, function(d, i) {}),
        xAxis2 = d3.svg.axis().scale(x2).orient("bottom")
        .ticks(16, function(d, i) {});

    var brush = d3.svg.brush()
        .x(x2)
        .on("brush", brushed);

    function brushed() {
        x.domain(brush.empty() ? x2.domain() : brush.extent());
        focus.select(".x.axis").call(xAxis);
        focus.selectAll(".layer").attr("d", function(d) { return area(d.values); });
    };

    var color = d3.scale.linear()
        .range(["#3949ab", "#e8eaf6"]);

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

    this.download = false;

    this.get_json = function() {
        this.download = false;

        year_number = year.match(/\d+/g)[0];
        d3.json("/carpedm20/vox/static/"+this.genre+"-"+year_number+".json", this.process);
    };

    this.change_genre = function(genre) {
        this.genre = genre;
        year_number = year.match(/\d+/g)[0];
        d3.json("/carpedm20/vox/static/"+this.genre+"-"+year_number+".json", this.process_update);
    };

    var layers = [];
    var layers0 = [];

    this.get_layer = function() {
        return layers;
    }

    this.type = type;

    this.zero_transition = function() {
        this.type = 'zero';
        zer = zero_stack(layers);
        y.domain([0, d3.max(zer, function(layer) { return d3.max(layer.values, function(d) { return  d.y0 + d.y; }); })+1.5]);
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

        context.selectAll("g").remove();

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
            .attr("preserveAspectRatio", "xMinYMin")
            .attr("viewBox", "0 0 "+big_width+" "+big_height)
            .attr("width", "100%")
            //.attr("width", big_width)
            .attr("height", "80%");

        context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

        focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        mindate = format.parse(get_year()+'0101');
        maxdate = format.parse(get_year()+'1231');
        skipdate = 7;
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
            node_type = 1;
        else
            node_type= 0;

        for (var idx in y1) {
            for (var jdx in y1[idx]) {
                if (typeof layers[idx] == 'undefined') {
                    if (class_name == 'people') {
                        artist_code = data['musics'][idx][0].toString();
                    } else {
                        artist_code = data['musics'][idx][3].toString();
                    }

                    if (artist_code.length == 5)
                        a = "0"+artist_code.slice(0,2);
                    else if (artist_code.length == 4)
                        a = "00"+artist_code.slice(0,1);
                    else
                        a = artist_code.slice(0,3);

                    if (class_name == 'people') {
                        layers[idx] = {title: data['musics'][idx][1],
                                       code : artist_code,
                                       type : node_type,
                                       url : "http://image.music.naver.net/artist/240/000/"+a+"/"+artist_code+".jpg",
                                       idx : idx,values:[]};
                        layers0[idx] = {title: data['musics'][idx][1],
                                       code : artist_code,
                                       type : node_type,
                                       url : "http://image.music.naver.net/artist/240/000/"+a+"/"+artist_code+".jpg",
                                       idx : idx,values:[]};
                    } else {
                        layers[idx] = {title: data['musics'][idx][1],
                                    artist: data['musics'][idx][2],
                                    album_id: data['musics'][idx][3],
                                    artist_id: data['musics'][idx][4],
                                    url : "http://image.music.naver.net/album/204/000/"+a+"/"+data['musics'][idx][3]+".jpg",
                                    code : data['musics'][idx][0],
                                    type : node_type,
                                    idx : idx,values:[]};
                        layers0[idx] = {title: data['musics'][idx][1],
                                    artist: data['musics'][idx][2],
                                    album_id: data['musics'][idx][3],
                                    artist_id: data['musics'][idx][4],
                                    url : "http://image.music.naver.net/album/204/000/"+a+"/"+data['musics'][idx][3]+".jpg",
                                    code : data['musics'][idx][0],
                                    type : node_type,
                                    idx : idx,values:[]};
                    }
                }
                tmp = y1[idx][jdx];
                tmp = 1.0/tmp == Infinity ? 0 : 1.0/tmp;
                layers[idx].values.push({title:data['musics'][idx][1],
                                        x: Number(jdx),
                                        y: tmp});
                layers0[idx].values.push({title:data['musics'][idx][1],
                                        x: Number(jdx),
                                        y: 0});
            }
        }

        var n = layers.length;

        if (global_type == 'wiggle') {
            var stacked_layer = wiggle_stack(layers);
            y.domain([0, d3.max(stacked_layer, function(layer) { return d3.max(layer.values, function(d) { return  d.y0 + d.y; }); })]);
        } else {
            var stacked_layer = zero_stack(layers);
            y.domain([0, d3.max(stacked_layer, function(layer) { return d3.max(layer.values, function(d) { return  d.y0 + d.y; }); }) + 1.5]);
        }

        x.domain([0, d3.max(stacked_layer, function(layer) { return d3.max(layer.values, function(d) { return  d.x; }); })]);
        x2.domain([0, d3.max(stacked_layer, function(layer) { return d3.max(layer.values, function(d) { return  d.x; }); })]);

        color.domain([0, layers.length]);

        focus.selectAll(".layer")
            .data(stacked_layer)
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
                change_poster_specific(d.title, d.code, d.url, d.artist, d.artist_id, d.album_id);
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
                    if (Number(idx) != cidx) {
                        var chart = charts_to_find[idx];

                        var title = d.title;
                        var idx = title.indexOf("(");

                        if (idx != -1)
                            title = title.slice(0, title.indexOf("(")).trim()
                        result = chart.find_code(d.code, title);
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

        this.download = true;

        progressJs().increase(6.25);

        var cidx = get_cidx() + 1;

        if (cidx == 8 && class_name == 'people') {
            progressJs().end();
        }
        if (cidx < charts.length) {
            if (class_name == 'people') {
                next_chart = charts2[cidx];
            } else
                next_chart = charts[cidx];
            next_chart.get_json();
        }
    };

    var get_cidx = function() {
        return cidx;
    }

    this.set_cidx = function(idx) {
        cidx = idx;
    }

    this.find_code = function(code, title) {
        for (var idx in layers) {
            layer = layers[idx];

            if (layer.code == code) {
                var year = get_year();

                if (class_name == 'people')
                    var id = "#peo-" + year;
                else
                    var id = "#mov-" + year;

                toast("<a class='year-toast orange-text'; href='javascript:void(0);' onclick='move_to(\"" + id + "\")'>" + title + " found in " + year + "</a>", 4000);

                clicked_idx = layer.idx;
                update_context(layer.idx);
            }
        }
    }

    var change_poster = function() {
        $("#title").text(layers[context_idx].title);

        var data = layers[context_idx];
        if (layers[context_idx].type == 0) {
            $("#naver-link").attr('href', "http://music.naver.com/album/index.nhn?albumId="+data.album_id+"&trackId="+data.code);
            $("#artist").attr('href', "http://music.naver.com/artist/home.nhn?artistId="+data.artist_id);
            $("#artist").text(data.artist);
        } else {
            $("#naver-link").attr('href', "http://music.naver.com/artist/home.nhn?artistId="+data.code);
            $("#artist").text('')
            $("#artist").attr('href', "");
        }
        $("#poster").attr('src', layers[context_idx].url);
    }

    var change_poster_specific = function(title, code, url, artist, artist_id, album_id) {
        $("#title").text(title);
        if (class_name != 'people') {
            $("#naver-link").attr('href', "http://music.naver.com/album/index.nhn?albumId="+album_id+"&trackId="+code);
            $("#artist").attr('href', "http://music.naver.com/artist/home.nhn?artistId="+artist_id);
            $("#artist").text(artist);
        } else {
            $("#naver-link").attr('href', "http://music.naver.com/artist/home.nhn?artistId="+code);
            $("#artist").text('')
            $("#artist").attr('href', "");
        }
        $("#poster").attr('src', url);
    }
};

var update_music = function(genre, type) {

    $(".foxoffice").each(function() {
        year = $(this).attr('id');

        chart = new Chart(year, 'foxoffice', genre, type);
        chart.set_cidx(charts.length);
        charts.push(chart);
    });

    charts[0].get_json();
}

var update_people = function(type) {
    $(".people").each(function() {
        year = $(this).attr('id');

        chart = new Chart(year, 'people', 'artist', type);
        chart.set_cidx(charts2.length);
        charts2.push(chart);
    });

    charts2[0].get_json();
}

update_music('total', 'wiggle');
//update_people('people');
