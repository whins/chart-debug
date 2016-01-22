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

	self.domain = function(domainValues){
		if (domainValues == null) {
			return;
		};
		if (domainValues.length == 2) {
			self.domainMin = domainValues[0];
			self.domainMax = domainValues[1];
		} else {
			self.domains = domainValues;
		}
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
	var draw = function (arr) {
							
	  var numOfBars = arr.length;
	  var barWidth;
	  var barHeight;
	  var border = 0;
	  var ratio;
	  var maxBarHeight;
	  var gradient;
	  var largestValue;
	  var graphAreaX = 0;
	  var graphAreaY = 0;
	  var graphAreaWidth = self.width;
	  var graphAreaHeight = self.height;
	  var i;
	  
		// Update the dimensions of the canvas only if they have changed
	  if (ctx.canvas.width !== self.width || ctx.canvas.height !== self.height) {
		ctx.canvas.width = self.width;
		ctx.canvas.height = self.height;
	  }
				
	  // Draw the background color
	  ctx.fillStyle = self.backgroundColor;
	  ctx.fillRect(0, 0, self.width, self.height);
					
	  // If x axis labels exist then make room	
	  if (self.xAxisLabelArr.length) {
		graphAreaHeight -= 40;
	  }
				
	  // Calculate dimensions of the bar
	  barWidth = graphAreaWidth / numOfBars - self.margin * 2;
	  maxBarHeight = graphAreaHeight - 25;
				
	  // Determine the largest value in the bar array
	  var largestValue = 0;
	  for (i = 0; i < arr.length; i += 1) {
		if (arr[i] > largestValue) {
		  largestValue = arr[i];	
		}
	  }
	  
	  // For each bar
	  for (i = 0; i < arr.length; i += 1) {
		// Set the ratio of current bar compared to the maximum
		if (self.maxValue) {
		  ratio = arr[i] / self.maxValue;
		} else {
		  ratio = arr[i] / largestValue;
		}
		
		barHeight = ratio * maxBarHeight;
	  
		// Turn on shadow
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.shadowBlur = 2;
		ctx.shadowColor = "#999";
						
		// Draw bar background
		ctx.fillStyle = "#333";			
		ctx.fillRect(self.margin + i * self.width / numOfBars,
		  graphAreaHeight - barHeight,
		  barWidth,
		  barHeight);
			
		// Turn off shadow
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowBlur = 0;

		// Draw bar color if it is large enough to be visible
		if (barHeight > border * 2) {
			// Create gradient
			gradient = ctx.createLinearGradient(0, 0, 0, graphAreaHeight);
			gradient.addColorStop(1-ratio, self.colors[i % self.colors.length]);
			gradient.addColorStop(1, "#ffffff");

			ctx.fillStyle = gradient;
			// Fill rectangle with gradient
			ctx.fillRect(self.margin + i * self.width / numOfBars + border,
			  graphAreaHeight - barHeight + border,
			  barWidth - border * 2,
			  barHeight - border * 2);
		}

		// Write bar value
		ctx.fillStyle = "#333";
		ctx.font = "bold 12px sans-serif";
		ctx.textAlign = "center";
		// Use try / catch to stop IE 8 from going to error town
		try {
		  ctx.fillText(parseInt(arr[i],10),
			i * self.width / numOfBars + (self.width / numOfBars) / 2,
			graphAreaHeight - barHeight - 10);
		} catch (ex) {}
		// Draw bar label if it exists
		if (self.xAxisLabelArr[i]) {					
		  // Use try / catch to stop IE 8 from going to error town				
		  ctx.fillStyle = "#333";
		  ctx.font = "bold 12px sans-serif";
		  ctx.textAlign = "center";
		  try{
			ctx.fillText(self.xAxisLabelArr[i],
			  i * self.width / numOfBars + (self.width / numOfBars) / 2,
			  self.height - 10);
			} catch (ex) {}
		  }
		}
	  };

  // Public properties and methods
	
  this.width = 300;
  this.height = 150;	
  this.maxValue;
  this.margin = 5;
  this.colors = ["purple", "red", "green", "yellow"];
  this.curArr = [];
  this.backgroundColor = "#fff";
  this.xAxisLabelArr = [];
  this.yAxisLabelArr = [];
  this.animationInterval = 100;
  this.animationSteps = 10;
	
  // Update method sets the end bar array and starts the animation
	this.update = function (newArr) {

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