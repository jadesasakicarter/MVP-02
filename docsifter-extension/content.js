function readDropboxContext() {
  const title = document.title || '';
  const path = location.pathname;
  const fileName = title.replace(/\s*[-|].*$/, '').trim();
  return {url: location.href, title, path, fileName, capturedAt: new Date().toISOString()};
}

function publishContext() {
  chrome.runtime.sendMessage({type: 'DROPBOX_CONTEXT', context: readDropboxContext()});
}

publishContext();
let lastUrl = location.href;
setInterval(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    publishContext();
  }
}, 1000);
