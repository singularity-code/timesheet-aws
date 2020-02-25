import React from "react";

class ShiftCalculator extends React.Component {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.state = {
			label: props.label ? props.label : "Hours",
			result: this.onChange(props.startTime, props.endTime, props.breakTime),
			getTotalHours: props.getTotalHours
		};
	}

	// Algorithm: Total working hours = ((endTime - startTime) / 1000 / 60 / 60).toFixed(2) - (30 /60)
	onChange(startTime, endTime, breakTime) {
		let workHours = 0;
		if (endTime && startTime) {
			let gap = 0;
			let startDate = new Date("2019-07-09T" + startTime + "Z");
			let endDate = new Date("2019-07-09T" + endTime + "Z");
			gap = endDate - startDate;
			workHours = (gap / 1000 / 60 / 60).toFixed(2);
		}
		if (breakTime) {
			workHours = (workHours - breakTime / 60).toFixed(2);
		}
		return workHours;
	}

	componentDidUpdate(prevProps) {
		if (prevProps !== this.props) {
			let recalcuratedTotal = this.onChange(this.props.startTime, this.props.endTime, this.props.breakTime);
			this.setState({
				result: recalcuratedTotal
			});
		}
	}

	render() {
		return (
			<div className="ui right labeled input">
				<input type="text" placeholder="Total" value={this.state.result} readOnly />
				<div className="ui basic label">{this.state.label}</div>
			</div>
		);
	}
}

export default ShiftCalculator;
