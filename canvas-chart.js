function drawCanvasChart(domElement){
	var de = document.getElementById(domElement);
	var data = getData(de.width / 2);
	var chart = new BarChart();
	chart.init({id: domElement, data: data});	
	chart.render();
	return chart;

}

function BarChart() {

	var self = this;
    self.Name = '';
    self.Id = '';
    self.width = 0;
    self.height = 0;
    self.STAGE = null;
    self.data = null;
	self.colors = ["green", "orange", "red", "#CCCCCC"];

	var step = 0;
	var outerShape = null;
    var chartShape = null;
    var backgroundCommands = [];
    var backgroundColor = "#F5F5F5"
    var rect = null;
	var duration = 1000;
    var bars = [];

	self.init = function(d){
        if (!d) { 
	        return null;        
        }
		self.Id = d.id; 
		if(!!d.data){
			self.data = d.data;
			updateMinMax();
		}		
	};

	self.render = function () {
		self.STAGE = new createjs.Stage(self.Id);
		self.STAGE.autoClear = false;
		self.width = self.STAGE.canvas.width;
		self.height = self.STAGE.canvas.height;
		self.STAGE.canvas.addEventListener('mousemove', function(e){
			return 1;
		});
        self.drawChart(self.STAGE);
        return self.STAGE;
    };

    self.drawChart = function(stage){
    	outerShape = new createjs.Shape();
    	var g = outerShape.graphics;
    	backgroundCommands.push(g.beginFill(backgroundColor).command);
		g.drawRect(0, 0, self.width, self.height);
		g.endFill();
        stage.addChild(outerShape);

		updateMinMax();		

		drawDataBars();							
		

		stage.enableMouseOver(10);
    };


	function drawDataBars(from){
		// self.STAGE.clear();
		var shape = new createjs.Shape();
		var g = shape.graphics;
		var backShapeData = [];
		var range = {start: null, end: null, type: null};

		for (var i = from == undefined ? 0: from ; i < self.data.length; i++) {

			/// data for back shape			
			if(range.start === null && range.start !== i && range.type !== self.data[i].type){
				range.start = i;
				range.type = self.data[i].type;
			}

			if(!self.data[i + 1] || (range.end === null && range.start !== i && range.type !== self.data[i + 1].type)){
				range.type = self.data[i].type;
				backShapeData.push({start: range.start, end: i, type: self.data[i].type});
				range.start = null;
				range.end = null;
			}
			// end data for back shape
			

			// var x = Math.floor((self.data[i].start.valueOf() - self.X.min.valueOf()) * self.X.step);
			var h =	Math.floor(self.data[i].value * self.Y.step);
			// var w =	Math.floor((self.data[i].end.valueOf() - self.data[i].start.valueOf()) * self.X.step);
			var y = self.height - h;

			var lineTo = new createjs.Graphics.LineTo(i + 0.5, self.height);

			g.setStrokeStyle(1)
				.beginStroke(self.colors[self.data[i].type])
				.moveTo(i + 0.5, self.height)
				.append(lineTo)
				.endStroke();

			createjs.Tween.get(lineTo)
				.to({ y: y }, duration, createjs.Ease.linear );
			createjs.Tween.get(lineTo)
				.to({ h: h }, duration, createjs.Ease.linear)			
				.call(handleComplete);
			bars.push({x: i, y: y, data: self.data[i]});
		};
		self.STAGE.addChild(shape);

		drawBack(backShapeData);
		createjs.Ticker.addEventListener("tick", self.STAGE);
	};


	self.addPoint = function(){
		var newPoints = getData(10);
		var from = self.data.length;
		for (var i = 0; i < newPoints.length; i++) {
			self.data.push(newPoints[i]);
		};
		drawDataBars(from);
	}

	// function drawDataBars(){		

	// 	var backShapeData = [];

	// 	var range = {start: null, end: null, type: null};

	// 	for (var i = 0; i < self.data.length; i++) {

	// 		/// data for back shape			
	// 		if(range.start === null && range.start !== i && range.type !== self.data[i].type){
	// 			range.start = i;
	// 			range.type = self.data[i].type;
	// 		}

	// 		if(!self.data[i + 1] || (range.end === null && range.start !== i && range.type !== self.data[i + 1].type)){
	// 			range.type = self.data[i].type;
	// 			backShapeData.push({start: range.start, end: i, type: self.data[i].type});
	// 			range.start = null;
	// 			range.end = null;
	// 		}
	// 		// end data for back shape

	// 		// var x = Math.floor((self.data[i].start.valueOf() - self.X.min.valueOf()) * self.X.step);
	// 		var h =	Math.floor(self.data[i].value * self.Y.step);
	// 		// var w =	Math.floor((self.data[i].end.valueOf() - self.data[i].start.valueOf()) * self.X.step);
	// 		var y = self.height - h;

	// 		var shapeBar = new createjs.Shape();
	// 		var g = shapeBar.graphics;
	// 		shapeBar.x = i + 0.5;
	// 		shapeBar.y = y;	
	// 		shapeBar.data = self.data[i];

	// 		var lineTo = new createjs.Graphics.LineTo(0, h);

	// 		g.setStrokeStyle(1)
	// 			.beginStroke(self.colors[self.data[i].type])
	// 			.moveTo(0, h)
	// 			.append(lineTo)
	// 			.endStroke();

	// 		createjs.Tween.get(lineTo)
	// 			.to({ y: 0 + 0.5 }, duration, createjs.Ease.linear );
	// 		createjs.Tween.get(lineTo)
	// 			.to({ h: h }, duration, createjs.Ease.linear)			
	// 			.call(handleComplete);
	// 		shapeBar.addEventListener("click", onRectClick);
	// 		shapeBar.addEventListener("mouseover", onRectMousemove);
	// 		self.STAGE.addChild(shapeBar);
	// 		// bars.push(shapeBar);
	// 	};
		
	// 	drawBack(backShapeData);
	// };

	function drawBack(data){
		var backRect = new createjs.Shape();
		backRect.alpha = 0.1;
		createjs.Ticker.mouseEnabled = false;

		var backLines = new createjs.Shape();
		backLines.alpha = 0.4;
		backLines.mouseEnabled = false;

		var gR = backRect.graphics;
		var gL = backLines.graphics;
		for (var i = 0; i < data.length; i++) {
			var x1 = data[i].start;
			var x2 = data[i].end + 1;
			var w = x2 - x1;
			var col = self.colors[data[i].type];
			gR.beginFill(col).drawRect(x1, 0.5, w, self.height).endFill();
			gL.setStrokeStyle(1).beginStroke(col).moveTo(x1, 0.5).lineTo(x2, 0.5).endStroke();
		};

		self.STAGE.addChild(backRect, backLines);
	}
	
    function updateMinMax(){
    	if (self.data == null) {
    		return;
    	};
    	self.X = {min: null, max: null, step: null };
    	self.Y = {min: null, max: null, step: null };
    	self.X.min = d3.extent(self.data, function(d) { return d.start; })[0];
		self.X.max = d3.extent(self.data, function(d) { return d.end; })[1];	
		var y_xtent = d3.extent(self.data, function(d) { return d.value; });	
		self.Y.min = 0;
		self.Y.max = y_xtent[1];
		updateStep();
    };  

	function updateStep(){
		self.X.step = self.width / (self.X.max.valueOf() - self.X.min.valueOf());
		self.Y.step = self.height / (self.Y.max);
	}
	function onRectClick(evt) {
		var sender = evt.target;
	}

	function onRectMousemove(evt) {
		var sender = evt.target;
		var value = sender.data.value;
		var x = sender.x;
		var y = sender.y;
		$('#output').html('V: ' + value + '<br>X: ' + x + '<br>Y: ' + y);
	}

	function handleComplete(evt) {
		var sender = evt.target;
	}
    self.setBackgroundColor = function (color) {
        backgroundColor = color;
        for (var i = 0; i < backgroundCommands.length; i++) {
            backgroundCommands[i].style = backgroundColor;
        }
    };
}

