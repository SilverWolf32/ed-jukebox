// debugger

/* if (typeof require == "undefined") {
	// in browser, load jQuery JS
	// import jQuery as $ from "../node_modules/jquery/dist/jquery.min.js"
	// see https://stackoverflow.com/a/1140438/8365799
	// currently crashes in jQuery in Firefox
	var script = document.createElement("script")
	script.src = "../node_modules/jquery/dist/jquery.js"
	script.type = "text/javascript"
	document.getElementsByTagName("head")[0].appendChild(script)
} else {
	let $ = require('jquery')
} */

window.onload = function() {
	// debugger
	
	if (typeof require == "undefined") {
		// load dummy list for CSS testing
		let tracks = ["A", "B", "C", "D", "E"]
		let availableTracksContainer = document.getElementById("playlist-panel-full")
		let newHTML = document.createElement("table")
		for (var i = 0; i < tracks.length; i++) {
			let track = tracks[i]
			let row = document.createElement("tr")
			let col0 = document.createElement("td")
			let col1 = document.createElement("td")
			
			col0.className = "table-track-number"
			col1.className = "table-track-name"
			
			/* let log = Math.floor(Math.log10(i+1))
			var zeros = ""
			if (log < 2) {
				zeros = "0".repeat(2 - log)
			}
			col0.innerHTML = `${zeros}${i+1}` */
			col0.innerHTML = i+1
			
			col1.innerHTML = track
			
			row.appendChild(col0)
			row.appendChild(col1)
			newHTML.appendChild(row)
			// debugger
		}
		availableTracksContainer.appendChild(newHTML)

		return
	}
	
	let $ = require('jquery')
	
	$.getJSON('test-data/dummy-playlist.json', function(json) {
		// debugger
		
		// let tracks = JSON.parse(rawJSON.responseText)
		let tracks = json.tracks
		
		let availableTracksContainer = document.getElementById("playlist-panel-full")
		let newHTML = document.createElement("table")
		for (var i = 0; i < tracks.length; i++) {
			let track = tracks[i]
			let row = document.createElement("tr")
			let col0 = document.createElement("td")
			let col1 = document.createElement("td")
			
			col0.className = "table-track-number"
			col1.className = "table-track-name"
			
			/* let log = Math.floor(Math.log10(i+1))
			var zeros = ""
			if (log < 2) {
				zeros = "0".repeat(2 - log)
			}
			col0.innerHTML = `${zeros}${i+1}` */
			col0.innerHTML = i+1
			
			col1.innerHTML = track
			
			row.appendChild(col0)
			row.appendChild(col1)
			newHTML.appendChild(row)
			// debugger
		}
		availableTracksContainer.appendChild(newHTML)
	})
}