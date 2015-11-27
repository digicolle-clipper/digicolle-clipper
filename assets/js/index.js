var ipcRenderer = require('electron').ipcRenderer;
function clip() {
	var url = document.getElementById('webview').getURL();
	ipcRenderer.send('asynchronous-message', '{"type":"showclip","url":"' + url + '"}');
}
