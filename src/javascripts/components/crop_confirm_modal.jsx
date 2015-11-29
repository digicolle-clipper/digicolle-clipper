import React from 'react';
import Modal from 'react-modal';

export default class CropConfirmModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
    }
  }

  onChange(e) {
    this.setState({
      description: e.target.value
    });
  }

  onCancel() {
    this.props.onCancel();
  }

  onSubmit() {
    this.props.onSubmit(Object.assign({}, this.props.data, { description: this.state.description }));
  }

  render() {
    const isOpen = !!this.props.data
    if (!isOpen) return false;
    return (
      <Modal isOpen={isOpen}>
        <div className="crop-thumbnail"><img src={this.props.data.data} /></div>
        <div>{this.props.data.title}</div>
        <div><input onChange={this.onChange.bind(this)} /></div>
        <div>
          <button onClick={this.onCancel.bind(this)}>キャンセル</button>
          <button onClick={this.onSubmit.bind(this)}>投稿</button>
        </div>
      </Modal>
    );
  }
}

CropConfirmModal.propTypes = { onSubmit: React.PropTypes.func, onCancel: React.PropTypes.func };
CropConfirmModal.defaultProps = { onSubmit: function() {}, onCancel: function() {} };
