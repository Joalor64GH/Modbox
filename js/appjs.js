generatePoloInputs();
generateBonusInputs();

document.addEventListener('DOMContentLoaded', () => {
    setupImportExport();
});

const loadingBar = document.getElementById('loading-bar');
const scaleBox = document.querySelector('.progress-box .scale');

let loadingAnimationActive = false;

function startLoadingBarAnimation() {
    const col3 = document.getElementById('col3').value;

    scaleBox.style.borderColor = col3;
    loadingBar.style.backgroundColor = col3;

    loadingAnimationActive = true;

    function animateBar() {
        if (!loadingAnimationActive) return;

        const targetWidth = Math.floor(Math.random() * 95) + 1;
        const duration = 400 + Math.random() * 400;

        loadingBar.style.transition = `width ${duration}ms ease-in-out`;
        loadingBar.style.width = targetWidth + '%';

        setTimeout(() => {
            loadingBar.style.transition = `width ${duration}ms ease-in-out`;
            loadingBar.style.width = '0%';

            setTimeout(() => {
                animateBar();
            }, 50);
        }, duration);
    }

    animateBar();
}

document.getElementById('open-color-popup').addEventListener('click', () => {
    document.getElementById('color-popup').style.display = 'flex';
    startLoadingBarAnimation();
});

document.getElementById('close-popup').addEventListener('click', () => {
    document.getElementById('color-popup').style.display = 'none';
    loadingAnimationActive = false;
    loadingBar.style.width = '0%';
});

['colBck', 'col0', 'col1', 'col2', 'col3', 'col4'].forEach(id => {
    document.getElementById(id).addEventListener('input', updatePreviewButtons);
});

function updatePreviewButtons() {
    const col1 = document.getElementById('col1').value;
    const col3 = document.getElementById('col3').value;

    document.querySelectorAll('.preview-btn').forEach(btn => {
        btn.style.backgroundColor = col1;

        btn.onmouseenter = null;
        btn.onmouseleave = null;

        btn.onmouseenter = () => { btn.style.backgroundColor = col3; };
        btn.onmouseleave = () => { btn.style.backgroundColor = col1; };
    });

    document.getElementById('loading-bar').style.backgroundColor = col3;
}

['col1', 'col4'].forEach(id => {
    document.getElementById(id).addEventListener('input', updatePreviewButtons);
});

updatePreviewButtons();

function initializePreviewIcons() {
    const icons = ['fa-play', 'fa-music', 'fa-arrows-left-right'];
    const previewBtns = document.querySelectorAll('.preview-btn');
    previewBtns.forEach((btn, i) => {
        btn.innerHTML = '';
        const icon = document.createElement('i');
        icon.className = `fa-solid ${icons[i]} fa-2x`;
        btn.appendChild(icon);
    });
}
initializePreviewIcons();

function getIntValue(id, defaultValue = 0) {
    return parseInt(document.getElementById(id).value, 10) || defaultValue;
}

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
        bonus: [{
            label: 'Name:',
            type: 'text',
            idSuffix: 'name',
            defaultValue: (i) => `Bonus ${i}`
        },
        {
            label: 'Source:',
            type: 'text',
            idSuffix: 'src',
            defaultValue: (i) => `bonus${i}.mp4`
        },
        {
            label: 'Code:',
            type: 'text',
            idSuffix: 'code',
            defaultValue: () => '1,2,3,4,5'
        },
        {
            label: 'Sound:',
            type: 'text',
            idSuffix: 'sound',
            defaultValue: (i) => `bonus-${i}`
        },
        {
            label: 'Aspire:',
            type: 'text',
            idSuffix: 'aspire',
            defaultValue: (i) => `aspire-bonus${i}`
        },
        ],
        polo: [{
            label: 'Name:',
            type: 'text',
            idSuffix: 'name',
            defaultValue: (i) => `${i}_polo`
        },
        {
            label: 'Color:',
            type: 'color',
            idSuffix: 'color',
            defaultValue: () => '#828282'
        },
        {
            label: 'Has One Loop:',
            type: 'checkbox',
            idSuffix: 'uniqsnd',
            defaultValue: () => true
        },
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

function buildAppJsContent(isV9 = false) {
    const name = document.getElementById('name').value || '';
    const version = document.getElementById('version').value || '';
    const date = document.getElementById('date').value || '';
    const looptime = getIntValue('looptime');
    const bpm = getIntValue('bpm');
    const totalframe = getIntValue('totalframe');
    const nbpolo = getIntValue('nbpolo');
    const nbloopbonus = getIntValue('nbloopbonus');
    const bonusloopA = document.getElementById('bonusloopA').value || '';
    const bonusendloopA = document.getElementById('bonusendloopA').value || '';
    const recmaxloop = getIntValue('recmaxloop');
    const recminloop = getIntValue('recminloop');

    const colors = {};
    ['colBck', 'col0', 'col1', 'col2', 'col3', 'col4'].forEach(id => {
        colors[id] = document.getElementById(id).value || '';
    });

    const polos = [];
    for (let i = 1; i <= getIntValue('animearraylength'); i++) {
        const poloName = (document.getElementById(`polo-name-${i}`) || {}).value || '';
        const poloColor = (document.getElementById(`polo-color-${i}`) || {}).value || '';
        const poloUniqsnd = !!(document.getElementById(`polo-uniqsnd-${i}`) && document.getElementById(`polo-uniqsnd-${i}`).checked);

        polos.push(`{\n            name: "${poloName}",\n            color: "${poloColor.replace('#', '')}",\n            uniqsnd: ${poloUniqsnd}\n        }`);
    }
    const animearrayFormatted = polos.join(',\n');

    const bonuses = [];
    for (let i = 1; i <= getIntValue('bonusarraylength'); i++) {
        const bonusName = (document.getElementById(`bonus-name-${i}`) || {}).value || '';
        const bonusSrc = (document.getElementById(`bonus-src-${i}`) || {}).value || '';
        const bonusCode = (document.getElementById(`bonus-code-${i}`) || {}).value || '';
        const bonusSound = (document.getElementById(`bonus-sound-${i}`) || {}).value || '';
        const bonusAspire = (document.getElementById(`bonus-aspire-${i}`) || {}).value || '';

        let bonusStr = `{\n    name: "${bonusName}",\n    src: "${bonusSrc}",\n    code: "${bonusCode}",\n    sound: "${bonusSound}",\n    aspire: "${bonusAspire}"`;

        if (isV9) {
            bonusStr += `,\n    loop: ${nbloopbonus}`;
        }

        bonusStr += `}`;
        bonuses.push(bonusStr);
    }
    const bonusarrayFormatted = bonuses.join(',\n');

    let appJsContent = '/* Generated by Joalor64\'s Modbox */';
    if (isV9) {
        appJsContent += `\nversions.v${version} = {\n  name: "${name}",\n  version: ${version},\n  date: "${date}",\n  folder: "asset-v${version}/",\n  looptime: ${looptime},\n  bpm: ${bpm},\n  totalframe: ${totalframe},\n  nbpolo: ${nbpolo},\n  bonusloopA: ${bonusloopA},\n  bonusendloopA: ${bonusendloopA},\n  colBck: "${colors.colBck}",\n  col0: "${colors.col0}",\n  col1: "${colors.col1}",\n  col2: "${colors.col2}",\n  col3: "${colors.col3}",\n  col4: "${colors.col4}",\n  animearray: [${animearrayFormatted}],\n  bonusarray: [${bonusarrayFormatted}]\n};`;
    } else {
        appJsContent += `\nvar app = new function() {\n    this.name = "${name}",\n    this.version = "${version}",\n    this.date = "${date}",\n    this.folder = "asset-v${version}/",\n    this.looptime = ${looptime},\n    this.bpm = ${bpm},\n    this.totalframe = ${totalframe},\n    this.nbpolo = ${nbpolo},\n    this.nbloopbonus = ${nbloopbonus},\n    this.bonusloopA = ${bonusloopA},\n    this.bonusendloopA = ${bonusendloopA},\n    this.recmaxloop = ${recmaxloop},\n    this.recminloop = ${recminloop},\n    this.recmintime = Math.round(this.looptime / 1000) * this.recminloop,\n    this.spritepolo = "polo-sprite.png",\n    this.spritepicto = "game-picto.png",\n    this.colBck = "${colors.colBck}",\n    this.col0 = "${colors.col0}",\n    this.col1 = "${colors.col1}",\n    this.col2 = "${colors.col2}",\n    this.col3 = "${colors.col3}",\n    this.col4 = "${colors.col4}",\n    this.animearray = [${animearrayFormatted}],\n    this.bonusarray = [${bonusarrayFormatted}];\n    \n    for (var n = 0, o = this.animearray.length; n < o; n++) {\n        var a = this.animearray[n].name;\n        this.animearray[n].soundA = a + "_a", this.animearray[n].soundB = this.animearray[n].uniqsnd ? a + "_a" : a + "_b", this.animearray[n].anime = a + "-sprite.png", this.animearray[n].animeData = a + ".json"\n    }\n};\n    `;
    }

    return appJsContent;
}

function createDownloadButtonGeneric(content, fileName, buttonText, mime) {
    const blob = new Blob([content], { type: mime || 'application/octet-stream' });
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

function setupImportExport() {
    const importBtn = document.getElementById('import-file-btn');
    const importInput = document.getElementById('import-file-input');
    const infoDiv = document.getElementById('imported-file-info');
    const exportJsonBtn = document.getElementById('export-json-btn');

    if (!importBtn || !importInput || !exportJsonBtn) return;
    const exportAppBtn = document.getElementById('export-appjs-btn');
    const exportVersBtn = document.getElementById('export-versions-btn');

    // RMB toggle wiring (show/hide RMB options)
    const rmbCheckbox = document.getElementById('rmb-mode');
    const rmbSection = document.getElementById('rmb-section');
    if (rmbCheckbox && rmbSection) {
        const toggleRmb = () => {
            if (rmbCheckbox.checked) rmbSection.classList.add('visible');
            else rmbSection.classList.remove('visible');
        };
        rmbCheckbox.addEventListener('change', toggleRmb);
        toggleRmb();
    }

    importBtn.addEventListener('click', () => importInput.click());
    importInput.addEventListener('change', handleFileInputChange);

    if (exportAppBtn) exportAppBtn.addEventListener('click', () => {
        const content = buildAppJsContent(false);
        const btn = createDownloadButtonGeneric(content, 'app.js', 'Download app.js', 'text/javascript');
        btn.click();
    });

    if (exportVersBtn) exportVersBtn.addEventListener('click', () => {
        const content = buildAppJsContent(true);
        const version = document.getElementById('version').value || 'vX';
        const fileName = `versions-v${version}.js`;
        const btn = createDownloadButtonGeneric(content, fileName, fileName, 'text/javascript');
        btn.click();
    });

    exportJsonBtn.addEventListener('click', () => {
        const json = buildModboxJson();
        const content = JSON.stringify(json, null, 2);
        const btn = createDownloadButtonGeneric(content, 'modbox-app.json', 'Download JSON', 'application/json');
        btn.click();
    });

    function showInfo(text) {
        infoDiv.textContent = text;
        setTimeout(() => { if (infoDiv.textContent === text) infoDiv.textContent = ''; }, 4000);
    }

    async function handleFileInputChange(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const text = await file.text();
        try {
            if (file.name.toLowerCase().endsWith('.json')) {
                const data = JSON.parse(text);
                applyImportedDataFromJson(data);
                showInfo('Imported JSON: ' + file.name);
            } else {
                let obj = null;
                obj = parseRmbAppJs(text);
                if (obj) {
                    applyImportedDataFromRmb(obj);
                    showInfo('Imported versions file: ' + file.name);
                } else {
                    obj = parsePreV9AppJs(text);
                    if (obj) {
                        applyImportedDataFromRmb(obj);
                        showInfo('Imported legacy app.js: ' + file.name);
                    } else {
                        throw new Error('No compatible app.js structure found');
                    }
                }
            }
        } catch (err) {
            showInfo('Import failed: ' + err.message);
            console.error(err);
        } finally {
            importInput.value = '';
        }
    }
}

function parseRmbAppJs(content) {
    const matchIdx = content.search(/versions\.v\d+\s*=\s*\{/);
    if (matchIdx === -1) return null;
    let start = content.indexOf('{', matchIdx);
    if (start === -1) return null;
    let i = start;
    let depth = 0;
    for (; i < content.length; i++) {
        if (content[i] === '{') depth++;
        else if (content[i] === '}') { depth--; if (depth === 0) break; }
    }
    const objStr = content.slice(start, i + 1);
    try {
        const obj = Function('return ' + objStr)();
        return obj;
    } catch (err) {
        console.error('Failed to eval object literal', err);
        return null;
    }
}

function applyImportedDataFromRmb(obj) {
    if (!obj) return;
    document.getElementById('name').value = obj.name || document.getElementById('name').value;
    document.getElementById('version').value = obj.version || document.getElementById('version').value;
    document.getElementById('date').value = obj.date || document.getElementById('date').value;
    if (obj.looptime !== undefined) document.getElementById('looptime').value = obj.looptime;
    if (obj.bpm !== undefined) document.getElementById('bpm').value = obj.bpm;
    if (obj.totalframe !== undefined) document.getElementById('totalframe').value = obj.totalframe;
    if (obj.nbpolo !== undefined) document.getElementById('nbpolo').value = obj.nbpolo;
    if (obj.nbloopbonus !== undefined) document.getElementById('nbloopbonus').value = obj.nbloopbonus;
    if (obj.bonusloopA !== undefined) document.getElementById('bonusloopA').value = obj.bonusloopA.toString();
    if (obj.bonusendloopA !== undefined) document.getElementById('bonusendloopA').value = obj.bonusendloopA.toString();

    ['colBck', 'col0', 'col1', 'col2', 'col3', 'col4'].forEach((k, idx) => {
        if (obj[k]) {
            const val = obj[k].toString().startsWith('#') ? obj[k] : '#' + obj[k].toString();
            if (document.getElementById(k)) document.getElementById(k).value = val;
        }
    });

    if (Array.isArray(obj.animearray)) {
        document.getElementById('animearraylength').value = obj.animearray.length;
        generatePoloInputs();
        for (let i = 0; i < obj.animearray.length; i++) {
            const a = obj.animearray[i];
            const idx = i + 1;
            const nameEl = document.getElementById(`polo-name-${idx}`);
            const colorEl = document.getElementById(`polo-color-${idx}`);
            const uniqEl = document.getElementById(`polo-uniqsnd-${idx}`);
            if (nameEl) nameEl.value = a.name || nameEl.value;
            if (colorEl) colorEl.value = (a.color && a.color.toString().startsWith('#')) ? a.color : ('#' + (a.color || '').toString());
            if (uniqEl) uniqEl.checked = !!a.uniqsnd;
        }
    }

    if (Array.isArray(obj.bonusarray)) {
        document.getElementById('bonusarraylength').value = obj.bonusarray.length;
        generateBonusInputs();
        for (let i = 0; i < obj.bonusarray.length; i++) {
            const b = obj.bonusarray[i];
            const idx = i + 1;
            const nameEl = document.getElementById(`bonus-name-${idx}`);
            const srcEl = document.getElementById(`bonus-src-${idx}`);
            const codeEl = document.getElementById(`bonus-code-${idx}`);
            const soundEl = document.getElementById(`bonus-sound-${idx}`);
            const aspireEl = document.getElementById(`bonus-aspire-${idx}`);
            if (nameEl) nameEl.value = b.name || b.title || nameEl.value;
            if (srcEl) srcEl.value = b.src || b.name || srcEl.value;
            if (codeEl) codeEl.value = Array.isArray(b.code) ? b.code.join(',') : (b.code || codeEl.value);
            if (soundEl) soundEl.value = b.sound || b.soundName || soundEl.value;
            if (aspireEl) aspireEl.value = b.aspire || b.predrop || aspireEl.value;
        }
    }

    updatePreviewButtons();

    // RMB-specific fields: enable RMB mode and populate extra metadata when present
    const rmbKeys = ['background','poloSprite','poloHoverEffect','ambience','firstLoopDelay','maxrecloop','pictoRowMax','_letEvents'];
    const hasRmb = rmbKeys.some(k => obj[k] !== undefined);
    if (hasRmb) {
        const rmbCheckbox = document.getElementById('rmb-mode');
        const rmbSection = document.getElementById('rmb-section');
        if (rmbCheckbox) {
            rmbCheckbox.checked = true;
            if (rmbSection) rmbSection.classList.add('visible');
        }

        if (document.getElementById('background')) document.getElementById('background').value = obj.background || '';
        if (document.getElementById('poloSprite')) document.getElementById('poloSprite').value = obj.poloSprite || obj.poloSprite || 'polo-sprite.png';
        if (document.getElementById('poloHoverEffect')) document.getElementById('poloHoverEffect').checked = !!obj.poloHoverEffect;
        if (document.getElementById('ambience')) document.getElementById('ambience').value = obj.ambience || '';
        if (document.getElementById('firstLoopDelay')) document.getElementById('firstLoopDelay').value = obj.firstLoopDelay || '';
        // map maxrecloop -> recmaxloop input
        if (document.getElementById('recmaxloop') && obj.maxrecloop !== undefined) document.getElementById('recmaxloop').value = obj.maxrecloop;
        if (document.getElementById('pictoRowMax')) document.getElementById('pictoRowMax').value = obj.pictoRowMax || '';
        if (document.getElementById('_letEvents')) document.getElementById('_letEvents').checked = !!obj._letEvents;
    }
}

function applyImportedDataFromJson(data) {
    if (!data) return;
    document.getElementById('name').value = data.name || document.getElementById('name').value;
    document.getElementById('date').value = data.date || document.getElementById('date').value;
    if (data.looptime !== undefined) document.getElementById('looptime').value = data.looptime;
    if (data.bpm !== undefined) document.getElementById('bpm').value = data.bpm;
    if (data.totalframe !== undefined) document.getElementById('totalframe').value = data.totalframe;
    if (data.bonusloopA !== undefined) document.getElementById('bonusloopA').value = data.bonusloopA.toString();
    if (data.bonusendloopA !== undefined) document.getElementById('bonusendloopA').value = data.bonusendloopA.toString();

    if (Array.isArray(data.colors)) {
        ['colBck', 'col0', 'col1', 'col2', 'col3', 'col4'].forEach((k, idx) => {
            if (data.colors[idx]) document.getElementById(k).value = data.colors[idx];
        });
    }

    if (Array.isArray(data.animearray)) {
        document.getElementById('animearraylength').value = data.animearray.length;
        generatePoloInputs();
        data.animearray.forEach((a, i) => {
            const idx = i + 1;
            const nameEl = document.getElementById(`polo-name-${idx}`);
            const colorEl = document.getElementById(`polo-color-${idx}`);
            const uniqEl = document.getElementById(`polo-uniqsnd-${idx}`);
            if (nameEl) nameEl.value = a.name || nameEl.value;
            if (colorEl) colorEl.value = a.color || colorEl.value;
            if (uniqEl) uniqEl.checked = !!a.uniqsnd;
        });
    }

    if (Array.isArray(data.bonusarray)) {
        document.getElementById('bonusarraylength').value = data.bonusarray.length;
        generateBonusInputs();
        data.bonusarray.forEach((b, i) => {
            const idx = i + 1;
            const nameEl = document.getElementById(`bonus-name-${idx}`);
            const srcEl = document.getElementById(`bonus-src-${idx}`);
            const codeEl = document.getElementById(`bonus-code-${idx}`);
            const soundEl = document.getElementById(`bonus-sound-${idx}`);
            const aspireEl = document.getElementById(`bonus-aspire-${idx}`);
            if (nameEl) nameEl.value = b.name || b.title || nameEl.value;
            if (srcEl) srcEl.value = b.src || b.name || srcEl.value;
            if (codeEl) codeEl.value = Array.isArray(b.code) ? b.code.join(',') : (b.code || codeEl.value);
            if (soundEl) soundEl.value = b.sound || b.soundName || soundEl.value;
            if (aspireEl) aspireEl.value = b.aspire || b.predrop || aspireEl.value;
        });
    }

    updatePreviewButtons();
}

function buildModboxJson() {
    const name = document.getElementById('name').value || '';
    const date = document.getElementById('date').value || '';
    const looptime = getIntValue('looptime');
    const bpm = getIntValue('bpm');
    const totalframe = getIntValue('totalframe');
    const bonusloopA = (document.getElementById('bonusloopA').value === 'true');
    const bonusendloopA = (document.getElementById('bonusendloopA').value === 'true');

    const colors = ['colBck','col0','col1','col2','col3','col4'].map(id => (document.getElementById(id).value || '#000000'));

    const animearray = [];
    for (let i = 1; i <= getIntValue('animearraylength'); i++) {
        const name = (document.getElementById(`polo-name-${i}`) || {}).value || '';
        const color = (document.getElementById(`polo-color-${i}`) || {}).value || '#000000';
        const uniqsnd = !!(document.getElementById(`polo-uniqsnd-${i}`) && document.getElementById(`polo-uniqsnd-${i}`).checked);
        animearray.push({ name, color, uniqsnd });
    }

    const bonusarray = [];
    for (let i = 1; i <= getIntValue('bonusarraylength'); i++) {
        const name = (document.getElementById(`bonus-name-${i}`) || {}).value || '';
        const src = (document.getElementById(`bonus-src-${i}`) || {}).value || '';
        const codeStr = (document.getElementById(`bonus-code-${i}`) || {}).value || '';
        const code = codeStr.split(',').map(s => parseInt(s.trim(),10)).filter(n => !isNaN(n));
        const sound = (document.getElementById(`bonus-sound-${i}`) || {}).value || '';
        const aspire = (document.getElementById(`bonus-aspire-${i}`) || {}).value || '';
        bonusarray.push({ name, src, code, sound, aspire });
    }

    return { name, date, looptime, bpm, totalframe, bonusloopA, bonusendloopA, colors, animearray, bonusarray };
}

function parsePreV9AppJs(content) {
    const match = content.match(/var\s+app\s*=\s*new\s*function\s*\(\)\s*\{([\s\S]*?)\};/);
    if (!match) return null;
    let body = match[1] || '';
    
    const forIdx = body.search(/for\s*\(var\s+/);
    if (forIdx !== -1) body = body.slice(0, forIdx);

    body = body.trim();

    const parts = [];
    let cur = '';
    let depth = 0;
    for (let i = 0; i < body.length; i++) {
        const ch = body[i];
        if (ch === '{' || ch === '[' || ch === '(') depth++;
        else if (ch === '}' || ch === ']' || ch === ')') depth = Math.max(0, depth - 1);

        if (ch === ',' && depth === 0) {
            parts.push(cur);
            cur = '';
        } else {
            cur += ch;
        }
    }
    if (cur.trim()) parts.push(cur);

    const processed = [];
    const deferred = [];

    parts.forEach(p => {
        let s = p.trim();
        if (!s) return;
        s = s.replace(/[;,]$/g, '').trim();
        const m = s.match(/^this\.([a-zA-Z0-9_]+)\s*=\s*([\s\S]*)$/);
        if (m) {
            const key = m[1];
            const val = m[2].trim();
            if (val.includes('this.')) {
                deferred.push({ key, val });
            } else {
                processed.push(`${key}: ${val}`);
            }
        } else {
            processed.push(s);
        }
    });

    const objLiteral = `{${processed.join(',')}}`;
    try {
        const obj = Function('return ' + objLiteral)();
        deferred.forEach(d => {
            if (d.key === 'recmintime') {
                if (obj.looptime !== undefined && obj.recminloop !== undefined) {
                    obj.recmintime = Math.round(obj.looptime / 1000) * obj.recminloop;
                }
            }
        });
        return obj;
    } catch (err) {
        console.error('Failed to parse pre-v9 app.js', err);
        return null;
    }
}