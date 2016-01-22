function createCanvas(divName) {      
	var div = document.getElementById(divName);
	div.appendChild(document.createElement('hr'));
	var canvas = document.createElement('canvas');
	div.appendChild(canvas);
	if (typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	} 
	var ctx = canvas.getContext("2d");
	return ctx;
}

function drawCanvasChart(domElement){

	var data = getData(100);
	var chart = new BarChart();
	chart.init({id: domElement, data: data});
	chart.render(300, 100);


	// //Create a stage by getting a reference to the canvas
 //    var stage = new createjs.Stage(domElement);
 //    stage.width = 300;
 //    stage.height = 150;
 //    //Create a Shape DisplayObject.
 //    var chartShape = new createjs.Shape();
 //    chartShape.width = stage.width;
 //    chartShape.height = stage.height;
 //    chartShape.graphics.beginFill("#507B8F").drawRect(0, 0, chartShape.width, chartShape.height);
 //    chartShape.x = chartShape.y = 0;
 //    stage.addChild(chartShape);

 //    var barShape = new createjs.Shape();
 //    barShape.width = stage.width;
 //    barShape.height = stage.height;
 //    var g = barShape.graphics;

    

 //    stage.update();    

}

function BarChart() {
	// Private properties and methods
	var self = this;
    self.Name = '';
    self.Id = '';
    self.width = 0;
    self.height = 0;
    self.STAGE = null;
    self.data = null;

	var colors = ["green", "orange", "red"];
	var step = 0;
	var outerShape = null;
    var chartShape = null;
    var backgroundCommands = [];
    var backgroundColor = "#FF00FF"

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

	self.render = function (w, h) {
		self.STAGE = new createjs.Stage(self.Id);
		self.STAGE.width = self.width = w;
		self.STAGE.height = self.height = h;
        self.drawChart(self.STAGE, w, h);
        return self.STAGE;
    };

    self.drawChart = function(group){
    	outerShape = new createjs.Shape();
    	var g = outerShape.graphics;
    	backgroundCommands.push(g.beginFill(backgroundColor).command);
    	g.drawRect(Math.round(0, 0, self.width, self.height));
        g.endFill();
        group.addChild(outerShape);

		outerShape.addEventListener("click", function (evt) {
			if (self.mouseClick){
				self.mouseClick(evt);
			}
		});
		outerShape.addEventListener("mousemove", function (evt) {
			if (self.mouseMove) {
				self.mouseMove(evt);
			}
		});
		outerShape.addEventListener("mouseout", function (evt) {
			if (self.mouseOut) {
				self.mouseOut(evt);
			}
		});
		group.addChild(outerShape);

		updateMinMax();
		chartShape = new createjs.Shape();
		for (var i = 0; i < self.data.length; i++) {
			drawRect(chartShape ,self.data[i]);
		};
		group.addChild(chartShape);
		group.update();
    };

    function updateMinMax(){
    	if (self.data == null) {
    		return;
    	};
    	self.X = {min: null, max: null, step: null };
    	self.Y = {min: null, max: null, step: null };
    	self.X.min = d3.extent(self.data, function(d) { return d.start; })[0];
		self.X.max = d3.extent(self.data, function(d) { return d.end; })[1];	
		var y_xtent = d3.extent(self.data, function(d) { return d.value; });	
		self.Y.min = y_xtent[0];
		self.Y.max = y_xtent[1];
		updateStep();
    };  

	function updateStep(){
		self.X.step = self.width / (self.X.max.valueOf() - self.X.min.valueOf());
		self.Y.step = self.width / (self.Y.max.valueOf() - self.Y.min.valueOf());
	}

	function drawRect(shape, data){
		var x = (data.start.valueOf() - self.X.min) * self.X.step;
		var h =	data.value * self.Y.step;
		var w =	(data.end.valueOf() - data.start.valueOf()) * self.X.step;
		var y = shape.height - h;
		var colors = ["green", "orange", "red"];

		shape.graphics.beginFill(colors[data.type]).drawRect(x, y, w, h).endFill();
		// createjs.Tween.get(shape).to({ h: valueLeft }, 100, createjs.Ease.linear);
	}

    self.setBackgroundColor = function (color) {
        backgroundColor = color;
        for (var i = 0; i < backgroundCommands.length; i++) {
            backgroundCommands[i].style = backgroundColor;
        }
    };

		
	
			
	// Draw method updates the canvas with the current display
	self.draw = function (data) {		
		self.data = data;				
		var startExtent = d3.extent(data, function(d) { return d.start; });
		var endExtent = d3.extent(data, function(d) { return d.end; });	
		self.domain([startExtent[0], endExtent[1]]);

		var graphAreaX = 0;
		var graphAreaY = 0;
		var graphAreaWidth = self.width;
		var graphAreaHeight = self.height;
		var i;
  
		// Update the dimensions of the canvas only if they have changed
		if (ctx.canvas.width !== self.width || ctx.canvas.height !== self.height) {
			ctx.canvas.width = self.width;
			ctx.canvas.height = self.height;
			updateStep();
		}

		// For each bar
		for (i = 0; i < data.length; i++) {
			var barX = (data[i].start.valueOf() - self.domainMin) * step;
			var barWidth = (data[i].end.valueOf() - data[i].start.valueOf()) * step;
			var barHeight = (data[i].value * 10);
			var barY = graphAreaHeight - barHeight;
			gradient = ctx.createLinearGradient(0, 0, 0, graphAreaHeight);
			gradient.addColorStop(1, colors[data[i].type]);
			ctx.fillStyle = gradient;
			ctx.fillRect(barX, barY, barWidth, barHeight);
		};
	};

  // Public properties and methods

}