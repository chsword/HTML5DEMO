/// <reference path="jquery.svg.js" />
$(function () {

    var colArr = ["ffd71d", "b0de09", "06e015", "119de5", "0e5ee2", "ff7519", "ff7519", "d40a00", "f8ff27", "ffd71d", "f8ff27", "b0de09", "06e015", "0e5ee2", "d40a00", "06e015", "119de5", "ffb135", "320fe1", "d40a00", "b0de09", "ff7519", "ffd71d", "320fe1", "320fe1", "0e5ee2", "ffb135", "ffb135", "119de5", "f8ff27"];

    function drawInitial(svg) {
    }

    function initValue(data) {
        var sum = 0;
        var count = 0;
        for (var k in data.rows) {
            sum += data.rows[k].value;
            count++;
        }
        data._sum = sum;
        data._count = count;
        if (sum != 0) {
            for (var m in data.rows) {
                data.rows[m]._percent = (data.rows[m].value / data._sum);
            }
        }
        return data;
    }

    function initSvg(e) {
        $(e).svg({ onLoad: drawInitial });
        return e.svg('get');
    }

    var toRadians = function (degrees) {
        var radians = (Math.PI / 180) * degrees;
        return radians;
    };
    var drawList = function (svg, data) {
        var initLeft = 250, initTop = 80;
        for (var i = 0; i < data._count; i++) {
            var item = data.rows[i];
            var top = initTop + 20 * i;
            var rect = svg.rect(initLeft, top, 32, 18, { fill: '#' + colArr[i] });

            svg.text(initLeft + 150, top + 15, (item._percent * 100).toFixed(2) + "%");
            svg.text(initLeft + 40, top + 15, item.label, { fill: "#336699" });

            $(rect).hover(function () {
                $(this).animate({ svgX: initLeft + 10 }, 300);
            }, function () {
                $(this).animate({ svgX: initLeft }, 300);
            });
        }
    };
    var drawPie = function (svg, data) {
        var radius = 100;

        var x = 2 * radius, y = radius;
        var deg = 0;

        for (var i = 0; i < data._count; i++) {
            var item = data.rows[i];
            var curDeg = 360 * item._percent;
            deg += curDeg;
            var ranians = toRadians(deg);
            var curX = radius * (Math.cos(ranians) + 1);
            var curY = radius * (Math.sin(ranians) + 1);
            var g = svg.group({});
            svg.path(g, svg.createPath()
                .move(radius, radius).line(x, y)
                .arc(radius, radius, 0, curDeg > 180 ? 1 : 0, true,
                        curX, curY, false)
                .line(radius, radius).close(),
                { fill: '#' + colArr[i], 'stroke-width': 1, stroke: "#ffffff" });
            var amx = (x + curX) / 2;
            var amy = (y + curY) / 2;

            //svg.text(amx - 30, amy + 10, item.label, { fill: "#336699" });

            $(g).data("am", { 'x': (amx - 100) / 15, 'y': (amy - 100) / 15 })
                .hover(function () {
                    var am = $(this).data("am");
                    $(this).animate({ svgTransform: 'translate(' + am.x + ',' + am.y + ')' });
                }, function () {
                    $(this).animate({ svgTransform: 'translate(0)' });
                });
            x = curX, y = curY;
        }

    };
    var drawArea = function (svg, data) {
        var iWidth = 400, iHeight = 300;
        var area = iWidth * iHeight;
        //svg.rect(0, 0, iWidth, iHeight, { fill: "black" });
        var x = 0, y = 0;
        var gArea = svg.group({});
        var gText = svg.group({});
        for (var i = 0; i < data._count; i++) {
            var item = data.rows[i];
            var isW = i % 2 == 0;
            var w = isW ? (area * item._percent / iHeight) : iWidth;
            var h = isW ? iHeight : (area * item._percent / iWidth);
           

            var rect = svg.rect(gArea, x, y, w, h, { fill: '#' + colArr[i], 'stroke-width': 1, stroke: "#ffffff", 'z-index': 1 });
            svg.text(gText, x + w / 2 - 10, y + h / 2 + 10, item.label
                + " " + (item._percent * 100).toFixed(2) + "%", { fill: "#336699", 'z-index': 999 });
            x += isW ? w : 0;
            y += isW ? 0 : h;
            iWidth = isW ? iWidth - w : iWidth;
            iHeight = isW ? iHeight : iHeight - h;

            $(rect).hover(function () {
                $(this).animate({ svgTransform: 'skewX(1,1.3)' });
            }, function () {
                $(this).animate({ svgTransform: 'skewX(0)' });
            });
        }
    };
    $.fn.gchartPie = function (data) {
        data = initValue(data);
        var svg = initSvg(this);
        drawList(svg, data);
        drawPie(svg, data);
        return this;
    };
    $.fn.gchartArea = function (data) {
        data = initValue(data);
        var svg = initSvg(this);
        //drawList(svg, data);
        drawArea(svg, data);
        return this;
    };
});