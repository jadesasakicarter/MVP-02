const title = document.querySelector('#context-title');
const url = document.querySelector('#context-url');
const locationName = document.querySelector('#location-name');
const locationNote = document.querySelector('#location-note');
const search = document.querySelector('#project-search');
const status = document.querySelector('#search-status');
const results = document.querySelector('#search-results');
const connect = document.querySelector('#connect-dropbox');
document.querySelector('#open-dashboard').onclick = () => chrome.runtime.sendMessage({type: 'OPEN_DOCSIFTER'});
connect.onclick = () => {
  connect.disabled = true;
  connect.textContent = 'Connecting…';
  chrome.runtime.sendMessage({type: 'CONNECT_DROPBOX'}, response => {
    connect.disabled = false;
    connect.textContent = response?.connected ? 'Dropbox connected' : 'Connect Dropbox search';
    if (response?.error) status.textContent = response.error;
  });
};

function showContext(context) {
  if (!context?.url) return;
  title.textContent = context.fileName || context.title || 'Dropbox project';
  url.textContent = context.url;
  locationName.textContent = context.fileName || context.title || 'Dropbox project';
  locationNote.textContent = context.fileName ? 'Current Dropbox file detected.' : 'Current Dropbox folder detected.';
}

chrome.runtime.sendMessage({type: 'GET_DOCSIFTER_CONTEXT'}, response => showContext(response?.dropboxContext));
chrome.storage.onChanged.addListener(changes => {
  if (changes.dropboxContext) showContext(changes.dropboxContext.newValue);
});

search.addEventListener('input', () => {
  const query = search.value.trim();
  status.hidden = !query;
  if (!query) { status.textContent = ''; results.innerHTML = ''; return; }
  status.textContent = `Searching Dropbox for “${query}”…`;
  chrome.runtime.sendMessage({type: 'DROPBOX_SEARCH', query}, response => {
    if (response?.connected === false) { status.textContent = 'Connect Dropbox search to return matching files.'; return; }
    if (response?.error) { status.textContent = response.error; return; }
    const matches = response?.results || [];
    status.textContent = `${matches.length} matching Dropbox file${matches.length === 1 ? '' : 's'} found.`;
    results.innerHTML = matches.map(match => `<div class="result"><strong>${escapeHtml(match.name)}</strong><small>${escapeHtml(match.path)}</small></div>`).join('');
  });
});

function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character])); }
