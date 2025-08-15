const menubar = document.getElementById("menubar");
window.onload = async function() {
	const response = await fetch("/external/menubar.xml");
	const text = await response.text();
	menubar.innerHTML = text;
}

const locPath = window.location.pathname;
for (const node of menubar.querySelectorAll("a[href^=/]")) {
	const href = URL(node.getAttribute("href"));
	const hrefPath = href.pathname;
	if (locPath === hrefPath) {
		node.classList += " selected";
		return;
	}
}