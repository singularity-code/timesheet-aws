import React from 'react';
import ShiftCalculator from '../elements/ShiftCalculator';
import BasicInput from '../buttons/BasicInput';

class FormFragment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index : props.index,
      date : (props.date.length > 10) ? props.date.split('T')[0] : props.date,
      date_label : 'Day ' + props.index,
      startTime : props.startTime,
      endTime : props.endTime,
      breakTime : props.breakTime
    };
  };

  render() {
    return (
      <React.Fragment>
        <tr>
          <td><BasicInput value={this.state.date} /></td>
          <td><BasicInput value={this.state.startTime} /></td>
          <td><BasicInput value={this.state.breakTime} /></td>
          <td><BasicInput value={this.state.endTime} /></td>
          <td><ShiftCalculator
            label=""
            startTime={this.state.startTime}
            endTime={this.state.endTime}
            breakTime={this.state.breakTime}
            />
          </td>
        </tr>
      </React.Fragment>
    );
  };
};

export default FormFragment;
