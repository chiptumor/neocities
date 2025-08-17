/*** BANNER TOGGLE OPEN/CLOSE ***/
window.addEventListener("load", function() {
	const banner = document.getElementById("banner");
	const button = banner.querySelector("div.close > span");
	const openBanner = () => {
		if (window.event.button === 0) {
			banner.className = banner.className.replace("closed", "open");
		}
	};
	button.addEventListener("mousedown", function (e) {
		e.stopPropagation();
		if (e.button === 0) {
			banner.className = banner.className.replace("open", "closed");
		}
	});

	banner.addEventListener("mousedown", openBanner);
});

/*** RANDOM PFP ***/
window.addEventListener("load", async function() {
	const aElement = document.getElementById("pfp");
	const imgElement = aElement.firstElementChild;
	
	const response = await fetch("global/pfp/index.json");
	const text = await response.text();
	const array = await JSON5.parse(text);
	
	const number = Math.floor(Math.random() * 13);
	const pfp = array[number];
	imgElement.setAttribute("style", `background-image: url(global/pfp/${number}.png);`);
	aElement.setAttribute("title", pfp.artist);
	aElement.setAttribute("href", pfp.source);
});

/*** MUSIC PLAYER ***/
window.addEventListener("load", async function() {
	const player = document.getElementById("music").querySelector("& > div");
	const audio = player.querySelector("audio");
	
	player.querySelector('input[type="range"]').addEventListener('input', function() {
		this.style.setProperty("--progress-percent", (this.value - this.min) / (this.max - this.min) * 100 + "%");
	});

	const response = await fetch("global/playlist/index.json");
	const text = await response.text();
	const playlist = JSON5.parse(text);

	const info = {};
	info.title = player.querySelector("div.info > a.title > span");
	info.artist = player.querySelector("div.info > a.artist > span");

	const controls = {};
	controls.play = player.querySelector("div.controls > div.media > div.play-pause");
	controls.prev = player.querySelector("div.controls > div.media > div.next-prev > div.prev");
	controls.next = player.querySelector("div.controls > div.media > div.next-prev > div.next");

	const duration = {};
	duration.elapsed = player.querySelector("div.duration > div.left > span");
	duration.remaining = player.querySelector("div.duration > div.right > span > span.remaining");
	duration.total = player.querySelector("div.duration > div.right > span > span.total");
});
