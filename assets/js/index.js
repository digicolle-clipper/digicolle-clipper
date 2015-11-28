var ipcRenderer = require('electron').ipcRenderer;

function clip() {
  var url = document.getElementById('webview').getURL();
  ipcRenderer.send('clipstart', '{"type":"showclip","url":"' + url + '"}');
}
