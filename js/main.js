// var alp = require("./alphabet");
// At some point try and load alphabet in from alphabet.json

$(function () {
    var $canvas = $("#c");
    var canvasHeight;
    var canvasWidth;
    var ctx;
    var dt = 0.1;

    var pointCollection;

    function init() {
        updateCanvasDimensions();
        let rectSize = canvasWidth / 200;
        var g = [];
        
        let nameString = ["L", "A", "M", "B", "E", "R", "T", "", "L", "A", "B", "S", "", "L", "T", "D", "PERIOD"];

        var textWidth = nameString.length * 6 * rectSize;

        for (let i = 0; i < nameString.length; i++) {
            // let stroke = "rgb(155, 155, 155)"
            let stroke = "rgb(190,190,190)"

            let fill = "rgba(" + (Math.floor(Math.random() * 255) + 1) + "," + (Math.floor(Math.random() * 255) + 1) + "," + (Math.floor(Math.random() * 255) + 1) + ',.5)';

            if (alphabet[nameString[i]]) {
                for (let j = 0; j < alphabet[nameString[i]].length; j++) {
                    g.push(new roundRectangle(i * 6 * rectSize + rectSize * alphabet[nameString[i]][j][1], rectSize * alphabet[nameString[i]][j][0], 0.0, rectSize, 0, fill, stroke, true));
                    // g.push(new Rectangle(i * 6 * rectSize + rectSize * alphabet[nameString[i]][j][1], rectSize * alphabet[nameString[i]][j][0], 0.0, rectSize, fill))
                }
            }
        }

        for (var i = 0; i < g.length; i++) {
            // g[i].curPos.x = (canvasWidth / 2 - 650) + g[i].curPos.x;
            // g[i].curPos.y = (canvasHeight / 2 - 120) + g[i].curPos.y;

            g[i].curPos.x = canvasWidth / 2;
            g[i].curPos.y = canvasHeight / 2;

            g[i].targetPos.x = (canvasWidth / 2 - textWidth / 2) + g[i].targetPos.x;
            g[i].targetPos.y = (canvasHeight / 2 - 8 * rectSize / 2) + g[i].targetPos.y;

            g[i].originalPos.x = (canvasWidth / 2 - textWidth / 2) + g[i].originalPos.x;
            g[i].originalPos.y = (canvasHeight / 2 - 8 * rectSize / 2) + g[i].originalPos.y;
        };

        pointCollection = new PointCollection();
        pointCollection.points = g;

        initEventListeners();
        timeout();
    };

    function initEventListeners() {
        $(window).bind("resize", updateCanvasDimensions).bind("mousemove", onMove);

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
        canvasWidth = $canvas.width();
        canvasHeight = $canvas.height();
        rectSize = canvasWidth / 200;
        draw();
    };

    function onMove(e) {
        if (pointCollection)
            pointCollection.mousePos.set(e.pageX, e.pageY);
    };

    function onTouchMove(e) {
        if (pointCollection)
            pointCollection.mousePos.set(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
    };

    function timeout() {
        draw(); 
        // exchange();    
        update();
        // function timewait() {
        //     setTimeout(function () {
        //         exchange();
        //         timewait();
        //     }, 5000);
        // }
        // exchange(); // may take random ints to switch blocks

        setTimeout(function () { timeout(); }, 30);
    };

    function draw() {
        var tmpCanvas = $canvas.get(0);

        if (tmpCanvas.getContext == null) {
            return;
        };

        ctx = tmpCanvas.getContext("2d");
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        if (pointCollection)
            pointCollection.draw();
    };

    function update() {
        if (pointCollection)
            pointCollection.update();
    };

    function exchange() {
        if (pointCollection)
            pointCollection.exchange();
    }

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

                var dx = this.mousePos.x - point.curPos.x;
                var dy = this.mousePos.y - point.curPos.y;
                var dd = (dx * dx) + (dy * dy);
                var d = Math.sqrt(dd);

                if (d < 150) {
                    point.targetPos.x = (this.mousePos.x < point.curPos.x) ? point.curPos.x - dx :
                                                point.curPos.x - dx;
                    point.targetPos.y = (this.mousePos.y < point.curPos.y) ? point.curPos.y - dy :
                                                point.curPos.y - dy;
                } 
                else {
                    point.targetPos.x = point.originalPos.x;
                    point.targetPos.y = point.originalPos.y;
                };

                // point.targetPos.x = point.originalPos.x;
                // point.targetPos.y = point.originalPos.y;

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

        var self = this;
        this.exchange = function (wait=true) {

            if (wait === true) {
                console.log("wait is true");
                setTimeout(function () {
                    self.exchange(false);
                    // var pointsLength = that.points.length;
                    // let firstBlock = Math.floor(Math.random() * that.points.length);
                    // let secondBlock = Math.floor(Math.random() * that.points.length);
                    // let tempTargetPos = that.points[firstBlock].targetPos;

                    // that.points[firstBlock].targetPos = that.points[secondBlock].targetPos;
                    // that.points[secondBlock].targetPos = tempTargetPos;

                }, 5000); 
            } else {
                console.log("wait is false");
                var pointsLength = this.points.length;
                let firstBlock = Math.floor(Math.random() * this.points.length);
                let secondBlock = Math.floor(Math.random() * this.points.length);
                let tempTargetPos = this.points[firstBlock].targetPos;
                let tempFill = this.points[firstBlock].fill;
                let tempStroke = this.points[firstBlock].stroke;


                this.points[firstBlock].targetPos = this.points[secondBlock].targetPos;
                this.points[firstBlock].fill = this.points[secondBlock].fill;
                this.points[firstBlock].stroke = this.points[secondBlock].stroke;


                this.points[secondBlock].targetPos = tempTargetPos;
                this.points[secondBlock].fill = tempFill;
                this.points[secondBlock].stroke = tempStroke;    
                // setTimeout(function () { timeout(); }, 3000);
            }

        };
    };

        function Rectangle(x, y, z, size, colour) {
            this.colour = colour;
            this.curPos = new Vector(x, y, z);
            this.friction = 0.8;
            this.originalPos = new Vector(x, y, z);
            // this.radius = size;
            this.size = size;
            this.springStrength = 0.2;
            this.targetPos = new Vector(x, y, z);
            this.velocity = new Vector(0.0, 0.0, 0.0);

            this.update = function() {
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

                this.targetPos.z = d/100 + 1;
                var dz = this.targetPos.z - this.curPos.z;
                var az = dz * this.springStrength;
                this.velocity.z += az;
                this.velocity.z *= this.friction;
                this.curPos.z += this.velocity.z;

                this.radius = this.size*this.curPos.z;
                if (this.radius < 1) this.radius = 1;
            };

            this.draw = function() {
                ctx.fillStyle = this.colour;
                ctx.beginPath();
                ctx.rect(this.curPos.x, this.curPos.y, this.size, this.size);
                ctx.fill();
            };
        };

    function roundRectangle(x, y, z, size, radius, fill, stroke) {
        this.curPos = new Vector(x, y, z);
        this.friction = 0.8;
        this.originalPos = new Vector(x, y, z);
        this.size = size;
        this.springStrength = 0.2;
        this.targetPos = new Vector(x, y, z);
        this.velocity = new Vector(0.0, 0.0, 0.0);
        this.fill = fill;
        this.stroke = stroke;

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
            if (typeof stroke == "undefined") {
                stroke = true;
            }

            if (typeof radius === "undefined") {
                radius = 5;
            }

            ctx.strokeStyle = this.stroke;
            ctx.fillStyle = this.fill;
            ctx.beginPath();
            ctx.moveTo(this.curPos.x + radius, this.curPos.y);
            ctx.lineTo(this.curPos.x + size - radius, this.curPos.y);
            ctx.quadraticCurveTo(this.curPos.x + size, this.curPos.y, this.curPos.x + size,
                                    this.curPos.y + radius);
            ctx.lineTo(this.curPos.x + size, this.curPos.y + size - radius);
            ctx.quadraticCurveTo(this.curPos.x + size, this.curPos.y + size, this.curPos.x + size -
                                    radius, this.curPos.y + size);
            ctx.lineTo(this.curPos.x + radius, this.curPos.y + size);
            ctx.quadraticCurveTo(this.curPos.x, this.curPos.y + size, this.curPos.x, this.curPos.y +
                                    size - radius);
            ctx.lineTo(this.curPos.x, this.curPos.y + radius);
            ctx.quadraticCurveTo(this.curPos.x, this.curPos.y, this.curPos.x + radius,
                                    this.curPos.y);
            ctx.closePath();

            if (stroke) {
                ctx.stroke();
            }

            if (fill) {
                ctx.fill();
            }
        };
    };

    init();
});
