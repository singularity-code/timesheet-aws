import React from 'react';

class BasicInput extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
			id: props.id,
			type: props.type ? props.type : "text",
			label : props.label,
			readOnly : props.readOnly,
			value: props.value,
			onChange: props.onChange,
      onClick: props.onClick,
		}
	};
	render() {
		if(this.state.label) {
			return (
			<div className="ui small labeled input">
        <div className="ui label">
          {this.state.label}
        </div>
        <input id={this.state.id} type={this.state.text} defaultValue={this.state.value} data-keeper-lock-id="k-ekllwkyul27" onChange={this.state.onChange}></input>
			</div>
			)
		} else if (this.state.readOnly) {
			return (
				<div className="ui small input">
       	 <input id={this.state.id} type={this.state.text} defaultValue={this.state.value} onClick={this.state.onClick} readOnly></input>
      	</div>
			);
		} else if (this.state.label && this.state.readOnly ) {
			return (
			<div className="ui small labeled input">
        <div className="ui label">
          {this.state.label}
        </div>
        <input id={this.state.id} type={this.state.text} defaultValue={this.state.value} data-keeper-lock-id="k-ekllwkyul27" readOnly></input>
      </div>
			)
		} else {
			return (
				<div className="ui small input">
       	 <input id={this.state.id} type={this.state.text} defaultValue={this.state.value} onChange={this.state.onChange}></input>
      	</div>
			);
		}
	}
}

export default BasicInput;