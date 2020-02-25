import React, { Component } from 'react'
import axios from 'axios';
import moment from 'moment';
import { Form, Button, Modal } from 'semantic-ui-react'
import { notification } from 'antd';
import log from 'loglevel';
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
      date: (props.date) ? props.date : moment().format('YYYY-MM-DD'),
      password: '',
      firstName: '',
      lastName: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  show = size => () => this.setState({ size, open: true })
  close = () => this.setState({ open: false })

  openNotificationWithIcon(type, text) {
    notification.config({
      placement: 'topLeft'
    });
    notification[type]({
      message: [text],
    });
  };

  async handleSubmit() {
    if(this.state.mode === 'create') {
      const res = await axios.get('timesheet/user/checkUser', {
        params: {
          surName : this.state.lastName,
          givenName : this.state.firstName,
          id : this.state.firstName + '.' + this.state.lastName
        }
      }).catch(err => {
        log.error(err);
      });
      if(res && res.data[0] && res.data[0].STAFF_ID) {
        this.openNotificationWithIcon('warning', res.data[0].GIVEN_NM + '.' + res.data[0].SURNM + ' IS ALREADY EXIST IN SIMS!');
        this.openNotificationWithIcon('warning', 'Note: ' + res.data[0].REMARK);
        return false;
      }
      
      if(res.data && res.data.length === 0) {
        await axios.get('timesheet/data/user/createUser', {
          params: {
            id : this.state.firstName + '.' + this.state.lastName,
            password : this.state.password,
            firstName : this.state.firstName,
            lastName : this.state.lastName,
            department : this.state.department ? this.state.department : "Unknown",
            position : this.state.position ? this.state.position : "Casual"
          }
        }).then(result => {
          if(result.status === 200 && result.data.affectedRows > 0) {
            this.openNotificationWithIcon('success', this.state.firstName + '.' + this.state.lastName + ' is created successfully');
          } else if (result.status === 304) {
            this.openNotificationWithIcon('error', this.state.firstName + '.' + this.state.lastName + ' IS ALREADY EXIST!');
          } else if (result.data.status === 'timeout') {
            this.openNotificationWithIcon("error", result.data.message);
            setTimeout(function() {
              window.location.href = "http://localhost:3000";
            }, 5000);
          } else {
            this.openNotificationWithIcon('error', 'Fail to create a new user');
          }
          this.close();
        });
      } else {
        this.openNotificationWithIcon('error', this.state.firstName + '.' + this.state.lastName + ' could not created');
      }
    }
  }

  setFirstname = (e) => {
    this.setState({ firstName : e.target.value });
    document.getElementById('input_id').value = this.state.firstName + '.' + this.state.lastName;
  }

  setLastname = (e) => {
    this.setState({ lastName : e.target.value });
    document.getElementById('input_id').value = this.state.firstName + '.' + e.target.value;
  }

  setId = (e) => {this.setState({ id : this.state.firstName + this.state.lastName })}
  setPassword = (e) => {this.setState({ password : e.target.value})}

  render() {
    const { open, size } = this.state;
    
    return (
      <div>
        <BasicButton
          text = {this.state.text}
          css = "ui red basic button"
          icon = "small user plus alternate icon"
          onClick={this.show('small')}
        ></BasicButton>

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
                        <select
                          className="ui selection dropdown"
                          style={{padding: '0.6em'}}
                          onChange={event => this.setState({ position : event.target.value })}
                        >
                          <option id='p1' value='Casual'>Casual Staff</option>
                          <option id='p2' value="PartTime">Part Time Staff</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td>Department</td>
                      <td>
                        <select
                          className="ui selection dropdown"
                          style={{padding: '0.6em'}}
                          onChange={event => this.setState({ department : event.target.value })}
                        >
                          <option id='d1' value="Admission">Admission</option>
                          <option id='d2' value="Enrolment">Enrolment</option>
                          <option id='d3' value="Examination">Examination</option>
                          <option id='d4' value="Academic">Academic</option>
                          <option id='d5' value="AcademicGrade">Academic (Grade Amender)</option>
                          <option id='d6' value="StudentService">Student Service</option>
                          <option id='d7' value="Library">Library</option>
                          <option id='d8' value="Marketing">Marketing</option>
                          <option id='d9' value="Reception">Reception</option>
                          <option id='d10' value="TeachingAndLearn">Teaching and Learning</option>
                          <option id='d11' value="IT Department">IT Department</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td className="four wide">First Name</td>
                      <td><input pattern="^[A-Za-z0-9_]{1,15}$" onChange={this.setFirstname}/></td>
                    </tr>
                    <tr>
                      <td className="four wide">Last Name</td>
                      <td><input id='input_lastName' pattern="^[A-Za-z0-9_]{1,15}$" onChange={this.setLastname}/></td>
                    </tr>
                    <tr>
                      <td className="four wide">ID (Auto-Complete)</td>
                      <td><h2><input id='input_id' readOnly/></h2></td>
                    </tr>
                    <tr>
                      <td className="four wide">Password</td>
                      <td><h3><input type="password" onChange={this.setPassword}/></h3></td>
                    </tr>
                    <tr>
                    <td className="four wide">Confirm Password</td>
                      <td><h3><input type="password" onChange={this.setPassword}/></h3></td>
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
    )
  }
}

export default ModalCreateUser
