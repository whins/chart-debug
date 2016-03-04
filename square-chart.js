function drawSquareChart(domElement){
	var de = document.getElementById(domElement);
    var data = getSquareData(5);
	var chart = new SquareChart();
	chart.init({id: domElement, data: data});	
	chart.render();
	return chart;
}

function SquareChart(){
    var self = this;
    self.Id = '';
    self.width = 0;
    self.height = 0;
    self.STAGE = null;
    self.data = null;
	self.colors = ["green", "orange", "red", "#CCCCCC", "blue", "yellow"];
    
	var outerShape = null;
    var chartShape = null;
    var backgroundCommands = [];
    var backgroundColor = "#F5F5F5";
    
    self.init = function(d){
        if (!d) { 
	        return null;        
        }
		self.Id = d.id; 
		if(!!d.data){
			self.data = d.data;
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
        self.drawChart();
        return self.STAGE;
    };
    
    self.drawChart = function(){
    	outerShape = new createjs.Shape();
        
		outerShape.alpha = 0.5;
    	var g = outerShape.graphics;
    	backgroundCommands.push(g.beginFill(backgroundColor).command);
		g.drawRect(0, 0, 1000, 1000);        
        for(var i = 0; i < self.data.length; i++){
            backgroundCommands.push(g.beginFill(self.colors[i]).command);
            g.drawRect(0, 0, self.data[i], self.data[i]);             
        }
		g.endFill();        
        self.STAGE.addChild(outerShape);
        createjs.Ticker.addEventListener("tick", self.STAGE);
    };
}