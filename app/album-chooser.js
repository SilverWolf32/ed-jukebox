/*
Load albums into album chooser, handle selection.
*/

let albumChooser = document.getElementById("album-chooser")

let dummyAlbums = [
	{
		"name": "Album 1",
		"artist": "Foo Bar",
		"songs": [
			"Song A",
			"Song B",
			"Song C"
		]
	},
	{
		"name": "Album 2",
		"artist": "Foo Bar",
		"songs": [
			"Song D",
			"Song E",
			"Song F"
		]
	},
	{
		"name": "Album 3",
		"artist": "Foo Bar",
		"songs": [
			"Song G",
			"Song H",
			"Song I"
		]
	},
	{
		"name": "Album 4",
		"artist": "Foo Bar",
		"songs": [
			"Song J",
			"Song K",
			"Song L"
		]
	},
	{
		"name": "Album 5",
		"artist": "Foo Bar",
		"songs": [
			"Song M",
			"Song N",
			"Song O"
		]
	},
	{
		"name": "Album 6",
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
	title.textContent = album.name
	
	let artist = document.createElement("span")
	artist.className = "album-artist"
	artist.textContent = album.artist
	
	newAlbumItem.appendChild(newImage)
	newAlbumItem.appendChild(title)
	newAlbumItem.appendChild(artist)
	
	albumChooser.appendChild(newAlbumItem)
}