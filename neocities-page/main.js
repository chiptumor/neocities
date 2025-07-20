document.body.style.backgroundImage = [Math.floor(Math.random() * comments.array.length)];

const button = document.getElementById("shortcut"); // shortcut button
let comment = "";

const delay = ms => new Promise(res => setTimeout(res, ms)); // delay function
const shortcut = async function() {
    button.removeEventListener("click", shortcut); // clicking on it more than once does nothing now
    document.body.style.cursor = "progress"; // fake loading cursor
    await delay(1000); // wait 1 sec
    document.body.className = "open"; // make window and taskbar icon visible
    document.body.style.cursor = "default"; // set cursor back
    await delay(250); document.body.style.cursor = "wait"; // wait, hold on, lets do some stuff
    const xml = await gatherTheShits(); // parse xml
    document.body.style.cursor = "default"; // okay, cursor default again
    await logTheShits(xml);
    window.location.href = "https://chiptumor.github.io/neocities";
};

async function gatherTheShits() {
    const terminal = document.getElementById("terminal");

    const comments = {};
    comments.file = await fetch("comments.json");
    comments.array = await comments.file.json();
    comment = comments.array[Math.floor(Math.random() * comments.array.length)];

    const terminalXml = await fetch("terminal.xml");
    const response = await terminalXml.text();
    const withComment = response.replace("[comment]", comment);
    const parser = new DOMParser();
    const xml = parser.parseFromString(`<root>${withComment}</root>`, "text/xml");
    return xml.documentElement.childNodes;
}

async function logTheShits(nodes) {
    for (const node of nodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            switch (node.tagName) {
                case "log":
                    let text = node.textContent;
                    /*if (text.includes("[comment]")) {
                        text = text.replace("[comment]", comment);
                    }*/
                    terminal.textContent += text + "\n";
                break; case "wait":
                    const time = parseFloat(node.textContent) * 1000;
                    await delay(time);
                break;
            }
        }
    }
}

button.addEventListener("click", shortcut);
