const delay = ms => new Promise(res => setTimeout(res, ms));

/*** MENUBAR ***/
window.addEventListener("load", async function() {
	const menubar = document.getElementById("menubar");
	if (!menubar) { // Only run if element exists
		return;
	}
	
	const response = await fetch("/global/menubar.xml");
	const text = await response.text();
	menubar.innerHTML = await text;

	const windowPathTo = window.location.pathname;
	
	const windowPath = windowPathTo.substring(0, windowPathTo.lastIndexOf("index.html"));
	for (const node of menubar.querySelector("div.menu").querySelectorAll("a[href^='/'], div[data-href]")) {
		const attr = new URL((node.getAttribute("href") || node.getAttribute("data-href")), window.location.href);
		const attrPath = attr.pathname;

		if (windowPath === attrPath) {
			node.classList += " selected";
			return;
		}
	}
});

/*** CLICK-TO-COPY ***/
document.addEventListener("click", async function(e) {
	el = e.target.closest("[data-copy]");
	if (el) {
		const original = el.innerHTML;
		try {
			navigator.clipboard.writeText(el.getAttribute("data-copy"));
			el.innerHTML = "Copied!";
		} catch (e) {
			console.warn("Unable to copy text:\n"+e);
			el.innerHTML = "Failed";
		}
		await delay(1500);
		el.innerHTML = original;
	}
});

/*** TITLE ***/
window.addEventListener("load", function() {
	const el = document.getElementById("title");
	document.addEventListener("mousemove", function(e) {
		el.style.top = (e.clientY + 10) +"px";
		el.style.left = (e.clientX + 10) +"px";
		const title = e.target.closest("[data-title], [data-desc]")?.getAttribute("data-title") || "";
		const desc = e.target.closest("[data-title], [data-desc]")?.getAttribute("data-desc") || "";
		if (title || desc) {
			el.style.display = "block";
			el.querySelector("span.title").innerHTML = title;
			el.querySelector("span.desc").innerHTML = desc;
		} else {
			el.style.display = "none";
			el.querySelector("span.title").innerHTML = "";
			el.querySelector("span.desc").innerHTML = "";
		}
	});
});
