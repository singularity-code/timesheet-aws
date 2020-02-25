import React from 'react';
import { DatePicker, TimePicker, message, notification } from 'antd';
import moment from 'moment';

class DateAndTimes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      format: 'HH:mm',
      value: props.value,
      date : props.date,
      startTime : (props.startTime) ? props.startTime : '08:30',
      endTime : (props.endTime) ? props.endTime : '17:30',
      breakTime : (props.breakTime) ? props.breakTime : '0'
    };
    this.getValue = this.getValue.bind(this);
  };

  openNotificationWithIcon(type, text) {
    notification.config({
      placement: "topLeft"
    });
    notification[type]({
      message: [text]
    });
  }
  
  handleChange = value => {
    message.info(`Selected Time: ${value ? value.format('HH:mm') : 'None'}`);
    this.setState({ value });
  };

  setDate = (date) => {
    this.setState({ date });
  };

  setStartTime = startTime => {
    message.info(`Selected Time: ${startTime ? startTime.format('HH:mm') : 'None'}`);
    this.setState({ startTime });
  };

  setEndTime = endTime => {
    message.info(`Selected Time: ${endTime ? endTime.format('HH:mm') : 'None'}`);
    this.setState({ endTime });
  };

  getValue = () => {
    let values = {
      date : (this.state.date instanceof moment) ? this.state.date.format('YYYY-MM-DD') : this.props.date,
      startTime : (this.state.startTime instanceof moment) ? this.state.startTime.format(this.state.format) : this.state.startTime,
      endTime : (this.state.endTime instanceof moment) ? this.state.endTime.format(this.state.format) : this.state.endTime,
      breakTime1 : (this.state.breakTime1) ? this.state.breakTime1 : '0',
      breakTime2 : (this.state.breakTime2) ? this.state.breakTime2 : '0',
      breakTime3 : (this.state.breakTime3) ? this.state.breakTime3 : '0',
      breakTime4 : (this.state.breakTime4) ? this.state.breakTime4 : '0'
    }
    if(values.startTime && values.startTime === 'string') {
      let startTimeToFloat = values.startTime.replace(':', '.');
      startTimeToFloat = parseFloat(values.startTime);
      values.startTime = startTimeToFloat;
    }
    if(values.endTime && values.endTime === 'string') {
      let endTimeToFloat = values.endTime.replace(':', '.');
      endTimeToFloat = parseFloat(values.endTime);
      values.endTime = endTimeToFloat;
    }
    if(values.startTime < values.endTime) {
      return values;
    } else {
      this.openNotificationWithIcon("error", ` Invalid End Time!`);
    }
  }

  componentDidMount() {
    //console.log(this.props);
    if(this.props.breakTime1) {
      this.setState({ breakTime1 : this.props.breakTime1 });
      document.getElementById('b1_' + this.props.breakTime1).selected = true;
    }
    if(this.props.breakTime2) {
      this.setState({ breakTime2 : this.props.breakTime2 });
      document.getElementById('b2_' + this.props.breakTime2).selected = true;
    }
    if(this.props.breakTime3) {
      this.setState({ breakTime3 : this.props.breakTime3 });
      document.getElementById('b3_' + this.props.breakTime3).selected = true;
    }
    if(this.props.breakTime4) {
      this.setState({ breakTime4 : this.props.breakTime4 });
      document.getElementById('b4_' + this.props.breakTime4).selected = true;
    }
  }

  render() {
    const date = (this.state.date) ? moment(this.state.date) : moment(new Date());
    const startTime = (this.state.startTime) ? this.state.startTime : moment('08:30', this.state.format);
    const endTime = (this.state.endTime) ? this.state.endTime : moment('17:30', this.state.format);

    return (
      <div className="ui container">
        <div className="ui horizontal divider">
          <h4 className="ui header">
            <i aria-hidden="true" className="tag icon"></i>
            Daily Shift Form
          </h4>
        </div>
        <p>You <font color="red">can not</font> add <font color="red">same date</font> already inserted.</p>
        <p>If you had <b>ONE BREAKTIME</b>, just provide <b>ONE</b> of any of them.</p>
        <p>Accounting Issue: <font color="red">accounts@koi.edu.au</font></p>
        <p>Technical Issue: <font color="blue">itsupport@koi.edu.au</font></p>
        <div className="ui horizontal divider">
          <h4 className="ui header">
            <i aria-hidden="true" className="pencil icon"></i>
            Select Date & Time
          </h4>
        </div>
        <table className="ui definition table">
          <tbody>
            <tr>
              <td className="four wide">Date</td>
              <td><DatePicker id='datePicker' value={date} onChange={this.setDate}/></td>
            </tr>
            <tr>
              <td>Start Time</td>
              <td><TimePicker defaultValue={moment(startTime, this.state.format)} format={this.state.format} onChange={this.setStartTime} /></td>
            </tr>
            <tr>
              <td>End Time</td>
              <td>
                <TimePicker defaultValue={moment(endTime, this.state.format)} format={this.state.format} onChange={this.setEndTime} /></td>
            </tr>
            <tr>
              <td>1st Break Time</td>
              <td>
                <select
                  className="ui selection dropdown"
                  onChange={event => this.setState({ breakTime1 : event.target.value })}
                >
                  <option id='b1_0' value='0'>0</option>
                  <option id='b1_15' value="15">15</option>
                  <option id='b1_30' value="30">30</option>
                  <option id='b1_45' value="45">45</option>
                  <option id='b1_60' value="60">60</option>
                  <option id='b1_75' value="75">75</option>
                  <option id='b1_90' value="90">90</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>2nd Break Time</td>
              <td>
                <select
                  className="ui selection dropdown"
                  onChange={event => this.setState({ breakTime2 : event.target.value })}
                >
                  <option id='b2_0' value='0'>0</option>
                  <option id='b2_15' value="15">15</option>
                  <option id='b2_30' value="30">30</option>
                  <option id='b2_45' value="45">45</option>
                  <option id='b2_60' value="60">60</option>
                  <option id='b2_75' value="75">75</option>
                  <option id='b2_90' value="90">90</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>3rd Break Time</td>
              <td>
                <select
                  className="ui selection dropdown"
                  onChange={event => this.setState({ breakTime3 : event.target.value })}
                >
                  <option id='b3_0' value='0'>0</option>
                  <option id='b3_15' value="15">15</option>
                  <option id='b3_30' value="30">30</option>
                  <option id='b3_45' value="45">45</option>
                  <option id='b3_60' value="60">60</option>
                  <option id='b3_75' value="75">75</option>
                  <option id='b3_90' value="90">90</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>4th Break Time</td>
              <td>
                <select
                  className="ui selection dropdown"
                  onChange={event => this.setState({ breakTime4 : event.target.value })}
                >
                  <option id='b4_0' value='0'>0</option>
                  <option id='b4_15' value="15">15</option>
                  <option id='b4_30' value="30">30</option>
                  <option id='b4_45' value="45">45</option>
                  <option id='b4_60' value="60">60</option>
                  <option id='b4_75' value="75">75</option>
                  <option id='b4_90' value="90">90</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default DateAndTimes;
