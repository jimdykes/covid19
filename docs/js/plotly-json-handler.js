/*
  Jennings Anderson, Project EPIC (2020)
*/

//https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function clickTweetInTable(tweetID){
  console.log(tweetID)
}

var STATE = {}

var PlotlyJSONHandler = function(tweets){

  function buildTweetTable(tweets){
    var tweetTable = document.getElementById('tweet-table-body');
    _.sortBy(Object.values(tweets),function(x){return x.rank}).forEach(function(t){
        var tr = document.createElement('tr');
        tr.innerHTML = '<td class="cursor-pointer tweetIDButton" data-id="'+t.id+'" data-rank="'+t.rank+
            '" style="background-color:'+t.color+';">'+t.rank+'</td>'+
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

  var plotDiv = document.getElementById('diffusion_graph');

  //First, load the data
  Plotly.d3.json('https://epic-covid19.storage.googleapis.com/diffusion-graphs/' + plotDiv.dataset.json, function(err, fig) {

    // console.log(fig.layout)

    //Create cumulative follower plot
    Plotly.react(plotDiv, fig.data, fig.layout);

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


    /* Create a copy and make a new plot for simple counts */
    var nonCumulativeData = [];
    fig.data.forEach(function(d){
      var newData = JSON.parse(JSON.stringify(d))
      newData.y = []
      for(var i=1;i<newData.x.length+1;i++){
        newData.y.push(i)
      }
      // newData.marker.line.width = 0;
      nonCumulativeData.push(newData)
    })

    // console.log(nonCumulativeData)

    var nonCumulativeLayout = JSON.parse(JSON.stringify(fig.layout)) //a favorite

    nonCumulativeLayout.yaxis.title.text = "Total Retweet Count"

    //And add our event listeners
    document.getElementById('by-count').addEventListener('change', function(e){
      document.getElementById('by-exposure-description').style.display='none';
      document.getElementById('by-count-description').style.display='block';
      Plotly.react(plotDiv, nonCumulativeData, nonCumulativeLayout);  
    })

    document.getElementById('by-exposure').addEventListener('change', function(e){
      document.getElementById('by-exposure-description').style.display='block';
      document.getElementById('by-count-description').style.display='none';
      Plotly.react(plotDiv, fig.data, fig.layout);
    })

    var buttons = document.getElementsByClassName('tweetIDButton'); 
    // STATE
    for (let button of buttons) {
      button.addEventListener('click',function(e){
        const tID = this.dataset.id;
        const tRank = Number(this.dataset.rank)-1;
        console.log(tID, tRank)

        if (STATE.toggleRank == tRank){
          var vals = plotDiv.data.map((_, i) => 1 )
          Plotly.restyle(plotDiv, 'opacity', vals);  
        }else{
          STATE.toggleRank = tRank
          var vals = plotDiv.data.map((_, i) => i === tRank ? 1 : 0)
          Plotly.restyle(plotDiv, 'opacity', vals);
        }
      })
    }


    plotDiv.on('plotly_legenddoubleclick',function(e){
      console.log(e)
    })

  });
}

var runTime = new PlotlyJSONHandler();