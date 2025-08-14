/*** BANNER ***/
{
	const banner = document.getElementById("banner");
	const button = banner.querySelector("div.close > span");
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

/*** PFP ***/
window.onload = async function() {
	const aElement = document.getElementById("pfp");
	const imgElement = aElement.firstElementChild;
	const response = await fetch("external/pfp/index.json");
	const text = await response.text();
	const array = await JSON5.parse(text);
	const number = Math.floor(Math.random() * 14);
	const pfp = array[number];

	imgElement.setAttribute("style", `background-image: url(external/pfp/${number}.png);`);
	aElement.setAttribute("title", pfp.artist);
	aElement.setAttribute("href", pfp.source);
};
