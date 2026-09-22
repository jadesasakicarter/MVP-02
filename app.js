const files = [
  { name: 'Architectural Set Rev D', type: 'Architectural drawings', meta: 'PDF · 42 pages · Added 18 Sep', revision: 'Rev D' },
  { name: 'FF&E Schedule Rev 06', type: 'FF&E schedule', meta: 'PDF · 18 pages · Added 17 Sep', revision: 'Rev 06' },
  { name: 'Electrical Set Rev C', type: 'Electrical drawings', meta: 'PDF · 26 pages · Added 16 Sep', revision: 'Rev C' },
  { name: 'Client Meeting Notes — 12 Sep', type: 'Meeting notes', meta: 'PDF · 4 pages · Added 12 Sep', revision: '' },
  { name: 'Project Brief', type: 'Client brief', meta: 'PDF · 8 pages · Added 02 Sep', revision: '' },
  { name: 'Joinery Details Rev B', type: 'Joinery drawings', meta: 'PDF · 12 pages · Added 30 Aug', revision: 'Rev B' }
];
const checks = [
  { title: 'Tapware finish', tag: 'Drawing ↔ FF&E', body: 'A401 specifies brushed nickel tapware. FF&E Schedule specifies chrome tapware.', sources: ['A401 Bathroom Elevation, page 14', 'FF&E Schedule, page 6'] },
  { title: 'Pantry dimension', tag: 'Drawing ↔ Drawing', body: 'Plan indicates an 800mm pantry depth. Elevation indicates 750mm.', sources: ['A102 Ground Floor Plan, page 3', 'A401 Kitchen Elevation, page 12'] },
  { title: 'Ensuite heated towel rail', tag: 'FF&E ↔ Electrical', body: 'The heated towel rail is specified in FF&E, but electrical provision was not identified in the current electrical set.', sources: ['FF&E Schedule, page 9', 'Electrical Set Rev C, pages 4–8'] },
  { title: 'Bath removal', tag: 'Meeting notes ↔ Drawing', body: 'Meeting notes record that the bath was removed, but the latest plan appears to still show a bath.', sources: ['Client Meeting Notes — 12 Sep, page 2', 'A102 Ground Floor Plan, page 3'] }
];
const decisions = ['Pantry depth reduced', 'Fridge cavity increased to 800mm', 'Chrome tapware confirmed', 'Bath removed from ensuite'];
const fileMarkup = file => `<div class="file-item"><span class="file-icon">PDF</span><div><strong>${file.name}</strong><span>${file.type} · ${file.meta}</span></div><span class="revision">${file.revision}</span></div>`;

function renderFiles() {
  document.querySelector('#latest-files').innerHTML = files.slice(0, 3).map(fileMarkup).join('');
  document.querySelector('#file-list').innerHTML = files.map(fileMarkup).join('');
  document.querySelector('#document-count').textContent = `${files.length} documents indexed`;
}

renderFiles();
document.querySelector('#decisions-list').innerHTML = decisions.map((decision, index) => `<div class="decision"><span class="decision-index">0${index + 1}</span><strong>${decision}</strong><span>Decision identified in project records</span></div>`).join('');
document.querySelector('#checks').innerHTML = checks.map(item => `<article class="check-card"><div class="check-top"><span class="warning-icon">!</span><div><span class="check-tag">${item.tag}</span><h3>${item.title}</h3></div><span class="review-label">Review required</span></div><p>${item.body}</p><div class="sources"><span>Evidence used</span>${item.sources.map(source => `<button class="source">${source} ↗</button>`).join('')}</div><div class="check-actions"><button class="text-button source-button">View sources</button><button class="text-button intentional-button">Mark intentional</button><button class="button button-light resolve-button">Resolve</button></div></article>`).join('');

function goTo(section) { document.querySelectorAll('.tab').forEach(tab => tab.classList.toggle('active', tab.dataset.section === section)); document.querySelectorAll('.panel').forEach(panel => panel.classList.toggle('active-panel', panel.id === section)); window.scrollTo({ top: 0, behavior: 'smooth' }); }
function showToast(message) { const toast = document.querySelector('#toast'); toast.textContent = message; toast.classList.add('visible'); setTimeout(() => toast.classList.remove('visible'), 3000); }
document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => goTo(tab.dataset.section)));
document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => goTo(button.dataset.go)));
document.querySelector('#run-check').addEventListener('click', () => { goTo('check'); showToast('Project check complete — 4 items require review'); });
document.querySelectorAll('.intentional-button, .resolve-button').forEach(button => button.addEventListener('click', event => { event.target.closest('.check-card').classList.add('dismissed'); event.target.textContent = event.target.classList.contains('resolve-button') ? 'Resolved ✓' : 'Marked intentional ✓'; showToast('Review status updated'); }));
document.querySelector('#file-upload').addEventListener('change', event => { const uploaded = [...event.target.files].map(file => ({ name: file.name, type: 'Uploaded document', meta: `${(file.size / 1024 / 1024).toFixed(1)} MB · Just added`, revision: '' })); if (uploaded.length) { files.unshift(...uploaded); renderFiles(); showToast(`${uploaded.length} document${uploaded.length > 1 ? 's' : ''} indexed for review`); } });
document.querySelector('#project-search').addEventListener('input', event => { const query = event.target.value.trim().toLowerCase(); const result = document.querySelector('#search-results'); if (!query) { result.innerHTML = ''; return; } const matchedFiles = files.filter(file => `${file.name} ${file.type} ${file.meta}`.toLowerCase().includes(query)); const matchedChecks = checks.filter(check => `${check.title} ${check.tag} ${check.body} ${check.sources.join(' ')}`.toLowerCase().includes(query)); result.innerHTML = `${matchedFiles.map(file => `<button class="search-result" data-go="files"><span class="file-icon">PDF</span><span><strong>${file.name}</strong><small>${file.type} · ${file.meta}</small></span><span>↗</span></button>`).join('')}${matchedChecks.map(check => `<button class="search-result" data-go="check"><span class="warning-icon">!</span><span><strong>${check.title}</strong><small>${check.body}</small></span><span>↗</span></button>`).join('')}${!matchedFiles.length && !matchedChecks.length ? '<p class="empty-search">No indexed project information matched that search.</p>' : ''}`; result.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => goTo(button.dataset.go))); });
