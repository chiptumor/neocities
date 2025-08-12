{ /*** BANNER ***/
	const banner = document.getElementById("banner");
	const button = banner.querySelector("div.close");
	const openBanner = () => {
		if (window.event.button === 0) {
			banner.className = banner.className.replace("closed", "open");
		}
	};
	button.addEventListener("mousedown", function (e) {
		e.stopPropagation();
		if (window.event.button === 0) {
			banner.className = banner.className.replace("open", "closed");
		}
	});

	banner.addEventListener("mousedown", openBanner);
}

window.onload = async function() { /*** PFP ***/
	const aElement = document.getElementById("pfp");
	const imgElement = aElement.firstElementChild;
	const response = await fetch("external/pfp/index.json");
	const array = await response.json();
	const pfp = array[Math.floor(Math.random() * 14)];

	imgElement.setAttribute("style", `background-image: url(${pfp.path});`);
	aElement.setAttribute("title", pfp.artist);
	aElement.setAttribute("href", pfp.source);
};
