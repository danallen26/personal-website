$(function () {
    var $canvas = $("#c-datascience");
    var $homeCanvas = $("#c-home");
    var canvasHeight;
    var canvasWidth;
    var ctx;
    var dt = 0.1;
    var bonds = [];
    var pointCollection;
    var g = [];

    function init() {
        updateCanvasDimensions();
        // let rectSize = canvasWidth / 120;
        // let nameString = ["R", "E", "S", "E", "A", "R", "C", "H"];
        // var textWidth = nameString.length * 6 * rectSize;
        let bondsCount = 0;

        for (let i = 0; i < 150; i++) {
            let fill = 'rgba(200, 200, 200, 1.0)'
            let x = Math.floor(Math.random() * canvasWidth) + 1;
            let y = Math.floor(Math.random() * canvasHeight) + 1;

            g.push(new Point(x, y, 0.0, rectSize, fill));
            if (i > 0) {
                bonds.push([i-1, i]);
                bondsCount += 1;
            }
        //     let red = Math.floor(Math.random() * 200) + 1;
        //     let grn = Math.floor(Math.random() * 200) + 1;
        //     let blu = Math.floor(Math.random() * 200) + 1;
        //     let fill = "rgba(" + red + "," + grn + "," + blu + " ,1.0)";

        //     if (researchAlphabet[nameString[i]]) {
        //         for (let j = 0; j < researchAlphabet[nameString[i]].beads.length; j++) {
        //             g.push(new Point(i * 6 * rectSize + rectSize * researchAlphabet[nameString[i]].beads[j][1], rectSize * researchAlphabet[nameString[i]].beads[j][0], 0.0, rectSize, fill));
        //         }

        //         for (let j = 0; j < researchAlphabet[nameString[i]].bonds.length; j++) {
        //             bonds.push([researchAlphabet[nameString[i]].bonds[j][0] + bondsCount, researchAlphabet[nameString[i]].bonds[j][1] + bondsCount]);
        //         }

        //         bondsCount += researchAlphabet[nameString[i]].beads.length;
        //     }
        }

        // for (var i = 0; i < g.length; i++) {
        //     g[i].targetPos.x = (canvasWidth / 2 - textWidth / 2) + g[i].targetPos.x;
        //     g[i].targetPos.y = (canvasHeight / 2 - 8 * rectSize / 2) + g[i].targetPos.y;

        //     g[i].originalPos.x = g[i].targetPos.x;
        //     g[i].originalPos.y = g[i].targetPos.y;

        //     g[i].curPos.x = g[i].targetPos.x;
        //     g[i].curPos.y = g[i].targetPos.y;
        // };

        pointCollection = new PointCollection();
        pointCollection.points = g;
        initEventListeners();
        timeout();
    };

    function initEventListeners() {
        $canvas.get(0).ontouchmove = function (e) {
            e.preventDefault();
            onTouchMove(e);
        };

        $canvas.get(0).ontouchstart = function (e) {
            e.preventDefault();
        };
    };

    function updateCanvasDimensions() {
        $canvas.attr({ height: $(window).height(), width: $(window).width() });
        canvasWidth = $homeCanvas.width();
        canvasHeight = $homeCanvas.height();
        rectSize = canvasWidth / 300;
        draw();
    };

    function timeout() {
        drawBonds();
        draw();
        update();
        setTimeout(function () { timeout(); }, 30);
    };

    function draw() {
        if (pointCollection)
            pointCollection.draw();
    }

    function update() {
        if (pointCollection)
            pointCollection.update();
    };

    drawBonds = function () {
        var tmpCanvas = $canvas.get(0);

        if (tmpCanvas.getContext == null) {
            return;
        };

        ctx = tmpCanvas.getContext("2d");
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        for (let i = 0; i < bonds.length; i++) {
            let dx = g[bonds[i][0]].curPos.x - g[bonds[i][1]].curPos.x;
            let dy = g[bonds[i][0]].curPos.y - g[bonds[i][1]].curPos.y;
            let dd = (dx * dx) + (dy * dy);
            let d = Math.sqrt(dd);
            let sc = 50;
            ctx.strokeStyle = "rgba(" + sc + "," + sc + "," + sc + ', 0.3)';
            // ctx.lineWidth= 12000 / d**2;
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.moveTo(g[bonds[i][0]].curPos.x, g[bonds[i][0]].curPos.y);
            ctx.lineTo(g[bonds[i][1]].curPos.x, g[bonds[i][1]].curPos.y);
            ctx.stroke();
        };
    };

    function Vector(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.addX = function (x) {
            this.x += x;
        };

        this.addY = function (y) {
            this.y += y;
        };

        this.addZ = function (z) {
            this.z += z;
        };

        this.set = function (x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        };
    };

    function PointCollection() {
        this.mousePos = new Vector(0, 0);
        this.points = new Array();

        this.newPoint = function (x, y, z) {
            var point = new Point(x, y, z);
            this.points.push(point);
            return point;
        };

        this.update = function () {
            var pointsLength = this.points.length;

            for (var i = 0; i < pointsLength; i++) {
                var point = this.points[i];

                if (point == null)
                    continue;

                // point.velocity.x += 0.7 * (Math.random() - 0.5);
                // point.velocity.y += 0.7 * (Math.random() - 0.5);
                point.update();
            };
        };

        this.draw = function () {
            var pointsLength = this.points.length;
            for (var i = 0; i < pointsLength; i++) {
                var point = this.points[i];

                if (point == null)
                    continue;

                point.draw();
            };
        };
    };

    function Point(x, y, z, size, colour) {
        this.colour = colour;
        this.curPos = new Vector(x, y, z);
        this.friction = 0.8;
        this.originalPos = new Vector(x, y, z);
        this.radius = size;
        this.size = size;
        this.springStrength = 0.05;
        this.targetPos = new Vector(x, y, z);
        this.velocity = new Vector(0.0, 0.0, 0.0);

        this.update = function () {
            var dx = this.targetPos.x - this.curPos.x;
            var ax = dx * this.springStrength;
            this.velocity.x += ax;
            this.velocity.x *= this.friction;
            this.curPos.x += this.velocity.x;

            var dy = this.targetPos.y - this.curPos.y;
            var ay = dy * this.springStrength;
            this.velocity.y += ay;
            this.velocity.y *= this.friction;
            this.curPos.y += this.velocity.y;

            var dox = this.originalPos.x - this.curPos.x;
            var doy = this.originalPos.y - this.curPos.y;
            var dd = (dox * dox) + (doy * doy);
            var d = Math.sqrt(dd);

            this.targetPos.z = d / 100 + 1;
            var dz = this.targetPos.z - this.curPos.z;
            var az = dz * this.springStrength;
            this.velocity.z += az;
            this.velocity.z *= this.friction;
            this.curPos.z += this.velocity.z;

            this.radius = this.size * this.curPos.z;
            if (this.radius < 1) this.radius = 1;
        };

        this.draw = function () {
            ctx.fillStyle = this.colour;
            ctx.beginPath();
            ctx.arc(this.curPos.x, this.curPos.y, this.radius, 0, Math.PI * 2, true);
            ctx.fill();
        };
    };

    init();
});

$(document).ready(function () {
    $(".icon-binary").hover(function () {
        $("#c-datascience").removeClass("hidden");
        $("#c-home").addClass("hidden");
        $("#c-home").fadeOut(500);
        $("#c-datascience").fadeIn(3000);
    },
    function () {
        $("#c-datascience").fadeOut(500);
        $("#c-home").fadeIn(1000);
        $("#c-datascience").addClass("hidden");
        $("#c-home").removeClass("hidden");
    });
});
