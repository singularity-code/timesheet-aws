import React from "react";
import { Button, Dimmer, Loader } from "semantic-ui-react";

class Button_login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      visible: props.visible,
      userInfo : props.userInfo,
      onLoginClick : props.onLoginClick,
      setId : props.setId,
      setPassword : props.setPassword
    };
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(e) {
		if (e.key === "Enter") {
			e.preventDefault();
			this.state.onLoginClick();
		}
	}
  
	render() {
		return (
			<div>
				<h2 className="ui image header">
					<div className="content">
						<br />
						<table className="ui very basic table">
							<thead>
								<tr>
									<th width="90%">
										<h1>
											<i className="clock outline icon"></i>TIMESHEET
										</h1>
										<h5>{this.state.version}</h5>
									</th>
								</tr>
							</thead>
						</table>
					</div>
				</h2>
				<div className="ui placeholder segment">
					{this.state.loading && (
						<Dimmer active inverted>
							<Loader inverted>Loading</Loader>
						</Dimmer>
					)}
					<div className="ui two column very relaxed stackable grid">
						<div className="column">
							<div className="ui form">
								<div className="field">
									<label>User ID</label>
									<div className="ui left icon input">
										<input id="userId" type="text" placeholder="ID" onChange={event => this.state.setId(event.target.value)} onKeyPress={this.handleKeyPress} />
										<i className="user icon"></i>
									</div>
								</div>
								<div className="field">
									<label>Password</label>
									<div className="ui left icon input">
										<input type="password" placeholder="Password" onChange={event => this.state.setPassword(event.target.value)} onKeyPress={this.handleKeyPress} />
										<i className="lock icon"></i>
									</div>
								</div>
								<Button className="ui primary basic fluid button" disabled={this.state.visible} onClick={this.state.onLoginClick}>
									LOG IN
								</Button>
							</div>
						</div>
					</div>
					<div className="ui vertical divider">-</div>
				</div>
				<h5>
					* This is a prototype version
				</h5>
			</div>
		);
	}
}

export default Button_login;
