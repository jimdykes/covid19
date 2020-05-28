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

const urlParams = new URLSearchParams(window.location.search);

const dataPath = urlParams.get('data') || '/' //'https://epic-covid19.storage.googleapis.com/diffusion-graphs/'

var STATE = {}

var layoutExtras = {
    displayModeBar: false}
//     displaylogo: false,
//     modeBarButtonsToRemove: ['toImage','hoverClosestCartesian','hoverCompareCartesian','toggleSpikelines', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d']}

var PlotlyJSONHandler = function(tweets){

  var plotDiv = document.getElementById('diffusion_graph');

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

    
  //First, load the data
  Plotly.d3.json(dataPath + plotDiv.dataset.json, function(err, fig) {

  // Plotly.d3.json('http://epic.tweetsonamap.com/covid19-static-pages/docs/' + plotDiv.dataset.json, function(err, fig) {

    // Create cumulative follower plot with defaults
    Plotly.react(plotDiv, fig.data, fig.layout, layoutExtras);
            
    // Build out tweet table
    buildTweetTable(fig.tweets);
      
    //Create copies of the data upfront: 
    var datasets = {
        'cumulative_followers_with_self_retweets': {
            "data"   : JSON.parse(JSON.stringify(fig.data)),
            "layout" : JSON.parse(JSON.stringify(fig.layout))
        },
        'retweet_count':{
            "data"   : JSON.parse(JSON.stringify(fig.data)),
            "layout" : JSON.parse(JSON.stringify(fig.layout))
        }
    }

    // Work horse
    var idx=0;

    var hasRetweets = false;

    fig.data.forEach(function(d){
        
      var addValue, sRTDate;
      if (fig.tweets[d.name]['self-rt'].length){
        addValue = fig.tweets[d.name]['self-rt'][0].subValue;
        sRTDate  = fig.tweets[d.name]['self-rt'][0].x;

        if (!hasRetweets){
          hasRetweets = true;
        }
      }

      for(var i=0;i< d.x.length+1;i++){

        datasets.retweet_count.data[idx].y[i] = i+1;
        
        if (addValue && sRTDate){
          if (d.x[i] >= sRTDate){              
            datasets.cumulative_followers_with_self_retweets.data[idx].y[i] += addValue;
          }
        } 
      }
      idx++;
    })
    
    //Update layouts? 
    datasets.retweet_count.layout.yaxis.title.text = "Total Retweet Count"
    datasets.cumulative_followers_with_self_retweets.layout.yaxis.title.text = "Cumulative Potential Impressions"

    //Add interaction
    plotDiv.on('plotly_hover', function(data){

      const thisIndex  = data.points[0].pointIndex;
      const seriesName = data.points[0].data.name
    
      currentScreenName.innerHTML = '<a href="https://twitter.com/'+data.points[0].data.meta.u[thisIndex] +
      '" target="_blank" class="username link">'+data.points[0].data.meta.u[thisIndex] + "</a>"
      currentFollowerCount.innerHTML = numberWithCommas(data.points[0].data.meta.f[thisIndex])
      currentTweetText.innerHTML = '<a href="https://twitter.com/i/web/status/'+fig.tweets[seriesName].id +
      '" target="_blank" class="username link">'+fig.tweets[seriesName].user + "</a> | " + fig.tweets[seriesName].text
      
    })

    // plotDiv.on('plotly_click', function(data){

    //   const thisIndex = data.points[0].pointIndex;
    //   const seriesName = data.points[0].data.name
      
    //   console.log(thisIndex, seriesName) 

    //   clickedScreenName.innerHTML = '<a class="link" target="_blank" href="//twitter.com/'+
    //                                 data.points[0].data.meta.u[thisIndex]+'">@'+
    //                                 data.points[0].data.meta.u[thisIndex]+'</a>'
    //   clickedFollowerCount.innerHTML = numberWithCommas(data.points[0].data.meta.f[thisIndex])
    //   clickedTweetText.innerHTML = fig.tweets[seriesName].text
    // })


//  And add our event listeners
    document.getElementById('by-count').addEventListener('change', function(e){
      document.getElementById('by-exposure-description').style.display='none';
      document.getElementById('by-count-description').style.display='block';
      Plotly.react(plotDiv, datasets.retweet_count.data, datasets.retweet_count.layout, layoutExtras);  
    })

    if (hasRetweets){
      var includeRetweets=true;
      document.getElementById('selfRetweetSwitch').addEventListener('change', function(e){
        if (this.checked){
          includeRetweets=true;
          Plotly.react(plotDiv, 
             datasets.cumulative_followers_with_self_retweets.data, 
             datasets.cumulative_followers_with_self_retweets.layout, layoutExtras);
        }else{
          includeRetweets=false;
          Plotly.react(plotDiv, fig.data, fig.layout, layoutExtras);
        }
      });
    }else{
      console.log("No retweets, hiding switch")
      document.getElementById('includeSRT').style.display = 'none';
    }

    document.getElementById('by-exposure').addEventListener('change', function(e){
      document.getElementById('by-exposure-description').style.display='block';
      document.getElementById('by-count-description').style.display='none';
        
      if (includeRetweets){
          Plotly.react(plotDiv, 
                       datasets.cumulative_followers_with_self_retweets.data, 
                       datasets.cumulative_followers_with_self_retweets.layout,
                      layoutExtras);
      }else{
          Plotly.react(plotDiv, fig.data, fig.layout,layoutExtras);
      }
    })
    
    //Turn off loading ICON if we got all the way here
    var container = document.getElementsByClassName('container').item(1);
        container.className = 'container px12 py12'      

    var buttons = document.getElementsByClassName('tweetIDButton'); 
    
    for (let button of buttons) {
      button.addEventListener('click',function(e){
        const tID = this.dataset.id;
        const tRank = Number(this.dataset.rank)-1;
        console.log(tID, tRank)
        console.log(STATE)

        if (STATE.toggleRank == tRank){
          var vals = plotDiv.data.map((_, i) => 1 )
          Plotly.restyle(plotDiv, 'opacity', vals);
          STATE.toggleRank = undefined;
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