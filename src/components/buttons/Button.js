import React from "react";

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: (props.key) ? props.key : Math.random().toString(36).substring(7),
      css: (props.css) ? props.css : "ui button",
      text: (props.text) ? props.text : "Button",
      icon: (props.icon) ? props.icon : "",
      onClick: props.onClick
    };
  }

  render() {
    return (
      <div>
        <button className={this.state.css} onClick={() => this.state.onClick()}>
          <i className={this.state.icon} /> {this.state.text}
        </button>
      </div>
    )
  }
}

export default Button;
