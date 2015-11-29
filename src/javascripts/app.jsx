import domready from 'domready';
import React from 'react';
import ReactDom from 'react-dom';
import CropRect from './components/crop_rect';

const ipc = global.require('electron').ipcRenderer;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { cropMode: false };
  }

  onClickClip() {
    const url = document.getElementById('webview').getURL();
    if (!/^http:\/\/dl.ndl.go.jp\/info:ndljp\/pid\//.test(url)) return;
    this.setState({ cropMode: true });
  }

  onCropEnd(rect) {
    ipc.send('cropdata', JSON.stringify({
      rect: rect,
      url: document.getElementById('webview').getURL()
    }));
    this.setState({ cropMode: false });
  }
  
  renderCropRect() {
    return this.state.cropMode ? <CropRect onCropEnd={this.onCropEnd.bind(this)} /> : false;
  }
  
  render() {
    return (
      <div id="wrapper">
	    <div id="menu-bar">
	      <input type="text" id="url" defaultValue="http://dl.ndl.go.jp/"></input>
	      <button className="btn-load">Load</button>
	      <button className="btn-clip" onClick={this.onClickClip.bind(this)}>Clip</button>
	    </div>
	    <div id="webview_wrapper" className="webview">
	      <webview id="webview" src="http://dl.ndl.go.jp/" style={ { display: 'inline-block', width: '100%', height: '100%' } } />
          {this.renderCropRect()}
	    </div>
      </div>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDom.render(<App />, document.getElementById('container'));
});
