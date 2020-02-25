import React from "react";
import axios from "axios";
import ShiftCalculator from "./ShiftCalculator";
import Button from "../buttons/Button";
import BaiscInput from "../buttons/BasicInput";
import log from "loglevel";
import moment from "moment";
import { TimePicker, notification } from "antd";

class DayShift extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			index: props.index,
			format: "HH:mm",
			timesheetId: props.timesheetId,
			userInfo: props.userInfo,
			date: props.date,
			date_label: "Day " + props.index,
			startTime: this.props.startTime instanceof moment ? this.props.startTime.format(this.state.format) : this.props.startTime,
			endTime: this.props.endTime instanceof moment ? this.props.endTime.format(this.state.format) : this.props.endTime,
			breakTime: props.breakTime ? props.breakTime : "0",
			updateStatus: false,
			getTimesheet: this.props.getTimesheet
		};
		this.deleteShift = this.deleteShift.bind(this);
		this.updateShift = this.updateShift.bind(this);
		this.redirectToMain = this.redirectToMain.bind(this);
	}

	redirectToMain() {
		setTimeout(function() {
			window.location.href = "http://localhost:3000";
		}, 3500);
	}

	// TODO: Do not allow to delete previous data
	async deleteShift() {
		await axios
			.get("/timesheet/data/delete", {
				params: {
					id: this.state.userInfo.id,
					timesheetId: this.state.timesheetId
				}
			})
			.then(result => {
				if (result.status === 200 && result.data.affectedRows > 0) {
					this.state.getTimesheet();
					this.openNotificationWithIcon("success", " shift is deleted");
				} 
				else if (result.data.status === 'timeout') {
          this.openNotificationWithIcon("error", result.data.message);
          this.redirectToMain();
        }
				else {
					log.error("Fail to delete data", result);
					this.openNotificationWithIcon("error", "Fail to delete");
				}
			})
			.catch(err => {
				log.error(err);
				this.redirectToMain();
			});
	}

	async updateShift() {
		if (!(this.state.endTime <= this.state.startTime || this.state.startTime >= this.state.endTime)) {
			await axios
				.get("/timesheet/data/update", {
					params: {
						id: this.state.userInfo.id,
						timesheetId: this.state.timesheetId,
						date: this.state.date,
						startTime: this.state.startTime,
						endTime: this.state.endTime
					}
				})
				.then(result => {
					if (result.status === 200 && result.data.affectedRows > 0) {
						this.state.getTimesheet();
						this.openNotificationWithIcon("success", " shift is updated");
					} 
					else if (result.data.status === 'timeout') {
						this.openNotificationWithIcon("error", result.data.message);
						this.redirectToMain();
					}
					else {
						log.error("Fail to delete data", result);
						this.openNotificationWithIcon("error", " Fail to update");
					}
				})
				.catch(err => {
					log.error(err);
					this.redirectToMain();
				});
		} else {
			this.openNotificationWithIcon("error", ` Invalid Times. Check start time and end time`);
		}
	}

	setStartTime = time => {
		let startTime = moment(time).format(this.state.format);
		this.setState({ startTime }, () => {
			this.updateShift();
		});
	};

	setEndTime = time => {
		let endTime = moment(time).format(this.state.format);
		if(moment().format(this.state.startTime, "mm:ss") < endTime) {
			this.setState({ endTime }, () => {
				this.updateShift();
			});
		} else {
			this.openNotificationWithIcon("error", ` Invalid End Time!`);
		}
	};

	setNotAllowed = value => {
		this.openNotificationWithIcon("warning", "NOT Allowed to change the value DELETE and ADD the shift");
	};

	openNotificationWithIcon(type, text) {
		notification.config({
			placement: "topLeft"
		});
		if (type !== "warning") {
			notification[type]({
				message: this.state.date + [text]
			});
		} else {
			notification[type]({
				message: [text]
			});
		}
	}

	render() {
		if (this.props.historyMode) {
			return (
				<React.Fragment>
					<tr>
						<td>{this.state.date_label}</td>
						<td>
							<div className="ui label">
								{this.state.date_label}
							</div>
							<div className="ui small input">
								<input id={this.state.id} type="text" value={this.state.date} readOnly></input>
							</div>
						</td>
						<td>
							<div className="ui label">
								Start
							</div>
							<div className="ui small input">
								<input id={this.state.id} type="text" value={this.state.startTime} readOnly></input>
							</div>
						</td>
						<td>
							<div className="ui label">
								Break
							</div>
							<div className="ui small input">
								<input id={this.state.id} type="text" value={this.state.breakTime} readOnly></input>
							</div>
						</td>
						<td>
							<div className="ui label">
								End
							</div>
							<div className="ui small input">
								<input id={this.state.id} type="text" value={this.state.endTime} readOnly></input>
							</div>
						</td>
						<td>
							<ShiftCalculator startTime={this.state.startTime} endTime={this.state.endTime} breakTime={this.state.breakTime} />
						</td>
					</tr>
				</React.Fragment>
			);
		} else {
			return (
				<React.Fragment>
					<tr>
						<td>{this.state.date_label}</td>
						<td>
							<BaiscInput id={"dateInput[" + this.state.timesheetId + "]"} value={this.state.date} onClick={this.setNotAllowed} readOnly />
						</td>
						<td>
							<TimePicker id={"startTime[" + this.state.timesheetId + "]"} defaultValue={moment(this.state.startTime, this.state.format)} format={this.state.format} onChange={this.setStartTime} />
						</td>
						<td>
							<BaiscInput id={"breakTime[" + this.state.timesheetId + "]"} value={this.state.breakTime} onClick={this.setNotAllowed} readOnly />
						</td>
						<td>
							<TimePicker id={"endTime[" + this.state.timesheetId + "]"} defaultValue={moment(this.state.endTime, this.state.format)} format={this.state.format} onChange={this.setEndTime} />
						</td>
						<td>
							<ShiftCalculator startTime={this.state.startTime} endTime={this.state.endTime} breakTime={this.state.breakTime} />
						</td>
						<td>
							<Button text="DELETE" css="ui basic button" onClick={this.deleteShift} />
						</td>
					</tr>
				</React.Fragment>
			);
		}
	}
}

export default DayShift;
