const nameInput = document.getElementById('name');
const spriteInput = document.getElementById('spriteInput');
const audioInput = document.getElementById('audioInput');
const jsonInput = document.getElementById('jsonInput');

const bodyEl = document.getElementById('body');
const headEl = document.getElementById('head');
const character = document.getElementById('character');
const canvas = document.getElementById('canvas');
const canvasCtx = canvas.getContext('2d');
const track = document.getElementById('track');
const loopAnimInput = document.getElementById('loopAnim');

let cropwidth = 0;
let cropheight = 0;
let headwidth = 164;
let headheight = 199;

let x2 = 0,
    y2 = 0;

let props = [];
let currentProp = 0;

let fileURL = '';
let SpritesheetWidth = 0,
    SpritesheetHeight = 0;
let isDragging = false,
    dragStartX = 0,
    dragStartY = 0;

const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const headHeightInput = document.getElementById('headHeightInput');
const xposInput = document.getElementById('xpos');
const yposInput = document.getElementById('ypos');
const dragAddInput = document.getElementById('dragAdd');

function updateUISizes() {
    headwidth = parseInt(widthInput.value, 10) || 164;
    headheight = parseInt(headHeightInput.value, 10) || 199;
    const bodyH = parseInt(heightInput.value, 10) || (headheight + 20);

    bodyEl.style.width = headwidth + 'px';
    bodyEl.style.height = bodyH + 'px';
    bodyEl.style.backgroundSize = 'auto';

    headEl.style.width = headwidth + 'px';
    headEl.style.height = headheight + 'px';
    headEl.style.backgroundSize = 'auto';

    character.style.width = headwidth + 'px';
    character.style.height = bodyH + 'px';

    cropheight = parseInt(heightInput.value, 10) || (headheight + 20);

    xposInput.value = x2;
    yposInput.value = y2;
}

function setBackgroundImage(url) {
    bodyEl.style.backgroundImage = `url(${url})`;
    headEl.style.backgroundImage = `url(${url})`;
}

function updateBackgroundPosition() {
    bodyEl.style.backgroundPosition = `-${headwidth}px 0px`;

    headEl.style.backgroundPosition = `-${cropwidth}px -${cropheight}px`;
    headEl.style.transform = `translate(${x2}px, ${y2}px)`;

    xposInput.value = x2;
    yposInput.value = y2;
}

spriteInput.addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    fileURL = URL.createObjectURL(f);
    setBackgroundImage(fileURL);

    const img = new Image();
    img.onload = () => {
        SpritesheetWidth = img.width;
        SpritesheetHeight = img.height;

        cropwidth = 0;
        cropheight = parseInt(heightInput.value, 10) || (headheight + 20);

        updateUISizes();
        updateBackgroundPosition();
    };
    img.src = fileURL;
});

audioInput.addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    track.src = URL.createObjectURL(f);

    const reader = new FileReader();
    reader.onload = function (ev) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ac = new AudioContext();
            ac.decodeAudioData(ev.target.result, function (buffer) {
                const data = buffer.getChannelData(0);
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;
                canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
                canvasCtx.lineWidth = 2;
                canvasCtx.beginPath();
                const slice = Math.floor(data.length / canvas.width);
                for (let i = 0; i < canvas.width; i++) {
                    const v = data[i * slice] * 0.5 + 0.5;
                    const yy = canvas.height - (v * canvas.height);
                    if (i === 0) canvasCtx.moveTo(i, yy);
                    else canvasCtx.lineTo(i, yy);
                }
                canvasCtx.strokeStyle = '#6fa8ff';
                canvasCtx.stroke();
                ac.close();
            });
        } catch (err) {
            console.warn('Audio draw skipped', err);
        }
    };
    reader.readAsArrayBuffer(f);
});

jsonInput.addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
        try {
            const data = JSON.parse(r.result);
            nameInput.value = data.animeName || nameInput.value;
            widthInput.value = data.width || widthInput.value;
            heightInput.value = data.height || heightInput.value;
            headHeightInput.value = data.headHeight || headHeightInput.value;

            props = (data.arrayFrame || []).map(a => a.prop);

            currentProp = 0;
            updatePropsCounter();
            if (props.length) switchto(0);
            updateUISizes();
            updateBackgroundPosition();
        } catch {
            alert('Invalid JSON');
        }
    };
    r.readAsText(f);
});

document.getElementById('nexthead').addEventListener('click', () => {
    cropwidth += headwidth;
    if (cropwidth >= SpritesheetWidth) {
        cropwidth = 0;
        cropheight += parseInt(heightInput.value, 10) || (headheight + 20);
        if (cropheight >= SpritesheetHeight) cropheight = parseInt(heightInput.value, 10) || (headheight + 20);
    }
    updateBackgroundPosition();
});

document.getElementById('prevhead').addEventListener('click', () => {
    if (cropwidth === 0 && cropheight > (parseInt(heightInput.value, 10) || (headheight + 20))) {
        cropheight -= parseInt(heightInput.value, 10) || (headheight + 20);
        cropwidth = Math.max(0, SpritesheetWidth - headwidth);
    } else {
        cropwidth = Math.max(0, cropwidth - headwidth);
    }
    updateBackgroundPosition();
});

function moveHead(dx, dy) {
    x2 += dx;
    y2 += dy;
    updateBackgroundPosition();
}
document.getElementById('moveUp').addEventListener('click', () => moveHead(0, -5));
document.getElementById('moveDown').addEventListener('click', () => moveHead(0, 5));
document.getElementById('moveLeft').addEventListener('click', () => moveHead(-5, 0));
document.getElementById('moveRight').addEventListener('click', () => moveHead(5, 0));

function newProp() {
    props.push(`${cropwidth},${cropheight},${x2},${y2}`);
    currentProp = props.length - 1;
    updatePropsCounter();
}

document.getElementById('addFrame').addEventListener('click', newProp);
document.getElementById('removeFrame').addEventListener('click', () => {
    if (props.length > 0) {
        props.splice(currentProp, 1);
        currentProp = Math.max(0, currentProp - 1);
        updatePropsCounter();
        if (props.length) switchto(currentProp);
    }
});
document.getElementById('prevProp').addEventListener('click', () => {
    if (props.length === 0) return;
    currentProp = Math.max(0, currentProp - 1);
    switchto(currentProp);
});
document.getElementById('nextProp').addEventListener('click', () => {
    if (props.length === 0) return;
    currentProp = Math.min(props.length - 1, currentProp + 1);
    switchto(currentProp);
});

function updatePropsCounter() {
    document.getElementById('propsCounter').textContent = `prop ${currentProp}/${props.length}`;
}

function switchto(index) {
    if (!props[index]) return;
    const [cw, ch, px, py] = props[index].split(',').map(Number);
    cropwidth = cw;
    cropheight = ch;
    x2 = px;
    y2 = py;
    updateBackgroundPosition();
    currentProp = index;
    updatePropsCounter();
}

let animationId = null;
let isPlaying = false;
let previewFrame = 0;
let animationStartTime = 0;

function previewAnimation() {
    if (isPlaying || props.length === 0) return;
    isPlaying = true;
    previewFrame = 0;
    animationStartTime = performance.now();

    const totalFrames = props.length;
    const loopInput = document.getElementById('polo_looptime');
    const baseTime = loopInput ? Number(loopInput.value) || 2000 : 2000;
    const totalPlayTime = baseTime;
    const frameDuration = totalPlayTime / totalFrames;

    if (track && track.src) {
        try {
            track.currentTime = 0;
            track.load();
            track.play();
        } catch { }
    }

    function animate(now) {
        if (!isPlaying) return;
        const elapsed = now - animationStartTime;
        let targetFrame = Math.floor(elapsed / frameDuration);

        if (loopAnimInput && loopAnimInput.checked) {
            if (targetFrame >= totalFrames) {
                targetFrame = targetFrame % totalFrames;

                if (track && track.src) {
                    try {
                        track.pause();
                        track.currentTime = 0;
                        track.play();
                    } catch { }
                }

                animationStartTime = now;
            }
        } else {
            targetFrame = Math.min(targetFrame, totalFrames - 1);
        }

        if (targetFrame !== previewFrame) {
            previewFrame = targetFrame;
            switchto(previewFrame);
        }

        if (loopAnimInput && loopAnimInput.checked) {
            animationId = requestAnimationFrame(animate);
        } else if (elapsed < totalPlayTime) {
            animationId = requestAnimationFrame(animate);
        } else {
            stopAnimation();
        }
    }
    animationId = requestAnimationFrame(animate);
}

function stopAnimation() {
    isPlaying = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    try {
        if (track && !track.paused) track.pause();
    } catch { }
}

document.getElementById('playAnim').onclick = () => {
    const btn = document.getElementById('playAnim');
    if (isPlaying) {
        stopAnimation();
        btn.textContent = 'Preview Animation';
    } else {
        previewAnimation();
        btn.textContent = 'Stop';
    }
};

document.getElementById('download').addEventListener('click', () => {
    const arr = generateProps();
    const data = {
        animeName: nameInput.value || 'anim',
        percentageMax: '0.2',
        totalFrame: props.length.toString(),
        width: headwidth.toString(),
        height: (parseInt(heightInput.value, 10) || (headheight + 20)).toString(),
        headHeight: headheight.toString(),
        arrayFrame: arr
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (nameInput.value || 'anim') + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
});

function generateProps() {
    return props.map(p => ({
        prop: p
    }));
}

widthInput.addEventListener('input', () => {
    updateUISizes();
    updateBackgroundPosition();
});
heightInput.addEventListener('input', () => {
    updateUISizes();
    updateBackgroundPosition();
});
headHeightInput.addEventListener('input', () => {
    updateUISizes();
    updateBackgroundPosition();
});

xposInput.addEventListener('input', () => {
    const val = parseInt(xposInput.value, 10);
    if (!isNaN(val)) x2 = val;
    updateBackgroundPosition();
});
yposInput.addEventListener('input', () => {
    const val = parseInt(yposInput.value, 10);
    if (!isNaN(val)) y2 = val;
    updateBackgroundPosition();
});

updateUISizes();
updateBackgroundPosition();
updatePropsCounter();