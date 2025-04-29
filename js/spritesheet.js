let HEAD_WIDTH = 164;
let HEAD_HEIGHT = 199;
let BODY_WIDTH = 164;
let BODY_HEIGHT = 380;
let HEADS_PER_ROW = 6;

function openSettings() {
    document.getElementById('settings-popup').classList.remove('hidden');
}

function closeSettings() {
    document.getElementById('settings-popup').classList.add('hidden');
}

function applySettings() {
    const headWidthInput = document.getElementById('headWidth').value;
    const headHeightInput = document.getElementById('headHeight').value;
    const bodyWidthInput = document.getElementById('bodyWidth').value;
    const bodyHeightInput = document.getElementById('bodyHeight').value;
    const headsPerRowInput = document.getElementById('headsPerRow').value;

    HEAD_WIDTH = parseInt(headWidthInput, 10) || HEAD_WIDTH;
    HEAD_HEIGHT = parseInt(headHeightInput, 10) || HEAD_HEIGHT;
    BODY_WIDTH = parseInt(bodyWidthInput, 10) || BODY_WIDTH;
    BODY_HEIGHT = parseInt(bodyHeightInput, 10) || BODY_HEIGHT;
    HEADS_PER_ROW = parseInt(headsPerRowInput, 10) || HEADS_PER_ROW;

    closeSettings();
}

function handleFileInputChange() {
    const headsCount = document.querySelector("#headInput").files.length;
    const bodiesCount = document.querySelector("#bodyInput").files.length;

    const shouldShowButtons = headsCount > 0 && bodiesCount > 0;
    document.querySelector("#generate-bt").style.display = shouldShowButtons ? "block" : "none";
    document.querySelector("#generateHD-bt").style.display = shouldShowButtons ? "block" : "none";
    document.querySelector("#note").style.display = shouldShowButtons ? "none" : "block";
}

document.querySelector("#bodyInput").addEventListener("change", handleFileInputChange);
document.querySelector("#headInput").addEventListener("change", handleFileInputChange);

function loadImage(file, index, imagesArray, onAllImagesLoaded) {
    const img = new Image();
    img.onload = () => {
        imagesArray[index] = img;
        if (imagesArray.filter(Boolean).length === imagesArray.length) {
            onAllImagesLoaded();
        }
    };
    img.src = URL.createObjectURL(file);
}

function createSpritesheet(isHD = false) {
    const bodyInput = document.getElementById("bodyInput");
    const headInput = document.getElementById("headInput");
    const bodyFiles = Array.from(bodyInput.files).reverse();
    const headFiles = Array.from(headInput.files).reverse();

    if (bodyFiles.length === 0 || headFiles.length === 0) {
        alert('Upload at least one body and one head image!');
        return;
    }

    const bodyImages = new Array(bodyFiles.length);
    const headImages = new Array(headFiles.length);

    const onAllImagesLoaded = () => {
        createAndDownloadSpritesheet(bodyImages, headImages, isHD);
    };

    bodyFiles.forEach((file, index) => loadImage(file, index, bodyImages, onAllImagesLoaded));
    headFiles.forEach((file, index) => loadImage(file, index, headImages, onAllImagesLoaded));
}

document.getElementById("generateHD-bt").addEventListener("click", () => createSpritesheet(true));
document.getElementById("generate-bt").addEventListener("click", () => createSpritesheet(false));

function createAndDownloadSpritesheet(bodyImages, headImages, isHD = false) {
    const canvas = document.getElementById("spriteCanvas");
    const ctx = canvas.getContext("2d");

    const scaleFactor = isHD ? 2 : 1;
    const totalWidth = Math.max(
        bodyImages.length * BODY_WIDTH,
        HEADS_PER_ROW * HEAD_WIDTH
    ) * scaleFactor;
    const totalHeight =
        (BODY_HEIGHT + Math.ceil(headImages.length / HEADS_PER_ROW) * HEAD_HEIGHT) *
        scaleFactor;

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    let xOffset = 0;
    bodyImages.forEach((img) => {
        ctx.drawImage(
            img,
            xOffset,
            0,
            BODY_WIDTH * scaleFactor,
            BODY_HEIGHT * scaleFactor
        );
        xOffset += BODY_WIDTH * scaleFactor;
    });

    let headXOffset = 0;
    let headYOffset = BODY_HEIGHT * scaleFactor;
    headImages.forEach((img, index) => {
        ctx.drawImage(
            img,
            headXOffset,
            headYOffset,
            HEAD_WIDTH * scaleFactor,
            HEAD_HEIGHT * scaleFactor
        );
        headXOffset += HEAD_WIDTH * scaleFactor;
        if ((index + 1) % HEADS_PER_ROW === 0) {
            headXOffset = 0;
            headYOffset += HEAD_HEIGHT * scaleFactor;
        }
    });

    const downloadLink = document.getElementById(
        isHD ? "downloadLinkHD" : "downloadLink"
    );
    const downloadButton = document.getElementById(
        isHD ? "downloadLinkHD-bt" : "downloadLink-bt"
    );

    downloadLink.href = canvas.toDataURL("image/png");
    downloadLink.style.display = "block";
    downloadButton.style.display = "block";

    const previewScale = isHD ? 0.5 : 1;
    canvas.style.transform = `scale(${previewScale})`;
    canvas.style.transformOrigin = "top left";
    document.querySelector("#sheet").style.width = `${canvas.width * previewScale}px`;
    document.querySelector("#sheet").style.height = `${canvas.height * previewScale}px`;
}