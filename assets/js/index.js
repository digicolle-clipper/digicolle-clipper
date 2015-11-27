var ipcRenderer = require('electron').ipcRenderer;
function clip() {
	ipcRenderer.send('asynchronous-message', 'showclip');
}