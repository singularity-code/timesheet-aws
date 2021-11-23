import React from "react";
import FormFragment from "./FormFragment";
import "./Form.css";
import BasicButton from "../buttons/Button";
import SignatureCanvas from "react-signature-canvas";
import { notification } from "antd";
import moment from "moment";

class Form extends React.Component {
	constructor(props) {
		super(props);
		this.week1 = [];
		this.week2 = [];
		this.totalHours = 0;
		this.child = React.createRef();
		this.historyMode = props.historyMode;
		this.state = {
			data: props.data,
			payrollWeeks: props.payrollWeeks,
			week1: [],
			week2: [],
			signatureURL: props.signatureURL,
			userInfo: props.userInfo,
			currentSeq: props.currentSeq
		};
	}

	calTotal(startTime, endTime, breakTime) {
		let workHours = 0;
		if (endTime && startTime) {
			let gap = 0;
			let startDate = new Date("2019-07-01T" + startTime + "Z");
			let endDate = new Date("2019-07-01T" + endTime + "Z");
			gap = endDate - startDate;
			workHours = parseFloat((gap / 1000 / 60 / 60).toFixed(2));
		}
		if (breakTime) {
			workHours = workHours - (breakTime / 60).toFixed(2);
		}
		return workHours;
	}

	componentDidUpdate(prevProps, prevState) {
		let sumTotal = 0;
		let week2Total = 0;
		if (prevState.data !== this.props.data) {
			this.setState({
				week1Total: 0,
				week2Total: 0
			});
			this.historyMode = this.props.historyMode;
			this.setState({
				data: this.props.data
			});
			this.setState({
				currentSeq: this.props.currentSeq
			});
			this.week1 = [];
			this.week2 = [];
			let breakTimeTotalw1 = 0;
			if (this.state.data.week1.length !== 0) {
				for (const [index, data] of this.state.data.week1.entries()) {
					const date = moment(data.tdate).format("DD-MM-YYYY");
					breakTimeTotalw1 = parseInt(data.breakTotal);
					this.week1.push(<FormFragment key={data.timesheetId} index={index + 1} date={date} startTime={data.start_time} endTime={data.end_time} breakTime={data.breakTotal} />);
					sumTotal += this.calTotal(data.start_time, data.end_time, breakTimeTotalw1);
					this.totalHours = sumTotal.toFixed(2);
				}
			}
			let breakTimeTotalw2 = 0;
			if (this.state.data.week2.length !== 0) {
				for (const [index, data] of this.state.data.week2.entries()) {
					const date = moment(data.tdate).format("DD-MM-YYYY");
					breakTimeTotalw2 = parseInt(data.breakTotal);
					this.week2.push(<FormFragment key={data.timesheetId} index={index + 1} date={date} startTime={data.start_time} endTime={data.end_time} breakTime={data.breakTotal} />);
					week2Total += this.calTotal(data.start_time, data.end_time, breakTimeTotalw2);
					this.setState({
						week2Total: week2Total
					});
				}
			}
		}
	}

	clearSigPad = () => {
		this.setState({ signatureURL: null }, function() {
			this.openNotificationWithIcon("success", "Digital Sign removed. Manually sign on the paper.");
		});
		this.sigPad.clear();
	};

	openNotificationWithIcon(type, text) {
		notification.config({
			placement: "topLeft"
		});
		notification[type]({
			message: [text]
		});
	}

	getSigPad = () => {
		this.setState({ signatureURL: this.sigPad.getCanvas().toDataURL("image/png") }, function() {
			this.openNotificationWithIcon("success", "The signature is saved");
		});
	};

	render() {
		let signatureURL = this.state.signatureURL;
    let signPad;
    let signature;
		let week1_table = null;
		let week2_table = null;
		const dateFormat = "DD/MM/YYYY";
		const seq = this.state.currentSeq ? this.state.currentSeq : 0;
		const this_monday = moment(this.state.payrollWeeks[seq].this_monday).format(dateFormat);
		const this_sunday = moment(this.state.payrollWeeks[seq].this_sunday).format(dateFormat);
		const next_monday = moment(this.state.payrollWeeks[seq].next_monday).format(dateFormat);
    const next_sunday = moment(this.state.payrollWeeks[seq].next_sunday).format(dateFormat);
    
    if(signatureURL) {
      signature = <div className="signatureImg"><img alt="Error: Please clear and sign manually" src={this.state.signatureURL} /> {this.state.userInfo.firstName} {this.state.userInfo.lastName} {moment().format(dateFormat)}</div>;
    } else {
      signature = `_____________________________________________`;
    }

		let department;
		if (this.state.userInfo.department === "ITAdminGrp" || this.state.userInfo.department === "ITGrp") {
			department = "IT Department";
		} else if ("AccGrp") {
			department = "Accounting";
		} else if ("ACDGrp") {
			department = "Academic";
		} else if ("AdmissionGrp") {
			department = "Admission";
		} else if ("CAADGrp") {
			department = "Admission (Casual)";
		} else if ("CAGrp") {
			department = "Academic (Casual)";
		} else if ("GradeAmender") {
			department = "Academic (Grade Amender)";
		} else if ("LibGrp") {
			department = "Library";
		} else if ("MGTGrp") {
			department = "Marketing";
		} else if ("RepGrp") {
			department = "Reception";
		} else if ("SSGrp") {
			department = "Student Service";
		} else if ("TALGrp") {
			department = "Teaching and Learning";
		} else {
			department = this.state.userInfo.department;
		}
		if (this.week1.length !== 0) {
			week1_table = (
				<table className="timesheet">
					<thead>
						<tr>
							<td>Date</td>
							<td>Start Time</td>
							<td>Break Time</td>
							<td>End Time</td>
							<td>Working Hours</td>
						</tr>
					</thead>
					<tbody>{this.week1}</tbody>
					<tbody>
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td className="pdf_total">Total Hours {this.totalHours}</td>
						</tr>
					</tbody>
				</table>
			);
		} else {
			week1_table = <div className="ui horizontal divider">No Record</div>;
		}
		if (this.week2.length !== 0) {
			week2_table = (
				<table className="timesheet">
					<thead>
						<tr>
							<td>Date</td>
							<td>Start Time</td>
							<td>Break Time</td>
							<td>End Time</td>
							<td>Working Hours</td>
						</tr>
					</thead>
					<tbody>{this.week2}</tbody>
					<tbody>
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td className="pdf_total">Total Hours {this.state.week2Total}</td>
						</tr>
					</tbody>
				</table>
			);
		} else {
			week2_table = <div className="ui horizontal divider">No Record</div>;
		}
		if (!this.historyMode) {
			signPad = (
				<div className="non-printable">
					<table className="sigContainer">
						<tbody>
							<tr>
								<td>
									<SignatureCanvas
										ref={ref => {
											this.sigPad = ref;
										}}
										penColor="black"
										canvasProps={{
											width: 350,
											height: 120,
											className: "sigCanvas"
										}}
									/>
								</td>
							</tr>
						</tbody>
					</table>
					<br />
					<BasicButton text="APPLY SIGN" css="ui left floated basic button" icon="large pencil alternate icon" onClick={this.getSigPad} />
					<BasicButton text="CLEAR SIGN" css="ui left floated basic button" icon="large trash alternate icon" onClick={this.clearSigPad} />
				</div>
			);
		} else {
			signPad = <div />;
		}
		return (
			<div>
				<div className="printable">
					<div className="contents">
						<table>
							<thead>
								<tr>
									<th rowSpan="4">
									</th>
									<th></th>
								</tr>
								<tr>
									<td className="koiDetails" align="right">
										Address
									</td>
								</tr>
								<tr>
									<td className="koiDetails" align="right">
										Email{" "}
									</td>
								</tr>
								<tr className="koiDetails" align="right">
									<td>Telephone </td>
								</tr>
							</thead>
						</table>
						<br />
						<p className="pdf_font_large">Casual Staff Time Sheet</p>
						<hr></hr>
						<p className="pdf_font_mid">
							Full Name: {this.state.userInfo.firstName} {this.state.userInfo.lastName}
						</p>
						<p className="pdf_font_mid">Department: {department}</p>
						<p className="pdf_font_mid">
							Pay Period : {this_monday} to {this_sunday}
						</p>
						<div className="pdf_timetable">
							{week1_table}
							<br />
							<p className="pdf_font_mid">
								Pay Period : {next_monday} to {next_sunday}
							</p>
							{week2_table}
						</div>
						<div className="pdf_footer">
							<p />
							<div>Signature: {signature}</div>
							<p />
							<p />
							<p>Authorised: __________________________________________ </p>
						</div>
					</div>
				</div>
				{signPad}
			</div>
		);
	}
}

export default Form;
