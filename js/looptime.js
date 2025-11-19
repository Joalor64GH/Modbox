const exampleImg = document.getElementById('example-img');
const modal = document.getElementById('imgModal');
const modalImg = document.getElementById('modalImage');
const closeBtn = document.getElementById('closeModal');

exampleImg.onclick = function () {
    modal.style.display = 'block';
    modalImg.src = this.src;
}

closeBtn.onclick = function () {
    modal.style.display = 'none';
}

modal.onclick = function (e) {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
}

document.getElementById('submit-button').addEventListener('click', function () {
    const bpm = Number(document.getElementById('bpminput').value.trim());
    let bpl = Number(document.getElementById('beatsloopinput').value.trim());
    const looptimeInput = Number(document.getElementById('looptimeinput').value.trim());

    if (isNaN(bpl) || bpl <= 0) {
        bpl = 16;
    }

    let resultText = '';

    if (!isNaN(bpm) && bpm > 0) {
        let looptime = Math.trunc((60000 / bpm) * bpl);
        let totalframe = Math.floor((looptime * 0.024)) * 2;
        resultText = `Results:<br>Looptime: ${looptime} ms<br>Totalframe: ${totalframe}`;
    } else if (!isNaN(looptimeInput) && looptimeInput > 0) {
        let calcBPM = 60000 / (looptimeInput / bpl);
        resultText = `Results:<br>BPM: ${calcBPM.toFixed(2)}`;
    } else {
        resultText = 'Please enter either a valid BPM or a Looptime.';
    }

    document.getElementById('results-text').innerHTML = resultText;
});