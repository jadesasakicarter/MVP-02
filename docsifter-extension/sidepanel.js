const title = document.querySelector('#context-title');
const url = document.querySelector('#context-url');
const frame = document.querySelector('#docsifter');
document.querySelector('#open-dashboard').onclick = () => chrome.runtime.sendMessage({type: 'OPEN_DOCSIFTER'});

function showContext(context) {
  if (!context?.url) return;
  title.textContent = context.fileName || context.title || 'Dropbox project';
  url.textContent = context.url;
}

chrome.runtime.sendMessage({type: 'GET_DOCSIFTER_CONTEXT'}, response => showContext(response?.dropboxContext));
chrome.storage.onChanged.addListener(changes => {
  if (changes.dropboxContext) showContext(changes.dropboxContext.newValue);
});
