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
      downPoint: { x: e.clientX, y: e.clientY - 40 }
    });
  }

  onMouseMove(e) {
    this.setState({
      x: e.clientX,
      y: e.clientY- 40
    });

    if (!this.state.cropping) return;

    this.setState({
      rect: createRect(
        this.state.downPoint,
        {
          x: e.clientX,
          y: e.clientY - 40
        }
      )
    });    
  }

  onMouseUp() {
    this.props.onCropEnd(this.state.rect)
    this.setState({ cropping: false, rect: {} });
  }
  
  render() {
    const rectStyle = {
      left: this.state.rect.x,
      top: this.state.rect.y,
      width: this.state.rect.width,
      height: this.state.rect.height
    }

    const cursorStyle = {
      left: this.state.x,
      top: this.state.y
    }
    
    return (      
      <div className="overlay"
           onMouseDown={this.onMouseDown.bind(this)}
           onMouseMove={this.onMouseMove.bind(this)}
           onMouseUp={this.onMouseUp.bind(this)} >
        <div className="rect" style={rectStyle} />
        <div className="cursor" style={cursorStyle}>
          <div className="indicator" />
        </div>
      </div>
    );
  }
}
