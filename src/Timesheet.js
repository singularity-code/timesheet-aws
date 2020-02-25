import React from "react";
import axios from "axios";
import moment from "moment";
import WeeklyShiftList from "./components/elements/WeeklyShiftList"
import { Button, Menu, Segment, Sidebar, Dimmer, Loader } from "semantic-ui-react";
import BasicButton from "./components/buttons/Button";
import Modal from "./components/modal/Modal";
import ModalCreateUser from "./components/modal/Modal_createUser";
import ModalChangePassword from "./components/modal/Modal_changePassword";
import ReactToPrint from "react-to-print";
import Form from "./components/form/Form";
import log from "loglevel";
import { notification } from "antd";
import "./Timesheet.css";
import ButtonLogin from "./components/buttons/Button_login";

class Timesheet extends React.Component {

	constructor(props) {
		super(props);
		const format = "YYYY-MM-DD";
		const this_monday = moment().day(1).format(format);
		const this_sunday = moment().day(7).format(format);
		const next_monday = moment().day(8).format(format);
		const next_sunday = moment().day(14).format(format);
		this.historyMode = false;
		this.state = {
			version: "2020.01",
			userInfo: {
				token: "",
				department: ""
			},
			siteInfo: {
				siteCode: "",
				activate: false,
				id: "",
				key: ""
			},
			error: null,
			payrollWeeks: {
				this_monday: this_monday,
				this_sunday: this_sunday,
				next_monday: next_monday,
				next_sunday: next_sunday
			},
			format: format,
			data: { week1: [], week2: [] },
			records: [],
			recordsItems: [],
			visible: false,
			handleHideClick: () => this.setState({ visible: false }),
			handleShowClick: () => this.setState({ visible: true }),
			handleSidebarHide: () => this.setState({ visible: false })
		};
		this.data = {
			week1: [],
			week2: []
		}
		this.onRecordClick = this.onRecordClick.bind(this);
		this.getTimesheet = this.getTimesheet.bind(this);
		this.onCurrentClick = this.onCurrentClick.bind(this);
		this.onLogOutClick = this.onLogOutClick.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.redirectToMain = this.redirectToMain.bind(this);
		this.setId = this.setId.bind(this);
		this.setPassword = this.setPassword.bind(this);
	}

	onCurrentClick() {
		this.historyMode = false;
		this.getTimesheet();
	}

	redirectToMain() {
		setTimeout(function() {
			window.location.href = "http://localhost:3000";
		}, 5000);
	}

	async onRecordClick(e) {
		const result = {};

		this.setState({
			loading: true,
			data: { week1: [], week2: [] }
		});
		this.historyMode = true;
		if (e.target.id) {
			let selectedRec = this.state.records[e.target.id];
			const payrollWeeks = {};
			payrollWeeks.this_monday = selectedRec.startDate;

			//date format must be YYYY-MM-DD to get correct record
			// prettier-ignore
			payrollWeeks.this_sunday = moment(payrollWeeks.this_monday).day(7).format("YYYY-MM-DD");
			payrollWeeks.next_monday = moment(payrollWeeks.this_monday).day(8).format("YYYY-MM-DD");
			payrollWeeks.next_sunday = selectedRec.endDate;

			const week1 = await axios.get("/timesheet/app/read", {
					params: {
						startDate: payrollWeeks.this_monday,
						endDate: payrollWeeks.this_sunday,
						id: this.state.userInfo.id,
						token: this.state.userInfo.token
					}
				}).catch(err => {
					log.error(err);
				});
			const week2 = await axios.get("/timesheet/app/read", {
					params: {
						startDate: payrollWeeks.next_monday,
						endDate: payrollWeeks.next_sunday,
						id: this.state.userInfo.id,
						token: this.state.userInfo.token
					}
				}).catch(err => {
					log.error(err);
				});
			result.week1 = week1.data;
			result.week2 = week2.data;
			result.currentSeq = selectedRec.seqId;

			this.setState({
				data: result,
				loading: false
			});
		} else {
			log.error("Error: No event target id", e);
		}
	}

	async getTimesheet() {
		const result = {};
		const seq = this.state.currentSeq;
		if (this.payrollWeeks.length > 0) {
			await axios.get("/timesheet/app/read", {
					params: {
						startDate: this.payrollWeeks[seq].this_monday,
						endDate: this.payrollWeeks[seq].this_sunday,
						token: this.state.userInfo.token
					}
				}).then(response => {
					result.week1 = response.data;
				});
			await axios.get("/timesheet/app/read", {
					params: {
						startDate: this.payrollWeeks[seq].next_monday,
						endDate: this.payrollWeeks[seq].next_sunday,
						token: this.state.userInfo.token
					}
				}).then(response => {
					result.week2 = response.data;
				});
			this.setState({
				data: result
			});
			log.debug("Timesheet", result);
		}
	}

	async getRecords() {
		if (this.state.userInfo.token) {
			await axios.get("/timesheet/data/records", {
					params: {
						id: this.state.userInfo.id,
						token: this.state.userInfo.token
					}
				}).then(response => {
					if (!response) {
						log.debug("Records", response);
					} else {
						this.setState({ records: response.data }, this.openNotificationWithIcon("info", "You have " + response.data.length + " timesheet records"));
					}
				}).catch(err => {
					log.error(err);
				});
		}
	}

	createPayrollSeq() {
		let firstDay = "2019-07-01";
		let payrollWeeks = [];
		for (let i = 0; i < 27; i++) {
			payrollWeeks.push({
				this_monday: moment(firstDay).day(1).format(this.state.format),
				this_sunday: moment(firstDay).day(7).format(this.state.format),
				next_monday: moment(firstDay).day(8).format(this.state.format),
				next_sunday: moment(firstDay).day(14).format(this.state.format)
			});
			firstDay = moment(firstDay).day(15).format(this.state.format);
		}
		this.payrollWeeks = payrollWeeks;
		this.setState({ payrollWeeks: payrollWeeks });
	}

	getCurrentPayrollSeq() {
		for (let i = 0; i < this.payrollWeeks.length; i++) {
			const today = moment();
			if (today.isBetween(this.payrollWeeks[i].this_monday, this.payrollWeeks[i].next_sunday)) {
				this.setState({ currentSeq: i });
			}
		}
	}

	componentDidMount() {
		this.createPayrollSeq();
		this.getCurrentPayrollSeq();
		// this.getRecords();
		if (!this.state.historyMode) {
			this.setState({
				data: { week1: [], week2: [] }
			});
		}
	}

	openNotificationWithIcon(type, text) {
		notification.config({
			placement: "topLeft"
		});
		notification[type]({
			message: [text]
		});
	}

	componentDidUpdate(prevProps, prevState) {
		for (const [index, data] of this.state.records.entries()) {
			const result = data.startDate + " - " + data.endDate;
			this.state.recordsItems.push(
				<Menu.Item id={index} key={index} as="a" onClick={this.onRecordClick}>
					{result}
				</Menu.Item>
			);
		}
		if (prevState.payrollWeeks !== this.payrollWeeks) {
			if(this.state.userInfo.token) {
				this.getTimesheet();
			}
		}
	}

	handleKeyPress(e) {
		if (e.key === "Enter") {
			e.preventDefault();
			this.onLoginClick();
		}
	}

	setId(inputValue) {
		this.setState({ id: inputValue });
	}

	setPassword(inputValue) {
		this.setState({ pw: inputValue });
	}

	onLoginClick = () => {
		this.setState({ loading: true });
		if (!this.state.id) {
			this.setState({
				loading: false
			});
		}
		if (!this.state.pw) {
			this.setState({
				loading: false
			});
		}
		this.setState({
			userInfo: {
				token: "ACKJ@I#JRI",
				department: "test",
				firstName: "Test",
				lastName: "Account",
				origin: "master",
				accessLevel: "1",
				id: "test",
			}
		}, () => {
			this.getTimesheet();
			this.getRecords();
			this.setState({ loading: false });
		})
	}

	async onLogOutClick() {
		this.setState({ loading: true });
		await axios.get("/timesheet/user/logout", {
				params: {
					token: this.state.userInfo.token
				}
			}).then(response => {
				this.setState({ loading: false });
				if (response.data.status === "timeout") {
					this.openNotificationWithIcon("error", response.data.message);
					this.redirectToMain();
				} else {
					this.setState(
						{
							records: [],
							recordsItems: [],
							data: { week1: [], week2: [] },
							userInfo: {
								//loggedIn: false
							},
							id: "",
							pw: ""
						},
						function() {
							this.openNotificationWithIcon("success", "Logout Successfully");
						}
					);
				}
				this.setState({ loading: false });
			});
	}

	updateShift = (data) => {
		console.log(data);
		this.data.week1.push(data);
		console.log(this.data)
	}

	render() {
		const dateFormat = "DD/MM/YYYY";
		const visible = this.state.visible;
		let timesheet;
		let createBtn;
		let segments;
		let passChgBtn;
		let currentBtn;
		
		let this_monday;
		let this_sunday;
		let next_monday;
		let next_sunday;

		if (this.state.payrollWeeks.length > 0) {
			this_monday = moment(this.state.payrollWeeks[this.state.currentSeq].this_monday).format(dateFormat);
			this_sunday = moment(this.state.payrollWeeks[this.state.currentSeq].this_sunday).format(dateFormat);
			next_monday = moment(this.state.payrollWeeks[this.state.currentSeq].next_monday).format(dateFormat);
			next_sunday = moment(this.state.payrollWeeks[this.state.currentSeq].next_sunday).format(dateFormat);
		}

		if (this.state.userInfo.origin !== "SIMS") {
			passChgBtn = <ModalChangePassword text="Change Password" mode="edit" id={this.state.id} />;
		} else {
			passChgBtn = <div></div>;
		}
		if (this.state.userInfo.accessLevel > 0) {
			createBtn = <ModalCreateUser text="USER CRAFT" mode="create" userInfo={this.state.userInfo} />;
		} else {
			createBtn = <div></div>;
		}
		if (this.historyMode !== false) {
			currentBtn = (
				<Button className="ui right floated teal basic button" disabled={visible} onClick={this.onCurrentClick}>
					<i className="redo icon"></i>BACK TO CURRENT
				</Button>
			);
		} else {
			currentBtn = <div></div>;
		}
		if (!this.state.userInfo.token) {
			segments = "";
			timesheet = <div><ButtonLogin loading={this.state.loading} visible={visible} onLoginClick={this.onLoginClick} userInfo={this.state.userInfo} setId={this.setId} setPassword={this.setPassword}></ButtonLogin></div>;
		} else {
			segments = (
				<Segment basic>
					{this.state.loading && (
						<Dimmer active inverted>
							<Loader inverted>Loading</Loader>
						</Dimmer>
					)}
					{currentBtn}
					<Button className="ui right floated orange basic button" disabled={visible} onClick={this.state.handleShowClick}>
						<i className="clock outline icon"></i>TIMESHEET HISTORY
					</Button>
					<br />
					<h3>
						{this_monday} ~ {this_sunday}
					</h3>
					<WeeklyShiftList data={this.state.data.week1} historyMode={this.historyMode} getTimesheet={this.getTimesheet} userInfo={this.state.userInfo} />
					<br />
					<h3>
						{next_monday} ~ {next_sunday}
					</h3>
					<WeeklyShiftList data={this.state.data.week2} historyMode={this.historyMode} getTimesheet={this.getTimesheet} userInfo={this.state.userInfo} />
					<div style={{ marginBottom: "50px" }}>
						<Modal getTimesheet={this.getTimesheet} userInfo={this.state.userInfo} historyMode={this.historyMode} updateShift={this.updateShift}/>
						<Form
							ref={el => (this.componentRef = el)}
							payrollWeeks={this.state.payrollWeeks}
							data={this.state.data}
							historyMode={this.historyMode}
							userInfo={this.state.userInfo}
							currentSeq={this.state.currentSeq}
						/>
						<ReactToPrint trigger={() => <BasicButton text="PRINT" css="ui right floated basic button" icon="large print icon" />} content={() => this.componentRef} />
					</div>
				</Segment>
			);
			timesheet = (
				<div>
					<br />
					<div className="right menu">
						<div>
							<div align="right">
								<h2>
									{this.state.userInfo.firstName} {this.state.userInfo.lastName}
								</h2>
								<Button className="ui right floated red basic button" disabled={visible} onClick={this.onLogOutClick}>
									LOG OUT
								</Button>
								{passChgBtn}
							</div>
							{createBtn}
						</div>
						<div className="ui action left icon input"></div>
					</div>
					<br />
					<div>
						<Sidebar.Pushable as={Segment}>
							<Sidebar as={Menu} animation="scale down" direction="right" icon="labeled" inverted onHide={this.state.handleSidebarHide} vertical visible={visible}>
								{this.state.recordsItems}
							</Sidebar>
							<Sidebar.Pusher dimmed={visible}>{segments}</Sidebar.Pusher>
						</Sidebar.Pushable>
					</div>
				</div>
			);
		}
		return (
			<div className="ui fluid container" style={{ width: "85%" }}>
				{timesheet}
			</div>
		);
	}
}

export default Timesheet;
