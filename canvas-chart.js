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
	var ctx = createCanvas(domElement);
	var chart = new BarGraph(ctx);
	var data = getData(4000);
	chart.draw(data);
}

function BarGraph(ctx) {
	// Private properties and methods
	var self = this;
	var startArr;
	var endArr;
	var looping = false;
	var domainMin = 0;
	var domainMax = 1;
	var domains = [];
	var rangeMin = 0;
	var rangeMax =  1;
	var colors = ["green", "orange", "red"];
	var step = 0;

	self.context = ctx;
	self.data = [];
	self.width = width;
	self.height = height;	
	self.maxValue;
	self.margin = 5;
	self.colors = ["purple", "red", "green", "yellow"];
	self.curArr = [];
	self.backgroundColor = "#fff";
	self.xAxisLabelArr = [];
	self.yAxisLabelArr = [];
	self.animationInterval = 100;
	self.animationSteps = 10;

	self.domain = function(domainValues){
		if (domainValues == null) {
			return;
		};
		self.domainMin = domainValues[0];
		self.domainMax = domainValues[1];

		updateStep();
	}
		
	function updateStep(){
		step = self.context.canvas.width / (self.domainMax.valueOf() - self.domainMin.valueOf());
	}
	// Loop method adjusts the height of bar and redraws if neccessary
	var loop = function () {

	  var delta;
	  var animationComplete = true;

	  // Boolean to prevent update function from looping if already looping
	  looping = true;
	  
	  // For each bar
	  for (var i = 0; i < endArr.length; i += 1) {
		// Change the current bar height toward its target height
		delta = (endArr[i] - startArr[i]) / self.animationSteps;
		self.curArr[i] += delta;
		// If any change is made then flip a switch
		if (delta) {
		  animationComplete = false;
		}
	  }
	  // If no change was made to any bars then we are done
	  if (animationComplete) {
		looping = false;
	  } else {
		// Draw and call loop again
		draw(self.curArr);
		setTimeout(loop, self.animationInterval / self.animationSteps);
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

	self.reDraw = function() {
		// body...
	}

	
	
  // Update method sets the end bar array and starts the animation
	self.update = function (newArr) {

	  // If length of target and current array is different 
	  if (self.curArr.length !== newArr.length) {
		self.curArr = newArr;
		draw(newArr);
	  } else {
		// Set the starting array to the current array
		startArr = self.curArr;
		// Set the target array to the new array
		endArr = newArr;
		// Animate from the start array to the end array
		if (!looping) {	
		  loop();
		}
	  }
	}; 
}