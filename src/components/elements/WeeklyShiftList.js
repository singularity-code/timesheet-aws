import React from "react";
import DayShift from "./DayShift";
import moment from "moment";

class WeeklyShiftList extends React.Component {
	constructor(props) {
		super(props);
		this.historyMode = props.historyMode;
		this.items = [];
		this.totalHours = [];
		this.state = {
			data: props.data,
			items: [],
			userInfo: props.userInfo
		};
	}

	calTotal(startTime, endTime, breakTime) {
		let workHours = 0;
		if (endTime && startTime) {
			let gap = 0;
			let startDate = new Date("2019-07-09T" + startTime + "Z");
			let endDate = new Date("2019-07-09T" + endTime + "Z");
			gap = endDate - startDate;
			workHours = parseFloat((gap / 1000 / 60 / 60).toFixed(2));
		}
		if (breakTime) {
			workHours = parseFloat(workHours - (breakTime / 60).toFixed(2));
		}
		return workHours;
	}

	componentDidUpdate(prevProps, prevState) {
		let totalHours = 0;
		if (this.props.data !== this.state.data) {
			this.historyMode = this.props.historyMode;
				this.items = [];
				this.totalHours = [];
				let breakTime = 0;
				for (const [index, data] of this.props.data.entries()) {
					console.log("---", data);
					const date = moment(data.tdate).format("YYYY-MM-DD");
					breakTime = parseInt(data.breakTotal);
					this.items.push(
						<DayShift
							key={data.date}
							index={index + 1}
							historyMode={this.historyMode}
							timesheetId={data.timesheetId}
							date={date}
							startTime={data.startTime}
							endTime={data.endTime}
							breakTime={breakTime}
							getTimesheet={this.props.getTimesheet}
							userInfo={this.state.userInfo}
						/>
					);
					totalHours += this.calTotal(data.start_time, data.end_time, breakTime);
					this.totalHours = totalHours.toFixed(2);
				}
		}
	}

	render() {
		console.log(this.items)
		if (this.items.length !== 0) {
			return (
				<div className="ui middle aligned divided list">
					<div className="item">
						<table className="ui red striped table">
							<thead>
								<tr className="center aligned">
									<th></th>
									<th>Date</th>
									<th>Start Time</th>
									<th>Break Time</th>
									<th>End Time</th>
									<th>Working Hours</th>
									<th></th>
									<th></th>
									<th></th>
								</tr>
							</thead>
							<tbody>{this.items}</tbody>
							<tbody>
								<tr>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td style={{ padding: "15px", fontSize: "20px" }}>
										<b>Total {this.totalHours} hours</b>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			);
		} else {
			return <div className="ui horizontal divider">No Record</div>;
		}
	}
}

export default WeeklyShiftList;
