// Setup the size and such
var svg    = d3.select("svg"),
    width  = +svg.attr("width"),
    height = +svg.attr("height"),

    width = 0.8*width;
    height = 0.8*height;

var margin = {top: (0.1*width), right: (0.1*width), bottom: (0.1*width), left: (0.1*width)};

// create a clipping region 
svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);
  
// Draw Datapoints
var points_g = svg.append("g")
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .attr("clip-path", "url(#clip)")
  .classed("points_g", true);

var points //make it global

// Load json data, make graph
d3.json('data/dates.json',function(err, data){

	if(err){throw err}else{ data = parseData(data) }
	
	// create scale objects
	var xScale = d3.scaleTime()
	  .domain(d3.extent(data,function(d){return d.d}))
	  .range([0, width]);

	var yScale = d3.scaleLinear()
	  .domain(d3.extent(data,function(d){return d.c}))
	  .range([height, 0]);

	// create axis objects
	var xAxis = d3.axisBottom(xScale)
	var yAxis = d3.axisLeft(yScale)
	
	var gX = svg.append('g')
	  .attr('transform', 'translate(' + margin.left + ',' + (margin.top + height) + ')')
	  .call(xAxis);

	var gY = svg.append('g')
	  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
	  .call(yAxis);

    points = points_g.selectAll("circle").data(data); // wbiw
	points = points.enter().append("circle")
		.attr('r', 25) // To be data driven...
		.attr('class','tweet-circle')
		.attr('fill','steelblue') //To be data driven
	    .attr('cx', function(d) {return xScale(d.d)})
	    .attr('cy', function(d) {return yScale(d.c)})
	    .on("click", handleClick)
	    .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);
	      
	// Pan and zoom
	var zoom = svg.call(d3.zoom()
	    .scaleExtent([.5, 2])
	    .extent([[0, 0], [width, height]])
	    .on("zoom", zoomed));

	function zoomed() {
		// create new scale ojects based on event
	    var new_xScale = d3.event.transform.rescaleX(xScale);
	    var new_yScale = d3.event.transform.rescaleY(yScale);
		
		// update axes
	    gX.call(xAxis.scale(new_xScale));
	    gY.call(yAxis.scale(new_yScale));
	    
        div.transition()
         .duration(100)
         .style("opacity",0)

	    points.data(data)
	     .attr('cx', function(d) {return new_xScale(d.d)})
	     .attr('cy', function(d) {return new_yScale(d.c)})
	}

	// document.getElementById('reset-zoom').addEventListener('click',function(e) {
	// 	console.log("Resetting Zoom?")  		
	// });

})

var div = d3.select("body").append("div")
      .attr('id', 'tooltip')
	  .attr("class", "tooltip")
	  .style("opacity", 0);
