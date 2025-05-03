generatePoloInputs();
generateBonusInputs();

document.getElementById('open-color-popup').addEventListener('click', () => {
    document.getElementById('color-popup').style.display = 'flex';
});

document.getElementById('close-popup').addEventListener('click', () => {
    document.getElementById('color-popup').style.display = 'none';
});

function createInputElement(type, id, name, value = '', additionalAttributes = {}) {
    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.name = name;

    if (type === 'checkbox') {
        input.checked = value;
    } else {
        input.value = value;
    }

    Object.keys(additionalAttributes).forEach(attr => {
        input.setAttribute(attr, additionalAttributes[attr]);
    });

    return input;
}

function createLabelElement(forId, text) {
    const label = document.createElement('label');
    label.htmlFor = forId;
    label.textContent = text;
    return label;
}

function generateInputs(containerId, count, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    const inputFields = {
        bonus: [
            { label: 'Name:', type: 'text', idSuffix: 'name', defaultValue: (i) => `Bonus ${i}` },
            { label: 'Source:', type: 'text', idSuffix: 'src', defaultValue: (i) => `bonus${i}.mp4` },
            { label: 'Code:', type: 'text', idSuffix: 'code', defaultValue: () => '1,2,3,4,5' },
            { label: 'Sound:', type: 'text', idSuffix: 'sound', defaultValue: (i) => `bonus-${i}` },
            { label: 'Aspire:', type: 'text', idSuffix: 'aspire', defaultValue: (i) => `aspire-bonus${i}` },
        ],
        polo: [
            { label: 'Name:', type: 'text', idSuffix: 'name', defaultValue: (i) => `${i}_polo` },
            { label: 'Color:', type: 'color', idSuffix: 'color', defaultValue: () => '#828282' },
            { label: 'Has One Loop:', type: 'checkbox', idSuffix: 'uniqsnd', defaultValue: () => true },
        ],
    };

    const fields = inputFields[type] || [];

    for (let i = 1; i <= count; i++) {
        const div = document.createElement('div');
        div.className = `${type}-input`;

        const header = document.createElement('h3');
        header.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} ${i}`;
        div.appendChild(header);

        fields.forEach((field) => {
            div.appendChild(createLabelElement(`${type}-${field.idSuffix}-${i}`, field.label));
            div.appendChild(
                createInputElement(
                    field.type,
                    `${type}-${field.idSuffix}-${i}`,
                    `${type}-${field.idSuffix}-${i}`,
                    typeof field.defaultValue === 'function' ? field.defaultValue(i) : field.defaultValue
                )
            );
            div.appendChild(document.createElement('br'));
        });

        container.appendChild(div);
    }
}

function generateBonusInputs() {
    const numberOfBonuses = parseInt(document.getElementById('bonusarraylength').value, 10) || 0;
    generateInputs('bonus-inputs-container', numberOfBonuses, 'bonus');
}

function generatePoloInputs() {
    const numberOfPolos = parseInt(document.getElementById('animearraylength').value, 10) || 0;
    generateInputs('polo-inputs-container', numberOfPolos, 'polo');
}

function generateAppJs(isV9 = false) {
    const name = document.getElementById('name').value || '';
    const version = document.getElementById('version').value || '';
    const date = document.getElementById('date').value || '';
    const looptime = parseInt(document.getElementById('looptime').value, 10) || 0;
    const bpm = parseInt(document.getElementById('bpm').value, 10) || 0;
    const totalframe = parseInt(document.getElementById('totalframe').value, 10) || 0;
    const nbpolo = parseInt(document.getElementById('nbpolo').value, 10) || 0;
    const nbloopbonus = parseInt(document.getElementById('nbloopbonus').value, 10) || 0;
    const bonusloopA = document.getElementById('bonusloopA').value || '';
    const bonusendloopA = document.getElementById('bonusendloopA').value || '';
    const recmaxloop = parseInt(document.getElementById('recmaxloop').value, 10) || 0;
    const recminloop = parseInt(document.getElementById('recminloop').value, 10) || 0;

    const colBck = document.getElementById('colBck').value || '';
    const col0 = document.getElementById('col0').value || '';
    const col1 = document.getElementById('col1').value || '';
    const col2 = document.getElementById('col2').value || '';
    const col3 = document.getElementById('col3').value || '';
    const col4 = document.getElementById('col4').value || '';

    const numberOfPolos = parseInt(document.getElementById('animearraylength').value, 10) || 0;
    const polos = [];
    for (let i = 1; i <= numberOfPolos; i++) {
        const poloName = document.getElementById(`polo-name-${i}`).value || '';
        const poloColor = document.getElementById(`polo-color-${i}`).value || '';
        const poloUniqsnd = document.getElementById(`polo-uniqsnd-${i}`).checked;

        polos.push(`{
            name: "${poloName}",
            color: "${poloColor.replace('#', '')}",
            uniqsnd: ${poloUniqsnd}
        }`);
    }
    const animearrayFormatted = polos.join(',\n');

    const numberOfBonuses = parseInt(document.getElementById('bonusarraylength').value, 10) || 0;
    const bonuses = [];
    for (let i = 1; i <= numberOfBonuses; i++) {
        const bonusName = document.getElementById(`bonus-name-${i}`).value || '';
        const bonusSrc = document.getElementById(`bonus-src-${i}`).value || '';
        const bonusCode = document.getElementById(`bonus-code-${i}`).value || '';
        const bonusSound = document.getElementById(`bonus-sound-${i}`).value || '';
        const bonusAspire = document.getElementById(`bonus-aspire-${i}`).value || '';

        let bonusStr = `{
    name: "${bonusName}",
    src: "${bonusSrc}",
    code: "${bonusCode}",
    sound: "${bonusSound}",
    aspire: "${bonusAspire}"`;

        if (isV9) {
            bonusStr += `,
    loop: ${nbloopbonus}`;
        }

        bonusStr += `}`;
        bonuses.push(bonusStr);
    }
    const bonusarrayFormatted = bonuses.join(',\n');

    let appJsContent = `/* Generated by Joalor64's Modbox */`;
    if (isV9) {
        appJsContent += `
versions.v${version} = {
  name: "${name}",
  version: ${version},
  date: "${date}",
  folder: "asset-v${version}/",
  looptime: ${looptime},
  bpm: ${bpm},
  totalframe: ${totalframe},
  nbpolo: ${nbpolo},
  bonusloopA: ${bonusloopA},
  bonusendloopA: ${bonusendloopA},
  colBck: "${colBck}",
  col0: "${col0}",
  col1: "${col1}",
  col2: "${col2}",
  col3: "${col3}",
  col4: "${col4}",
  animearray: [${animearrayFormatted}],
  bonusarray: [${bonusarrayFormatted}]
};`;
    } else {
        appJsContent += `
var app = new function() {
    this.name = "${name}",
    this.version = "${version}",
    this.date = "${date}",
    this.folder = "asset-v${version}/",
    this.looptime = ${looptime},
    this.bpm = ${bpm},
    this.totalframe = ${totalframe},
    this.nbpolo = ${nbpolo},
    this.nbloopbonus = ${nbloopbonus},
    this.bonusloopA = ${bonusloopA},
    this.bonusendloopA = ${bonusendloopA},
    this.recmaxloop = ${recmaxloop},
    this.recminloop = ${recminloop},
    this.recmintime = Math.round(this.looptime / 1000) * this.recminloop,
    this.spritepolo = "polo-sprite.png",
    this.spritepicto = "game-picto.png",
    this.colBck = "${colBck}",
    this.col0 = "${col0}",
    this.col1 = "${col1}",
    this.col2 = "${col2}",
    this.col3 = "${col3}",
    this.col4 = "${col4}",
    this.animearray = [${animearrayFormatted}],
    this.bonusarray = [${bonusarrayFormatted}];
    
    for (var n = 0, o = this.animearray.length; n < o; n++) {
        var a = this.animearray[n].name;
        this.animearray[n].soundA = a + "_a", this.animearray[n].soundB = this.animearray[n].uniqsnd ? a + "_a" : a + "_b", this.animearray[n].anime = a + "-sprite.png", this.animearray[n].animeData = a + ".json"
    }
};
    `;
    }

    const downloadDiv = document.getElementById('download-link');
    downloadDiv.innerHTML = '';
    var appPrefix = (isV9) ? `versions-v${version}` : 'app';
    downloadDiv.appendChild(createDownloadButton(appJsContent, `${appPrefix}.js`, `Download ${appPrefix}.js`));
}

function createDownloadButton(content, fileName, buttonText) {
    const blob = new Blob([content], { type: 'text/javascript' });
    const button = document.createElement('button');
    button.textContent = buttonText;
    button.onclick = () => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        setTimeout(() => URL.revokeObjectURL(link.href), 100);
    };
    return button;
}