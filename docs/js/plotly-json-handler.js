/*
  Jennings Anderson, Project EPIC (2020)
*/

//https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var PlotlyJSONHandler = function(tweets){

  function buildTweetTable(tweets){
    var tweetTable = document.getElementById('tweet-table');
    _.sortBy(Object.values(tweets),function(x){return x.rank}).forEach(function(t){
        var tr = document.createElement('tr');
        tr.innerHTML = '<td style="background-color:'+t.color+';">'+t.rank+'</td>'+
            '<td><a class="link" target="_blank" href="//twitter.com/'+t.user+'">@'+t.user+'</a></td>'+
            '<td>'+t.text+
            ' <a target="_blank" class="link" href="//twitter.com/i/web/status/'+t.id+'">[View on Twitter]</a>'+'</td>';
    tweetTable.appendChild(tr);
    })
  }

  var currentScreenName    = document.getElementById('currentScreenName');
  var currentFollowerCount = document.getElementById('currentFollowerCount');
  var currentTweetText     = document.getElementById('currentTweetText');

  var clickedScreenName    = document.getElementById('clickedScreenName');
  var clickedFollowerCount = document.getElementById('clickedFollowerCount');
  var clickedTweetText     = document.getElementById('clickedTweetText');
  var clickedTweetId       = document.getElementById('clickedTweetId');

  var plotDiv = document.getElementById('diffusion_graph_cumulative_followers');

  //First, load the data
  Plotly.d3.json(plotDiv.dataset.json, function(err, fig) {

    var plotDiv = document.getElementById('diffusion_graph_cumulative_followers');

    //Create cumulative follower plot
    Plotly.newPlot(plotDiv, fig.data, fig.layout);

    //Add interaction
    plotDiv.on('plotly_hover', function(data){

      const thisIndex = data.points[0].pointIndex;
      const seriesName = data.points[0].data.name
    
      currentScreenName.innerHTML = data.points[0].data.meta.u[thisIndex]
      currentFollowerCount.innerHTML = numberWithCommas(data.points[0].data.meta.f[thisIndex])
      currentTweetText.innerHTML = fig.tweets[seriesName].text
    })

    plotDiv.on('plotly_click', function(data){

      const thisIndex = data.points[0].pointIndex;
      const seriesName = data.points[0].data.name
      
      console.log(thisIndex, seriesName) 

      clickedScreenName.innerHTML = '<a class="link" target="_blank" href="//twitter.com/'+
                                    data.points[0].data.meta.u[thisIndex]+'">@'+
                                    data.points[0].data.meta.u[thisIndex]+'</a>'
      clickedFollowerCount.innerHTML = numberWithCommas(data.points[0].data.meta.f[thisIndex])
      clickedTweetText.innerHTML = fig.tweets[seriesName].text
      clickedTweetId.innerHTML = '<a class="link" target="_blank" href="//twitter.com/i/web/status/'+
                                    data.points[0].data.meta.i[thisIndex]+'">'+
                                    data.points[0].data.meta.i[thisIndex]+'</a>'
    })

    //build out tweet table
    buildTweetTable(fig.tweets);

    //Turn off loading ICON if we got all the way here
    var container = document.getElementsByClassName('container').item(1);
        container.className = 'container px12 py12'
  });
}

var runTime = new PlotlyJSONHandler();