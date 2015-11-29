import domready from 'domready';
import React from 'react';
import ReactDom from 'react-dom';

import Modal from './components/crop_confirm_modal';
import RModal from 'react-modal';
import CropRect from './components/crop_rect';

const ipc = global.require('electron').ipcRenderer;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { cropMode: false, cropData: null };
    ipc.on('cropdata', (e, data) => {
      this.setState({
        cropData: Object.assign({ data: data }, this.parseCurrentDocumentInfo())
      });
    });
  }

  parseCurrentDocumentInfo() {
    const d = document.getElementById('webview').contentDocument
    d.querySelector('#sel-content-no option[selected="selected"]').innerText
    const els = d.querySelectorAll('.detail-metadata-list dd');
    const id = d.querySelectorAll('.simple-metadata-list dd')[0].innerText;
    const tmp = id.split('/');
    return {
      title: els[1].innerText.trim(),
      description: '',
      segment: Number(d.querySelector('#sel-content-no option[selected="selected"]').innerText),
      pid: Number(tmp[tmp.length - 1])
    }
  }

  onClickClip() {
    const url = document.getElementById('webview').contentDocument.location.href;
    if (!/^http:\/\/dl.ndl.go.jp\/info:ndljp\/pid\//.test(url)) return;
    this.setState({ cropMode: true });
  }

  onCropEnd(rect) {
    this.setState({ cropMode: false });
    setTimeout(() => {
      ipc.send('measure', JSON.stringify({
        rect: rect,
        url: document.getElementById('webview').contentDocument.location.href
      }));
    });
  }

  onCancelCrop() {
    this.setState({ cropData: null });
  }

  onSubmitCrop(data) {
    this.setState({ cropData: null });
    ipc.send('crop', JSON.stringify(data));
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
          <iframe id="webview"
                  src="http://dl.ndl.go.jp/info:ndljp/pid/909426"
                  style={ { display: 'inline-block', width: '100%', height: '100%' } }
          />
          {this.renderCropRect()}
        </div>
        <Modal data={this.state.cropData} onSubmit={this.onSubmitCrop.bind(this)} onCancel={this.onCancelCrop.bind(this)} />
      </div>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  RModal.setAppElement(document.getElementById('container'));
  ReactDom.render(<App />, document.getElementById('container'));
});
