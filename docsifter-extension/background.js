const DOCSIFTER_URL = 'https://mvp-02-flax.vercel.app/';
const DROPBOX_APP_KEY = 'hldrqetlw199hjp';

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
  if (message.type === 'CONNECT_DROPBOX') {
    connectDropbox().then(sendResponse).catch(error => sendResponse({error: error.message}));
    return true;
  }
  if (message.type === 'DROPBOX_SEARCH') {
    searchDropbox(message.query).then(sendResponse).catch(error => sendResponse({error: error.message}));
    return true;
  }
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

async function connectDropbox() {
  const redirectUri = chrome.identity.getRedirectURL();
  const verifier = [...crypto.getRandomValues(new Uint8Array(32))].map(value => value.toString(16).padStart(2, '0')).join('');
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  const challenge = btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const authUrl = new URL('https://www.dropbox.com/oauth2/authorize');
  authUrl.search = new URLSearchParams({client_id: DROPBOX_APP_KEY, response_type: 'code', token_access_type: 'offline', redirect_uri: redirectUri, code_challenge: challenge, code_challenge_method: 'S256', scope: 'files.metadata.read files.content.read'});
  const responseUrl = await chrome.identity.launchWebAuthFlow({url: authUrl.toString(), interactive: true});
  const code = new URL(responseUrl).searchParams.get('code');
  if (!code) throw new Error('Dropbox authorization was cancelled.');
  const tokenResponse = await fetch('https://api.dropboxapi.com/oauth2/token', {method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: new URLSearchParams({code, grant_type: 'authorization_code', client_id: DROPBOX_APP_KEY, redirect_uri: redirectUri, code_verifier: verifier})});
  if (!tokenResponse.ok) throw new Error('Dropbox token exchange failed.');
  const token = await tokenResponse.json();
  await chrome.storage.local.set({dropboxAccessToken: token.access_token});
  return {connected: true};
}

async function searchDropbox(query) {
  const {dropboxAccessToken} = await chrome.storage.local.get('dropboxAccessToken');
  if (!dropboxAccessToken) return {connected: false, results: []};
  const response = await fetch('https://api.dropboxapi.com/2/files/search_v2', {method: 'POST', headers: {'Authorization': `Bearer ${dropboxAccessToken}`, 'Content-Type': 'application/json'}, body: JSON.stringify({query, options: {filename_only: false, max_results: 20}})});
  if (!response.ok) throw new Error('Dropbox search failed. Reconnect Dropbox and try again.');
  const data = await response.json();
  return {connected: true, results: (data.matches || []).map(match => ({name: match.metadata?.name || 'Untitled file', path: match.metadata?.path_display || ''}))};
}

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === 'OPEN_DOCSIFTER') chrome.tabs.create({url: DOCSIFTER_URL});
});
