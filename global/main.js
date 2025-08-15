/*** MENUBAR ***/
window.addEventListener("load", async function() {
	const menubar = document.getElementById("menubar");
	if (!menubar) { // Only run if element exists
		return;
	}
	
	const response = await fetch("/external/menubar.xml");
	const text = await response.text();
	menubar.innerHTML = text;
	
	const locPath = window.location.pathname;
	for (const node of menubar.querySelectorAll("a[href^=/]")) {
		const href = URL(node.getAttribute("href"));
		const hrefPath = href.pathname;
		if (locPath === hrefPath) {
			node.classList += " selected";
			return;
		}
	}
});

/*** CLICK-TO-COPY ***/
window.addEventListener("load", function() {
	for (const node of document.querySelectorAll("[data-copy]") {
		node.addEventListener("click", function() {
			navigator.clipboard.writeText(node.getAttribute("data-copy"));
		}
	}
});