var debug = false;

window.addEventListener("load", ()=>{
	if (debug) document.body.setAttribute("data-debug", "true");
});

const delay = ms => new Promise(res => setTimeout(res, ms));

/*** CONSOLE ***/
if (debug) window.addEventListener("error", e => {
	const el = document.getElementById("console");
	if (el) el.innerHTML +=
		`<div class="error">"${e.message}" (${e.lineno}:${e.colno})\n`
		+ `ERROR: ${JSON.stringify(e, null, 4)}`;
});
const con = {
	"log": function () {
		console.log.apply(window, arguments);
		document.getElementById("console").innerHTML += `<div class="log">"${Array.prototype.slice.call(arguments).join('", "')}"</div>`;
	},
	"debug": function () {
		console.debug.apply(window, arguments);
		document.getElementById("console").innerHTML += `<div class="debug">"${Array.prototype.slice.call(arguments).join('", "')}"</div>`;
	},
	"info": function () {
		console.info.apply(window, arguments);
		document.getElementById("console").innerHTML += `<div class="info">"${Array.prototype.slice.call(arguments).join('", "')}"</div>`;
	},
	"warn": function () {
		console.warn.apply(window, arguments);
		document.getElementById("console").innerHTML += `<div class="warn">"${Array.prototype.slice.call(arguments).join('", "')}"</div>`;
	},
	"error": function () {
		console.error.apply(window, arguments);
		document.getElementById("console").innerHTML += `<div class="error">"${Array.prototype.slice.call(arguments).join('", "')}"</div>`;
	}
};

/*** LUCIDE SVG ICONS ***/
window.addEventListener("load", lucide.createIcons);

/*** MENUBAR ***/
window.addEventListener("load", async function() {
	const menubar = document.getElementById("menubar");
	if (!menubar) { // Only run if element exists
		return;
	}
	
	const response = await fetch("/neocities/global/menubar.xml").then(e=>e.text());
	menubar.innerHTML = response;

	const windowPathTo = window.location.pathname;
	
	const windowPath = windowPathTo.substring(0, windowPathTo.lastIndexOf("index.html"));
	for (const node of menubar.querySelector("div.menu").querySelectorAll("a[href^='/'], div[data-href]")) {
		const attr = new URL((node.getAttribute("href") || node.getAttribute("data-href")), window.location.href);
		const attrPath = attr.pathname;

		if (windowPath === attrPath) {
			node.classList.add("selected");
			break;
		}
	}
});

/*** TITLE ***/
window.addEventListener("load", function() {
	const el = document.getElementById("title");
	document.addEventListener("mousemove", function(e) {
		el.style.top = (e.clientY + 20) +"px";
		el.style.left = (e.clientX) +"px";
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

/*** CLICK-TO-COPY ***/
window.addEventListener("click", async function(e) {
	el = e.target.closest("[data-copy]");
	const title = document.getElementById("title").querySelector("span.title");
	if (el) {
		const original = el.innerHTML;
		try {
			navigator.clipboard.writeText(el.getAttribute("data-copy"));
			title.innerHTML = "Copied!";
		} catch (e) {
			console.warn("Unable to copy text:\n"+e);
			title.innerHTML = "Failed";
		}
		await delay(1500);
		el.innerHTML = original;
	}
});
