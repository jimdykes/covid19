/*
  SECTION I
  DATA PARSING AND CLEANING
*/
function parseData(data){
  //Build the data
  data.forEach(d=>{
    d.d = new Date(d.date),
    d.c = +d.count
  })
  return data
}

/*
  SECTION II
  INTERACTIONS
*/
function handleClick(d, i) {  // Add interactivity
    // console.log(d,i)
	
    div.transition()
       .duration(200)
       .style("opacity", .9);

    div.html(`<a class="link" target="_blank" href="https://twitter.com/i/web/status/${d.id}">View On Twitter</a>`)
       .style("left", (d3.event.pageX) + "px")
       .style("top", (d3.event.pageY - 28) + "px");
    
  }

function handleMouseOver(d, i) {
  console.warn('mouse over')

  document.getElementById('tweet-text').innerHTML = d.text
  // Use D3 to select element, change color back to normal

  // // Select text by id and then remove
  // d3.select("#t" + d.x + "-" + d.y + "-" + i).remove();  // Remove text location
}


function handleMouseOut(d, i) {
  console.log('mouseout')
    // Use D3 to select element, change color back to normal
    // d3.select(this).attr({
    //   fill: "black",
    //   r: radius
    // });

    // // Select text by id and then remove
    // d3.select("#t" + d.x + "-" + d.y + "-" + i).remove();  // Remove text location
  }

// .on("mouseover", function(d) {
// 	      	console.log(d)
// 	       
// 	     })
// 	     .on("mouseout", function(d) {
// 	       div.transition()
// 	         .duration(500)
// 	         .style("opacity", 0);
// 	     });

// 	    