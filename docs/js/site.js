// dimensions and margins
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

	if(err) throw err

	//Build the data
	data.forEach(d=>{
		d.d = new Date(d.date),
		d.c = +d.count
	})

	// create scale objects
	var xScale = d3.scaleTime()
	  .domain(d3.extent(data,function(d){return d.d}))
	  .range([0, width]);

	var yScale = d3.scaleLinear()
	  .domain(d3.extent(data,function(d){return d.c}))
	  .range([height, 0]);

	// create axis objects

var xAxis = d3.axisBottom(xScale)
  // .ticks(20);
var yAxis = d3.axisLeft(yScale)
  // .ticks(20, "s");
// Draw Axis

var gX = svg.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + (margin.top + height) + ')')
  .call(xAxis);
var gY = svg.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .call(yAxis);

    points = points_g.selectAll("circle").data(data);
	points = points.enter().append("circle")
	      .attr('cx', function(d) {return xScale(d.d)})
	      .attr('cy', function(d) {return yScale(d.c)})
	      .attr('r', 5);
	      
	// Pan and zoom
	var zoom = d3.zoom()
	    .scaleExtent([.5, 20])
	    .extent([[0, 0], [width, height]])
	    .on("zoom", zoomed);

	var gElem = svg.append("rect")
	    .attr("width", width)
	    .attr("height", height)
	    .style("fill", "none")
	    .style("pointer-events", "all")
	    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
	    .call(zoom);

	function zoomed() {
		// create new scale ojects based on event
	    var new_xScale = d3.event.transform.rescaleX(xScale);
	    var new_yScale = d3.event.transform.rescaleY(yScale);
		
		// update axes
	    gX.call(xAxis.scale(new_xScale));
	    gY.call(yAxis.scale(new_yScale));
	    
	    points.data(data)
	     .attr('cx', function(d) {return new_xScale(d.d)})
	     .attr('cy', function(d) {return new_yScale(d.c)});
	}

	document.getElementById('reset-zoom').addEventListener('click',function(e) {
  		gElem.transition()
          .duration(750)
          .call(zoom.transform, d3.zoomIdentity);
	});

})

