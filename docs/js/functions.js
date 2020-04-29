/*
  SECTION I
  DATA PARSING AND CLEANING
*/

var distinctTweetIDsList
function parseData(data){
  var distinctTweetIDs = new Set()
  //Build the data
  var to_return = []
  console.log(data.length)
  data.forEach(function(d){
    // if (d.retweeted_status_id == 1253995619921821700){
      if (d.followers_count > 1000){
        to_return.push({
          d: new Date(d.created_at),
          v: +d.followers_count_cumsum,
          f: +d.followers_count,
          r: d.retweeted_status_id,
          id: d.id
        })
      }
      
    // }
    
    distinctTweetIDs.add(d.retweeted_status_id)
  })

  console.log(distinctTweetIDs)
  distinctTweetIDsList = Array.from(distinctTweetIDs)

  console.log(to_return.length)

  return to_return;
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

  document.getElementById('tweet-text').innerHTML = `${d.f}, ${d.id}`
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