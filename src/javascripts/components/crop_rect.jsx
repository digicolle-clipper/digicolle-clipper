import React from 'react';

function createRect(a, b) {
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y)
  };
}

export default class CropRect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      cropping: false,
      downPoint: {},
      rect: {}
    };
  }

  onMouseDown(e) {
    this.setState({
      cropping: true,
      downPoint: { x: e.clientX, y: e.clientY }
    });
  }

  onMouseMove(e) {
    this.setState({
      x: e.clientX,
      y: e.clientY
    });
  }

  onMouseUp() {
    const rect = createRect(this.state.downPoint, { x: this.state.x, y: this.state.y });
    this.props.onCropEnd(rect)
    this.setState({ cropping: false, rect: {} });
  }

  renderGuide() {
    const cursorStyle = {
      left: this.state.x,
      top: this.state.y - 30
    }
    if (this.state.cropping) {
      const rect = createRect(this.state.downPoint, { x: this.state.x, y: this.state.y });
      const rectStyle = {
        left: rect.x,
        top: rect.y - 30,
        width: rect.width,
        height: rect.height
      }
      return (
        <div>
          <div className="rect" style={rectStyle} />
          <div className="cursor" style={cursorStyle}>
            <div className="indicator" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="cursor" style={cursorStyle}>
          <div className="indicator" />
        </div>
      );
    }
  }

  render() {
    return (
      <div className="overlay"
           onMouseDown={this.onMouseDown.bind(this)}
           onMouseMove={this.onMouseMove.bind(this)}
           onMouseUp={this.onMouseUp.bind(this)} >
        {this.renderGuide()}
      </div>
    );
  }
}
