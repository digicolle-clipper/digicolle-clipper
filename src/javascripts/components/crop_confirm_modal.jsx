import React from 'react';
import Modal from 'react-modal';

export default class CropConfirmModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: ''
    }
  }

  onChange(e) {
    this.setState({
      description: e.target.value
    });
  }

  onCancel(e) {
    e.preventDefault();
    this.props.onCancel();
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.onSubmit(Object.assign({}, this.props.data, { description: this.state.description }));
  }

  render() {
    const isOpen = !!this.props.data
    if (!isOpen) return false;
    return (
      <Modal isOpen={isOpen}>
        <div className="crop-thumbnail"><img src={this.props.data.data} /></div>
        <form className="form-horizontal">
          <div className="form-group">
            <label className="col-sm-2 control-label">タイトル</label>
            <div className="col-sm-10">
              <p className="form-control-static">{this.props.data.title}</p>
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">コメント</label>
            <div className="col-sm-10">
              <input className="form-control" onChange={this.onChange.bind(this)} />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">コマ番号</label>
            <div className="col-sm-10">
              <p className="form-control-static">{this.props.data.segment}</p>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button className="btn btn-default" onClick={this.onCancel.bind(this)}>キャンセル</button>
              <button className="btn btn-default" type ="submit" onClick={this.onSubmit.bind(this)}>投稿</button>
            </div>
          </div>
        </form>
      </Modal>
    );
  }
}

CropConfirmModal.propTypes = { onSubmit: React.PropTypes.func, onCancel: React.PropTypes.func };
CropConfirmModal.defaultProps = { onSubmit: function() {}, onCancel: function() {} };
