$(function() {
	var canvas = $("#c");
	var canvasHeight;
	var canvasWidth;
	var ctx;
	var dt = 0.1;

	var pointCollection;

	function init() {
		updateCanvasDimensions();
		let rectSize = 10;
		var g = [];

		let alphabet = {
			L: [
				[1,1],
				[2,1],
				[3,1],
				[4,1],
				[5,1],
				[6,1],
				[7,1],
				[7,2],
				[7,3],
				[7,4],
				[7,5],
			],

			A: [
				[2,1],
				[3,1],
				[4,1],
				[5,1],
				[6,1],
				[7,1],
				[1,2],
				[1,3],
				[1,4],
				[4,2],
				[4,3],
				[4,4],
				[2,5],
				[3,5],
				[4,5],
				[5,5],
				[6,5],
				[7,5],
			],

			M: [
				[1,1],
				[2,1],
				[3,1],
				[4,1],
				[5,1],
				[6,1],
				[7,1],
				[2,2],
				[3,3],
				[4,3],
				[2,4],
				[4,3],
				[1,5],
				[2,5],
				[3,5],
				[4,5],
				[5,5],
				[6,5],
				[7,5],
			],

			B: [
				[1,1],
				[2,1],
				[3,1],
				[4,1],
				[5,1],
				[6,1],
				[7,1],
				[1,2],
				[1,3],
				[1,4],
				[4,2],
				[4,3],
				[4,4],
				[7,2],
				[7,3],
				[7,4],
				[2,5],
				[3,5],
				[5,5],
				[6,5],
			],

			E: [
				[1,1],
				[2,1],
				[3,1],
				[4,1],
				[5,1],
				[6,1],
				[7,1],
				[1,2],
				[1,3],
				[1,4],
				[1,5],
				[4,2],
				[4,3],
				[4,4],
				[7,2],
				[7,3],
				[7,4],
				[7,5],
			],

			R: [
				[1,1],
				[2,1],
				[3,1],
				[4,1],
				[5,1],
				[6,1],
				[7,1],
				[1,2],
				[1,3],
				[1,4],
				[4,2],
				[4,3],
				[4,4],
				[2,5],
				[3,5],
				[5,3],
				[6,4],
				[7,5],
			],

			T: [
				[1,1],
				[1,2],
				[1,3],
				[1,4],
				[1,5],
				[2,3],
				[3,3],
				[4,3],
				[5,3],
				[6,3],
				[7,3],
			],

			S: [
				[1,2],
				[1,3],
				[1,4],
				[1,5],
				[2,1],
				[3,1],
				[4,2],
				[4,3],
				[4,4],
				[5,5],
				[6,5],
				[7,1],
				[7,2],
				[7,3],
				[7,4],
			],

			D: [
				[1,1],
				[2,1],
				[3,1],
				[4,1],
				[5,1],
				[6,1],
				[7,1],
				[1,2],
				[1,3],
				[1,4],
				[7,2],
				[7,3],
				[7,4],
				[2,5],
				[3,5],
				[4,5],
				[5,5],
				[6,5],

			],

			PERIOD: [
				[7,1],
			]



		}
 
		let nameString = ['L', 'A', 'M', 'B', 'E', 'R', 'T', '', 'L', 'A', 'B', 'S', '', 'L', 'T', 'D', 'PERIOD'];


		for (let i = 0; i < nameString.length; i++){
			randomColour = (function(m,s,c){return (c ? arguments.callee(m,s,c-1) : '#') +
			  				s[m.floor(m.random() * s.length)]})(Math,'0123456789ABCDEF',5);
			if (alphabet[nameString[i]]) {
				for (let j = 0; j < alphabet[nameString[i]].length; j++) {
				
					// randomColour = (function(m,s,c){return (c ? arguments.callee(m,s,c-1) : '#') +
			  // 				s[m.floor(m.random() * s.length)]})(Math,'0123456789ABCDEF',5);
	  				g.push(new roundRectangle(i * 6 * rectSize + rectSize * alphabet[nameString[i]][j][1], rectSize * alphabet[nameString[i]][j][0], 0.0, rectSize, 2, 20, true));
					// g.push(new Rectangle(i * 6 * rectSize + rectSize * alphabet[nameString[i]][j][1], rectSize * alphabet[nameString[i]][j][0], 0.0, rectSize, randomColour));
				}
			}
		}
	
		gLength = g.length;
		for (var i = 0; i < gLength; i++) {
			g[i].curPos.x = (canvasWidth/2 - 180) + g[i].curPos.x;
			g[i].curPos.y = (canvasHeight/2 - 65) + g[i].curPos.y;

			g[i].originalPos.x = (canvasWidth/2 - 180) + g[i].originalPos.x;
			g[i].originalPos.y = (canvasHeight/2 - 65) + g[i].originalPos.y;
		};

		pointCollection = new PointCollection();
		pointCollection.points = g;

		initEventListeners();
		timeout();
	};

	function initEventListeners() {
		$(window).bind('resize', updateCanvasDimensions).bind('mousemove', onMove);

		canvas.get(0).ontouchmove = function(e) {
			e.preventDefault();
			onTouchMove(e);
		};

		canvas.get(0).ontouchstart = function(e) {
			e.preventDefault();
		};
	};

	function updateCanvasDimensions() {
		canvas.attr({height: $(window).height(), width: $(window).width()});
		canvasWidth = canvas.width();
		canvasHeight = canvas.height();

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
		update();

		setTimeout(function() { timeout() }, 30);
	};

	function draw() {
		var tmpCanvas = canvas.get(0);

		if (tmpCanvas.getContext == null) {
			return;
		};

		ctx = tmpCanvas.getContext('2d');
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);

		if (pointCollection)
			pointCollection.draw();
	};

	function update() {
		if (pointCollection)
			pointCollection.update();
	};

	function Vector(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;

		this.addX = function(x) {
			this.x += x;
		};

		this.addY = function(y) {
			this.y += y;
		};

		this.addZ = function(z) {
			this.z += z;
		};

		this.set = function(x, y, z) {
			this.x = x;
			this.y = y;
			this.z = z;
		};
	};

	function PointCollection() {
		this.mousePos = new Vector(0, 0);
		this.points = new Array();

		this.newPoint = function(x, y, z) {
			var point = new Point(x, y, z);
			this.points.push(point);
			return point;
		};

		this.update = function() {
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
					point.targetPos.x = (this.mousePos.x < point.curPos.x) ? point.curPos.x - dx : point.curPos.x - dx;
					point.targetPos.y = (this.mousePos.y < point.curPos.y) ? point.curPos.y - dy : point.curPos.y - dy;
				} else {
					point.targetPos.x = point.originalPos.x;
					point.targetPos.y = point.originalPos.y;
				};

				point.update();
			};
		};

		this.draw = function() {
			var pointsLength = this.points.length;
			for (var i = 0; i < pointsLength; i++) {
				var point = this.points[i];

				if (point == null)
					continue;

				point.draw();
			};
		};
	};

	    function roundRectangle(x, y, z, size, radius, fill, stroke) {
		// this.colour = colour;
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
		if (typeof stroke == "undefined" ) {
			stroke = true;
		}

		if (typeof radius === "undefined") {
			radius = 5;
		}
		ctx.beginPath();
		ctx.moveTo(this.curPos.x + radius, this.curPos.y);
		ctx.lineTo(this.curPos.x + size - radius, this.curPos.y);
		ctx.quadraticCurveTo(this.curPos.x + size, this.curPos.y, this.curPos.x + size, this.curPos.y + radius);
		ctx.lineTo(this.curPos.x + size, this.curPos.y + size - radius);
		ctx.quadraticCurveTo(this.curPos.x + size, this.curPos.y + size, this.curPos.x + size - radius, this.curPos.y + size);
		ctx.lineTo(this.curPos.x + radius, this.curPos.y + size);
		ctx.quadraticCurveTo(this.curPos.x, this.curPos.y + size, this.curPos.x, this.curPos.y + size - radius);
		ctx.lineTo(this.curPos.x, this.curPos.y + radius);
		ctx.quadraticCurveTo(this.curPos.x, this.curPos.y, this.curPos.x + radius, this.curPos.y);
		ctx.closePath();
		if (stroke) {
		ctx.stroke();
		}
		if (fill) {
		ctx.fill();
		} 
		};
	};

	function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
		let ctx = tmpCanvas.getContext('2d');
		if (typeof stroke == "undefined" ) {
			stroke = true;
		}

		if (typeof radius === "undefined") {
			radius = 5;
		}
		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + width - radius, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
		ctx.lineTo(x + width, y + height - radius);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		ctx.lineTo(x + radius, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
		ctx.lineTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);
		ctx.closePath();
		if (stroke) {
		ctx.stroke();
		}
		if (fill) {
		ctx.fill();
		}        
		}

	init();
});
