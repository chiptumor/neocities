// document.body.style.backgroundImage = wallpapers[Math.floor(Math.random() * comments.array.length)];

const button = document.getElementById("shortcut"); // shortcut button
const terminal = document.getElementById("terminal"); // terminal window
const overlay = document.getElementById("black"); // black overlay
let comment = "";

const delay = ms => new Promise(res => setTimeout(res, ms)); // delay function
const shortcut = async function() {
    button.removeEventListener("click", shortcut); // clicking on it more than once does nothing now
    button.classList = "selected"; // highlight shortcut for a moment
    document.body.style.cursor = "progress"; // fake loading cursor
    await delay(1000); // wait 1 sec
    document.body.className = "open"; // make window and taskbar icon visible
    button.classList = ""; // unhilight shortcut
    document.body.style.cursor = "default"; // set cursor back
    await delay(250); document.body.style.cursor = "wait"; // wait, hold on, lets do some stuff
    const xml = await gatherTheShits(); // parse xml
    document.body.style.cursor = "default"; // okay, cursor default again
    await logTheShits(xml); // show stuff on terminal
    // phony common fullscreen visual bug
    overlay.classList = "visible"; await delay(1000); overlay.classList = ""; await delay(100);
    overlay.classList = "visible"; await delay(250); overlay.classList = ""; await delay(50);
    terminal.innerText += "Redirecting...";
    overlay.classList = "visible"; await delay(100); overlay.classList = ""; await delay(250);
    overlay.classList = "visible"; await delay(1500);
    window.location.href = "https://chiptumor.github.io/neocities"; // redirect
};

async function gatherTheShits() {

    const comments = {};
    comments.file = await fetch("comments.json"); // get comments.json
    comments.array = await comments.file.json(); // use comments.json as a json
    comment = comments.array[Math.floor(Math.random() * comments.array.length)]; // get random comment

    const terminalXml = await fetch("terminal.xml"); // get terminal.xml
    const response = await terminalXml.text(); // get result as text
    const withComment = response.replace("[comment]", comment); // replace [comment] with random comment
    const parser = new DOMParser(); // parser for xml
    const xml = parser.parseFromString(`<root>${withComment}</root>`, "text/xml"); // parse xml with surrounding root node
    return xml.documentElement.childNodes; // return xml object
}

async function logTheShits(nodes) {
    for (const node of nodes) { // 'for each node:'
        if (node.nodeType === Node.ELEMENT_NODE) { // if node is an element
            switch (node.tagName) {
                case "log":
                    terminal.textContent += node.textContent + "\n"; break; // put dat text in da terminal
                case "wait":
                    await delay(parseFloat(node.textContent) * 1000); break; // wait alotted seconds
            }
        }
    }
}

button.addEventListener("dblclick", shortcut); // listen 4 2 click...
