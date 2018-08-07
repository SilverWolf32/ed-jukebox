// debugger;

if (typeof require == "undefined") {
	// in browser, load jQuery JS
	// import jQuery as $ from "../node_modules/jquery/dist/jquery.min.js";
	// see https://stackoverflow.com/a/1140438/8365799
	// currently crashes in jQuery in Firefox
	var script = document.createElement("script");
	script.src = "../node_modules/jquery/dist/jquery.js";
	script.type = "text/javascript";
	document.getElementsByTagName("head")[0].appendChild(script);
} else {
	let $ = require('jquery');
}

window.onload = function() {
	debugger;
	let jQueryJSON = $.getJSON('test-data/dummy-playlist.json');
	let rawJSON = jQueryJSON.responseText;
	let tracks = JSON.parse(rawJSON);
	
	let availableTracksContainer = document.getElementById("playlist-panel-exploration");
	availableTracksContainer.innerHTML = "<ul>\n"
	for (track in tracks) {
		availableTracksContainer.innerHTML += "\t<li>" + track + "</li>\n"
	}
	availableTracksContainer.innerHTML += "</ul>"
};