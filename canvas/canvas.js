function getPositionInPath(path, segment, t) {
    var f = path[segment].f;
    var args = path[segment].args.slice();
    args.unshift(t);
    var result = f.apply(null, args);
    return result;
}

var nbrCars = 4;
var paths = [];
var steps = [];
var position = [];
var colors = ["red", "blue", "green", "cyan", "yellow"];

function createVars() {
    for (var i = 0; i < nbrCars; i++) {
        paths.push([]);
        position.push({segment: 0, t: 0.0, color: colors[i], lap: 0});
    }
}

function createPath(p) {
    var origin, next, x;
    var C1, C2, C3, C4;
    var diff = 10 * p;
    steps = [];

    C1 = Point(100, 10 + diff);
    C2 = Point(200, 10 + diff);
    paths[p].push({f: getLineBezier, args: [C1, C2]});
    steps.push(0.02);
    // steps.push(0.01);

    C1 = Point(200, 10 + diff);
    C2 = Point(350 - diff, 0 + diff);
    C3 = Point(450 - diff, 200 - diff);
    C4 = Point(300, 200 - diff);
    paths[p].push({f: getCubicBezier, args: [C1, C2, C3, C4]});
    steps.push(0.005);
    // steps.push(0.01);

    C1 = Point(300, 200 - diff);
    C2 = Point(100, 200 - diff);
    C3 = Point(100, 400 - diff);
    C4 = Point(50 + diff, 100);
    paths[p].push({f: getCubicBezier, args: [C1, C2, C3, C4]});
    steps.push(0.005);
    // steps.push(0.01);

    C1 = Point(50 + diff, 100);
    C2 = Point(50 + diff, 100);
    C3 = Point(30 + diff , 10 + diff);
    C4 = Point(102, 10 + diff);
    paths[p].push({f: getCubicBezier, args: [C1, C2, C3, C4]});
    steps.push(0.02);
    // steps.push(0.01);
}

function drawPath(ctx, path) {
    var origin, next, x;
    var C1, C2, C3, C4;

    ctx.beginPath();
    ctx.strokeStyle = "black";
    C1 = path[0].args[0];
    C2 = path[0].args[1];
    ctx.moveTo(C1.x, C1.y);
    drawLineBezier(ctx, C1, C2);

    C1 = path[1].args[0];
    C2 = path[1].args[1];
    C3 = path[1].args[2];
    C4 = path[1].args[3];
    drawCubicBezier(ctx, C1, C2, C3, C4);

    C1 = path[2].args[0];
    C2 = path[2].args[1];
    C3 = path[2].args[2];
    C4 = path[2].args[3];
    drawCubicBezier(ctx, C1, C2, C3, C4);

    C1 = path[3].args[0];
    C2 = path[3].args[1];
    C3 = path[3].args[2];
    C4 = path[3].args[3];
    drawCubicBezier(ctx, C1, C2, C3, C4);

    ctx.stroke();
}

function setRaceInfo(msg) {
    var info = document.getElementById("info");
    info.innerHTML = msg;
}

function drawPaths(ctx) {
    for (var i = 0; i < nbrCars; i++) {
        drawPath(ctx, paths[i]);
    }
}

window.onload = function() {
    createVars();
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    for (var i = 0; i < nbrCars; i++) {
        createPath(i);
    }
    drawPaths(ctx);
};

var move_cars = function() {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    drawPaths(ctx);
    var msg = "";
    for (var i = 0; i < nbrCars; i++) {
        var s = Math.floor(Math.random() * 6) + 1;
        move_car(ctx, i, s);
        msg += "car " + (i + 1) + " [" + position[i].lap + "]\n";
    }
    setRaceInfo(msg);
};

var move_car = function(ctx, p, s) {
    if (!s) s = 1;
    var step = steps[position[p].segment];
    var nbrSegments = steps.length;
    position[p].t += step * s;
    if (position[p].t > 1) {
        position[p].segment++;
        if (position[p].segment === nbrSegments) {
            position[p].segment = 0;
            position[p].lap++;
        }
        position[p].t -= 1.0;
        // position[p].t = 0;
    }
    ctx.beginPath();
    ctx.strokeStyle = position[p].color;
    var result = getPositionInPath(paths[p], position[p].segment, position[p].t);
    ctx.moveTo(result.x, result.y);
    ctx.arc(result.x, result.y, 3, 0, 2*Math.PI);
    ctx.stroke();
};

setInterval(move_cars, 200);


