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
