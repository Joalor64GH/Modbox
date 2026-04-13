const textInput = document.getElementById("titleText");
const notesToggle = document.getElementById("notesToggle");
const svgContent = document.getElementById("svgContent");
const cssOutput = document.getElementById("cssOutput");
const sizeSlider = document.getElementById("sizeSlider");

const sizeValue = document.getElementById("sizeValue");
const previewSvg = document.getElementById("previewSvg");

sizeSlider.addEventListener("input", () => {
    sizeValue.textContent = `${Number(sizeSlider.value).toFixed(2)}×`;
    updatePreview();
});

sizeValue.textContent = "1.00×";

const INCREDIBOX_NOTES_PATHS = `
<g transform="translate(-377, 41)">
  <path fill="currentColor" d="M388.5,5.5l-12.6,1.7c-0.1,0-0.2,0.1-0.2,0.2l-0.1,8.8c-0.2-0.1-0.5-0.1-0.7-0.1c-1.6,0-2.9,1.3-2.9,2.9
    c0,1.6,1.3,3,2.9,3l0,0c1.6,0,2.9-1.3,2.9-2.9l0.1-8.2l8.5-1.1v4.7c-0.2-0.1-0.5-0.1-0.7-0.1c-1.6,0-2.9,1.3-2.9,2.9
    c0,1.6,1.3,2.9,2.9,2.9c1.6,0,2.9-1.3,2.9-2.9l0.1-11.7c0-0.2-0.1-0.3-0.3-0.3z"/>
  <path fill="currentColor" d="M404.8,0.5c-0.1,0-0.1-0.1-0.2-0.1l-8.5,1.2c-0.1,0-0.2,0.1-0.2,0.2v5.9c-0.1,0-0.3,0-0.4,0
    c-1.1,0-2.1,0.9-2.1,2.1s0.9,2.1,2.1,2.1l0,0c1.1,0,2-0.9,2.1-2.1V4.3l5.6-0.7v3c-0.1,0-0.3,0-0.4,0c-1.1,0-2.1,0.9-2.1,2.1
    s0.9,2.1,2.1,2.1c1.1,0,2-0.9,2.1-2l0-7.9c0-0.2-0.1-0.3-0.2-0.3z"/>
</g>
`;

function updatePreview(color = "#000") {
    const text = textInput.value || "Title";

    svgContent.innerHTML = "";

    const textEl = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
    );

    textEl.setAttribute("x", "0");
    textEl.setAttribute("y", "62");
    textEl.setAttribute("font-size", "56");
    textEl.setAttribute("font-family", "Allan");
    textEl.setAttribute("fill", color);
    textEl.textContent = text;

    svgContent.appendChild(textEl);

    const textWidth = textEl.getComputedTextLength();

    if (notesToggle.checked) {
        const notesGroup = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );
        notesGroup.innerHTML = INCREDIBOX_NOTES_PATHS;
        const scale = 0.5;
        notesGroup.setAttribute(
            "transform",
            `translate(${textWidth + 6}, 0) scale(${scale})`
        );
        notesGroup.setAttribute("color", color);
        svgContent.appendChild(notesGroup);
    }

    const svg = document.getElementById("previewSvg");
    const content = document.getElementById("svgContent");

    const bbox = content.getBBox();

    const PADDING = 6;

    svg.setAttribute(
        "viewBox",
        `
    ${bbox.x - PADDING}
    ${bbox.y - PADDING}
    ${bbox.width + PADDING * 2}
    ${bbox.height + PADDING * 2}
    `
    );

    const scale = parseFloat(sizeSlider.value);

    const [vx, vy, vw, vh] = svg
        .getAttribute("viewBox")
        .trim()
        .split(/\s+/)
        .map(Number);

    svg.style.width = `${vw * scale}px`;
    svg.style.height = `${vh * scale}px`;

}

[textInput, notesToggle].forEach(el =>
    el.addEventListener("input", () => updatePreview())
);

updatePreview();

function exportSVGs() {
    const title = (textInput.value || "title").toLowerCase().replace(/\s+/g, "-");

    const lightSVG = generateSVG("#000");
    const darkSVG = generateSVG("#fff");

    download(`${title}-title.svg`, lightSVG);
    download(`${title}-title-darkmode.svg`, darkSVG);

    const svg = document.getElementById("previewSvg");
    const [, , , viewBoxHeight] = svg
        .getAttribute("viewBox")
        .trim()
        .split(/\s+/)
        .map(Number);

    const svgHeight = viewBoxHeight;

    cssOutput.textContent =
        `#sp-intro #sp-title {
  position: absolute;
  top: calc(50% - calc(var(--sp-intro-scale) * 115px));
  width: 100%;
  height: calc(var(--sp-intro-scale) * ${svgHeight}px);
  pointer-events: none;
  background-image: url(../img/${title}-title.svg);
  background-repeat: no-repeat;
  background-position: calc(50% + calc(var(--sp-intro-scale) * 20px)) center;
  transform: translate(0, 0);
  right: 14px;
}
  
.darkmode #sp-intro #sp-title {
  background-image: url(../img/${title}-title-darkmode.svg);
}`;
}

function generateSVG(color) {
    const svg = document.getElementById("previewSvg");

    updatePreview(color);

    const [vx, vy, vw, vh] = svg
        .getAttribute("viewBox")
        .trim()
        .split(/\s+/)
        .map(Number);

    const scale = parseFloat(sizeSlider.value);

    svg.setAttribute("width", vw * scale);
    svg.setAttribute("height", vh * scale);

    const output = new XMLSerializer().serializeToString(svg);

    svg.removeAttribute("width");
    svg.removeAttribute("height");

    return output;
}

function download(filename, content) {
    const blob = new Blob([content], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
}