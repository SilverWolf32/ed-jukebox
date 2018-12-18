/*
Load albums into album chooser, handle selection.
*/

let albumChooser = document.getElementById("album-chooser")

let dummyAlbums = [
	{
		"title": "Album 1",
		"artist": "Foo Bar",
		"songs": [
			"Song A",
			"Song B",
			"Song C"
		]
	},
	{
		"title": "Album 2",
		"artist": "Foo Bar",
		"songs": [
			"Song D",
			"Song E",
			"Song F"
		]
	},
	{
		"title": "Album 3",
		"artist": "Foo Bar",
		"songs": [
			"Song G",
			"Song H",
			"Song I"
		]
	},
	{
		"title": "Album 4",
		"artist": "Foo Bar",
		"songs": [
			"Song J",
			"Song K",
			"Song L"
		]
	},
	{
		"title": "Album 5",
		"artist": "Foo Bar",
		"songs": [
			"Song M",
			"Song N",
			"Song O"
		]
	},
	{
		"title": "Album 6",
		"artist": "Foo Bar",
		"songs": [
			"Song P",
			"Song Q",
			"Song R"
		]
	}
]

for (var i = 0; i < dummyAlbums.length; i++) {
	console.log(dummyAlbums[i])
	let album = dummyAlbums[i]
	
	let newAlbumItem = document.createElement("div")
	newAlbumItem.className = "album"
	
	let newImage = document.createElement("img")
	newImage.src = "icons/album.svg"
	newImage.draggable = false
	
	let title = document.createElement("span")
	title.className = "album-title"
	title.textContent = album.title
	
	let artist = document.createElement("span")
	artist.className = "album-artist"
	artist.textContent = album.artist
	
	newAlbumItem.appendChild(newImage)
	newAlbumItem.appendChild(title)
	newAlbumItem.appendChild(artist)
	
	// add data attributes
	newAlbumItem.setAttribute("data-editc-album-title", album.title)
	newAlbumItem.setAttribute("data-editc-album-artist", album.artist)
	newAlbumItem.setAttribute("data-editc-album-tracklist", JSON.stringify(album.songs))
	
	// set click action
	newAlbumItem.addEventListener("click", chooseAlbum, true) // event capturing: reverse responder chain
	
	albumChooser.appendChild(newAlbumItem)
}

function chooseAlbum(event) {
	let album = this
	let title = album.getAttribute("data-editc-album-title")
	let artist = album.getAttribute("data-editc-album-title")
	let tracks = JSON.parse(album.getAttribute("data-editc-album-tracklist"))
	
	debugger
	
	dismissAlbumChooser()
	
	setAvailableTracks(tracks)
}
