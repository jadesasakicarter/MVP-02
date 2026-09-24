const DOCSIFTER_URL = 'https://mvp-02-flax.vercel.app/';

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true});
});

chrome.action.onClicked.addListener(async (tab) => {
  if (tab?.windowId) await chrome.sidePanel.open({windowId: tab.windowId});
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type !== 'DROPBOX_CONTEXT') return;
  chrome.storage.session.set({dropboxContext: message.context});
  if (sender.tab?.windowId) chrome.sidePanel.open({windowId: sender.tab.windowId});
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== 'GET_DOCSIFTER_CONTEXT') {
    return false;
  }
  chrome.storage.session.get({dropboxContext: {url: '', title: ''}}).then(sendResponse);
  return true;
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === 'OPEN_DOCSIFTER') chrome.tabs.create({url: DOCSIFTER_URL});
});
