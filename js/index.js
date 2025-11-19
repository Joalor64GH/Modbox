const changelogIcon = document.querySelector('.changelog-icon');
const changelogModal = document.getElementById('changelog-modal');
const closeChangelog = document.getElementById('close-changelog');
const changelogContainer = document.getElementById('changelog-container');
const versionText = document.querySelector('#version-icon text');

changelogIcon.addEventListener('click', () => {
    changelogModal.style.display = 'block';
});
closeChangelog.addEventListener('click', () => {
    changelogModal.style.display = 'none';
});
window.addEventListener('click', (e) => {
    if (e.target === changelogModal) {
        changelogModal.style.display = 'none';
    }
});

fetch('CHANGELOG.md')
    .then(res => res.text())
    .then(md => {
        let html = marked.parse(md);

        html = html.replace(/\(Latest\)/g, `<span class="latest-badge">LATEST</span>`);

        changelogContainer.innerHTML = html;

        const match = md.match(/^## \[(V[0-9.]+)\]/m);
        if (match && versionText) {
            versionText.textContent = match[1];
        }
    })
    .catch(err => {
        changelogContainer.innerHTML = `<p>Error loading changelog 😢</p>`;
        console.error(err);
    });
