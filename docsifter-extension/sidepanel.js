const title = document.querySelector('#context-title');
const url = document.querySelector('#context-url');
const locationName = document.querySelector('#location-name');
const locationNote = document.querySelector('#location-note');
const search = document.querySelector('#project-search');
const status = document.querySelector('#search-status');
document.querySelector('#open-dashboard').onclick = () => chrome.runtime.sendMessage({type: 'OPEN_DOCSIFTER'});

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
  status.textContent = query
    ? `Search is ready for “${query}”. Connect a project index to return matching files.`
    : '';
});
