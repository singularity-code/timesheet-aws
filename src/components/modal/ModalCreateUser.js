import React, { Component } from 'react';
import moment from 'moment';
import { Form, Button, Modal } from 'semantic-ui-react';
import { notification } from 'antd';
import BasicButton from '../buttons/Button';

class ModalCreateUser extends Component {
  constructor(props) {
    super(props);
    this.timeElement = React.createRef();
    this.endTimeElement = React.createRef();
    this.state = {
      mode: props.mode,
      text: props.text,
      open: false,
      date: props.date ? props.date : moment().format('YYYY-MM-DD'),
      password: '',
      passwordConfirm: '',
      firstName: '',
      lastName: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  show = (size) => () => this.setState({ size, open: true });
  close = () => this.setState({ open: false });

  openNotificationWithIcon = function (type, text) {
    notification.config({
      placement: 'topLeft',
    });
    notification[type]({
      message: [text],
    });
  };

  handleSubmit() {
    if (!this.state.firstName || !this.state.lastName || !this.state.password || !this.state.passwordConfirm) {
      this.openNotificationWithIcon('warning', 'Please fill the form');
      return;
    }
    if (this.state.password !== this.state.passwordConfirm) {
      this.openNotificationWithIcon('warning', 'Password does not match.');
      return;
    }
    this.openNotificationWithIcon('success', `New user [${this.state.firstName} ${this.state.lastName}] created`);
    this.close();
  }
  setFirstname = (e) => {
    this.setState({ firstName: e.target.value });
    document.getElementById('input_id').value = this.state.firstName + '.' + this.state.lastName;
  };
  setLastname = (e) => {
    this.setState({ lastName: e.target.value });
    document.getElementById('input_id').value = this.state.firstName + '.' + e.target.value;
  };
  setId = (e) => {
    this.setState({ id: this.state.firstName + this.state.lastName });
  };
  setPassword = (e) => {
    this.setState({ password: e.target.value });
  };
  setPasswordConfirm = (e) => {
    this.setState({ passwordConfirm: e.target.value });
  };
  render() {
    const { open, size } = this.state;

    return (
      <div>
        <BasicButton text={this.state.text} css="ui red basic button" icon="small user plus alternate icon" onClick={this.show('small')}></BasicButton>

        <Modal size={size} open={open} onClose={this.close}>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <div className="ui container">
                  <div className="ui horizontal divider">
                    <h4 className="ui header">
                      <i aria-hidden="true" className="user plus icon"></i>
                      {this.state.text}
                    </h4>
                  </div>
                  <table className="ui definition table">
                    <tbody>
                      <tr>
                        <td>Position</td>
                        <td>
                          <select className="ui selection dropdown" style={{ padding: '0.6em' }} onChange={(event) => this.setState({ position: event.target.value })}>
                            <option id="p1" value="Casual">
                              Casual Staff
                            </option>
                            <option id="p2" value="PartTime">
                              Part Time Staff
                            </option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td>Department</td>
                        <td>
                          <select className="ui selection dropdown" style={{ padding: '0.6em' }} onChange={(event) => this.setState({ department: event.target.value })}>
                            <option id="d1" value="Admission">
                              Admission
                            </option>
                            <option id="d2" value="Enrolment">
                              Enrolment
                            </option>
                            <option id="d3" value="Examination">
                              Examination
                            </option>
                            <option id="d4" value="Academic">
                              Academic
                            </option>
                            <option id="d5" value="AcademicGrade">
                              Academic (Grade Amender)
                            </option>
                            <option id="d6" value="StudentService">
                              Student Service
                            </option>
                            <option id="d7" value="Library">
                              Library
                            </option>
                            <option id="d8" value="Marketing">
                              Marketing
                            </option>
                            <option id="d9" value="Reception">
                              Reception
                            </option>
                            <option id="d10" value="TeachingAndLearn">
                              Teaching and Learning
                            </option>
                            <option id="d11" value="IT Department">
                              IT Department
                            </option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td className="four wide">First Name</td>
                        <td>
                          <input pattern="^[A-Za-z0-9_]{1,15}$" onChange={this.setFirstname} />
                        </td>
                      </tr>
                      <tr>
                        <td className="four wide">Last Name</td>
                        <td>
                          <input id="input_lastName" pattern="^[A-Za-z0-9_]{1,15}$" onChange={this.setLastname} />
                        </td>
                      </tr>
                      <tr>
                        <td className="four wide">ID (Auto-Complete)</td>
                        <td>
                          <h2>
                            <input id="input_id" readOnly />
                          </h2>
                        </td>
                      </tr>
                      <tr>
                        <td className="four wide">Password</td>
                        <td>
                          <h3>
                            <input type="password" autoComplete="off" onChange={this.setPassword} />
                          </h3>
                        </td>
                      </tr>
                      <tr>
                        <td className="four wide">Confirm Password</td>
                        <td>
                          <h3>
                            <input type="password" autoComplete="off" onChange={this.setPasswordConfirm} />
                          </h3>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Form.Field>
              <Button className="ui fluid inverted green button" content={this.state.text} />
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default ModalCreateUser;
