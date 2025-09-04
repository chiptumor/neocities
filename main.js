const debug = false;

/*** BOYMODING ***/
if (debug && !new URLSearchParams(window.location.search).has("s") && window.location.hostname === "localhost")
	window.location.search = "?s&" + window.location.search.substring(1);
window.addEventListener("load", function() {
	if (new URLSearchParams(window.location.search).has("s"))
		document.body.classList = "sensitive";
});

/*** BANNER TOGGLE OPEN/CLOSE ***/
window.addEventListener("load", (e) => {
	const banner = document.getElementById("banner");
	const button = banner.querySelector("div.close > span");
	button.addEventListener("mousedown", function (e) {
		e.stopPropagation();
		if (e.button === 0) {
			banner.className = banner.className.replace("open", "closed");
		}
	});

	banner.addEventListener("mousedown", function (e) {
		if (e.button === 0) {
			banner.className = banner.className.replace("closed", "open");
		}
	});
});

/*** RANDOM PFP ***/
window.addEventListener("load", async () => {
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

/*** PALLETE ***/
window.addEventListener("load", () => {
	function toHex(el) {
		return "#"+(
			window.getComputedStyle(el)
				.getPropertyValue("background-color")
				.split("(")[1].split(")")[0].split(",")
				.map(x => Number(x).toString(16).padStart(2, "0"))
				.join("")
		);
	}
	const elements = document.querySelectorAll("#pallete div");
	for (const el of elements) {
		el.setAttribute("data-copy", toHex(el));
		el.setAttribute("data-title", toHex(el));
	}
});

/*** MUSIC PLAYER ***/
/// NOTE: AUTOPLAY IS QUIRKY
window.addEventListener("load", async () => {
	const box = document.getElementById("music").querySelector("& > div.content");
	const audio = box.querySelector("audio");
	
	const response = await fetch("global/playlist/index.json");
	const text = await response.text();
	const playlist = JSON5.parse(text);
	const array = (() => {
		const arr = [...Array(playlist.length).keys()];
		for (let x = arr.length - 1; x > 1; x--) {
			const y = Math.floor(Math.random() * x) + 1;
			[arr[x], arr[y]] = [arr[y], arr[x]];
		}
		return arr;
	})();
	
	function song(num) {
		return "/neocities/global/playlist/"+array[num]+".mp3";
	}
	
	const element = {
		"info": {
			"title": box.querySelector("div.info a.title"),
			"artist": box.querySelector("div.info a.artist"),
			"context": {
				"chip": box.querySelector("div.info a.chip"),
				"software": box.querySelector("div.info a.software")
			}
		},
		"controls": {
			"play": box.querySelector("div.controls div.media div.play-pause"),
			"prev": box.querySelector("div.controls div.media div.next-prev div.prev"),
			"next": box.querySelector("div.controls div.media div.next-prev div.next")
		},
		"duration": {
			"elapsed": box.querySelector("div.duration div.left span"),
			"remaining": box.querySelector("div.duration div.right > span > span.remaining"),
			"total": box.querySelector("div.duration div.right > span > span.total"),
			"progress": document.getElementById("music").querySelector("div.progress > div")
		}
	};
	
	const comment = {
		"title": [
			"Changing!",
			"Moving on!",
			"Skipping!",
			"Loadin'!",
			"Dickin' around!",
			"Waitin' for the fun of it!"
		],
		"artist": [
			"You hear that?",
			"Give me a moment.",
			"Give me a second.",
			"Hold your horses.",
			"Don't... Move... A muscle.",
			"Awh, it's over already?"
		]
	};
	
	const player = {
		"updateTime": () => {
			if (isNaN(audio.duration)) {
				element.duration.elapsed.innerText = "loading...";
				element.duration.remaining.innerText = "please";
				element.duration.total.innerText = "wait";
				element.duration.progress.style.width = "0%";
			} else {
				element.duration.elapsed.innerText = time(audio.currentTime);
				element.duration.remaining.innerText = time(audio.duration - audio.currentTime);
				element.duration.total.innerText = time(audio.duration);
				element.duration.progress.style.width = ((audio.currentTime / audio.duration) * 100) + "%";
			}
		},
		"updateInfo": () => {
			if (isNaN(audio.duration)) {
				element.info.title.querySelector("span").innerText = comment.title[Math.floor(Math.random() * comment.title.length)];
				element.info.title.setAttribute("href", "");
				element.info.artist.querySelector("span").innerText = comment.artist[Math.floor(Math.random() * comment.artist.length)];
				element.info.artist.setAttribute("href", "");
			} else {
			// TITLE
				element.info.title.querySelector("span").innerText = playlist[array[num]].title.text;
				element.info.title.setAttribute("href", playlist[array[num]].title.href);
			// ARTIST
				element.info.artist.querySelector("span").innerText = playlist[array[num]].artist.text;
				element.info.artist.setAttribute("href", playlist[array[num]].artist.href);
			// CONTEXT
				// nothing yet #lol
			}
		},
		"update": () => {
			player.updateInfo(); player.updateTime();
		},
		"skipTo": {
			"next": () => {
				if (num !== playlist.length - 1) num++;
					else num = 0;
				if (playlist[array[num]].skip) {
					player.skipTo.next(); return;
				}
				audio.src = song(num);
				audio.currentTime = 0;
				player.update();
				if (element.controls.play.classList.contains("playing"))
					audio.play();
			},
			"prev": () => {
				if (num !== 0) num = num - 1;
					else num = playlist.length - 1;
				if (playlist[array[num]].skip) {
					player.skipTo.prev(); return;
				}
				audio.src = song(num);
				audio.currentTime = 0;
				player.update();
				if (element.controls.play.classList.contains("playing"))
					audio.play();
			}
		},
		"autoplay": () => {
			if (num !== playlist.length - 1) num++;
				else num = 0;
			if (playlist[array[num]].skip) {
				player.skipTo.next(); return;
			}
			audio.src = song(num);
			audio.currentTime = 0;
			player.update();
			audio.play();
		}
	};
	
	function time(num) {
		num = Math.floor(Number(num));
		var sec = num % 60;
		if (sec < 10) {
			sec = "0" + sec;
		}
		const min = Math.floor(num / 60);
		return min+":"+sec;
	}
	
	audio.volume = 0.5;
	var num = 0;
	audio.src = song(num);
	
	audio.addEventListener("canplay", player.update);
	audio.addEventListener("timeupdate", player.updateTime);
	audio.addEventListener("ended", player.autoplay);
	audio.addEventListener("play", () => {
		element.controls.play.classList.replace("paused", "playing");
	});
	audio.addEventListener("pause", () => {
		element.controls.play.classList.replace("playing", "paused");
	});
	
	element.controls.prev.addEventListener("click", player.skipTo.prev);
	element.controls.next.addEventListener("click", player.skipTo.next);
	
	element.controls.play.addEventListener("click", () => {
		if (element.controls.play.classList.contains("paused")) {
			audio.play();
			element.controls.play.classList.replace("paused", "playing");
		}
		else if (element.controls.play.classList.contains("playing")) {
			audio.pause();
			element.controls.play.classList.replace("playing", "paused");
		}
	});
	
	navigator.mediaSession.setActionHandler("play", () => {audio.play();});
	navigator.mediaSession.setActionHandler("pause", () => {audio.pause();});
	navigator.mediaSession.setActionHandler("previoustrack", player.skipTo.prev);
	navigator.mediaSession.setActionHandler("nexttrack", player.skipTo.next);
});
