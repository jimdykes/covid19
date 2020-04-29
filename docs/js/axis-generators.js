
function TimeLineXAxis(opts){

	// What are a few constants?
	this.min = opts.min/1000;
	this.max = opts.max/1000;
	this.origin = opts.origin;

	this.total_seconds = (this.max-this.min)


	this.buildStops = function(zoom){

		// totalStops  = this.total_seconds / currentStep


		var stepVal = 3600*24 //1 hour steps`

		points = []

		for(var i=this.min; i<this.max; i+=stepVal){
			
			points.push({
				'type':"Feature",
				'properties': {
					'l':new Date(i*1000)
				},
				'geometry':{
					'type':"Point",
					'coordinates':[this.origin[0] + (i / 10000000), this.origin[1]]
				}
			})
		}	

		console.log(points)


		return {
			'type':'FeatureCollection',
			'features':points
		}	
		
		// At any given zoom, we need to define the distance that we want for labeling the axis, down to seconds

		



		// console.warn


	}



}