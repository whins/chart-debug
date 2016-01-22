


function getOffsetData(data){
	var extent = d3.extent(data, function(d) { return d.d; });
	var dateRange = extent[1].valueOf() - extent[0].valueOf();
	var pd = [];
	pd.push({offset: "0%", color: "white"});
	var step = 100 / dateRange * 2;
	for (var i = 1; i < data.length - 1; i++) {
		pd.push({offset: "" + i * step + "%", color: data[i].t});		
		pd.push({offset: "" + (i + 1) * step + "%", color: "white"});	
		i++;	
	};
	return pd;
};

function drawD3Chart(domElement){	
	var data = getData(4000);

	var colors = ["green", "orange", "red"];

	var x = d3.time.scale()
    	.range([0, width]);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var  area = d3.svg.area().interpolate("linear")
		.x(function(d) { return x(d.start); })
		.y0(height)
		.y1(function(d) { return y(d.value); });

	var startExtent = d3.extent(data, function(d) { return d.start; });
	var endExtent = d3.extent(data, function(d) { return d.end; });
	x.domain([startExtent[0], endExtent[1]]);
  	y.domain(d3.extent(data, function(d) { return d.value; }));

	var svg = d3.select("#" + domElement).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end");

	// svg.append("path")
	// 	.datum(data)
	// 	.attr("class", "area")
	// 	.attr("d", area);

	svg.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr("class", "rext")
		.attr("x", function(d){return x(d.start);})
		.attr("y", function(d){return height - y(d.value);})
		.attr("width", function(d){ return x(d.end) - x(d.start) })
		.attr("height", function(d){return y(d.value)})
		.attr("fill", function(d) { return colors[d.type]})
		.attr("opacity", function(d){ return 0.6 });

};


