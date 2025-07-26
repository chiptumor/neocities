{ /*** BANNER ***/
	const banner = document.getElementById("banner");
	const button = banner.querySelector("div.close");
	const openBanner = () => {
		banner.className = banner.className.replace("closed", "open");
	};
	button.addEventListener("click", function (e) {
		e.stopPropagation();
		banner.className = banner.className.replace("open", "closed");
	});

	banner.addEventListener("click", openBanner);
}
