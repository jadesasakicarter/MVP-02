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
  chrome.storage.session.get({dropboxContext: {url: '', title: ''}}).then(async ({dropboxContext}) => {
    // The side panel can open before Dropbox's content script has published its first update.
    // Ask the active tab for its URL so the panel works immediately after opening.
    const [activeTab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    if (activeTab?.url?.includes('dropbox.com')) {
      const title = activeTab.title || '';
      const fileName = title.replace(/\s*[-|].*$/, '').trim();
      const activeContext = {url: activeTab.url, title, path: new URL(activeTab.url).pathname, fileName, capturedAt: new Date().toISOString()};
      await chrome.storage.session.set({dropboxContext: activeContext});
      sendResponse({dropboxContext: activeContext});
      return;
    }
    sendResponse({dropboxContext});
  });
  return true;
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === 'OPEN_DOCSIFTER') chrome.tabs.create({url: DOCSIFTER_URL});
});
