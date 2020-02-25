import React, { Component } from 'react'
import axios from 'axios';
import moment from 'moment';
import { Form, Button } from 'semantic-ui-react'
import { Modal } from 'semantic-ui-react'
import { notification } from 'antd';
import BasicButton from '../buttons/Button';
import log from 'loglevel';

class ModalChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.text,
      open: false,
      date: (props.date) ? props.date : moment().format('YYYY-MM-DD'),
      password: '',
      firstName: '',
      lastName: '',
      id: props.id
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
    if(this.state.password === this.state.passwordChk) {
      this.openNotificationWithIcon('success', 'Password Matched');
      const result = await axios.put('/timesheet/data/user/changePwd', {
        params: {
          id : this.state.id,
          password : this.state.password
        }
      }).catch(err => {
        log.error(err);
      });
      if(result.status === 200 && result.data.affectedRows > 0) {
        this.openNotificationWithIcon('success', 'Password Changed Successfully!');
        this.close();
      } 
      else if (result.data.status === 'timeout') {
        this.openNotificationWithIcon("error", result.data.message);
        setTimeout(function() {
          window.location.href = "http://localhost:3000";
        }, 5000);
      }
      else {
        this.openNotificationWithIcon('error', 'Fail to change password');
        log.error('Fail to update data', result);
      }
    } else {
      this.openNotificationWithIcon('error', 'Password Not Matched !!!');
    }
  } 
  
  setPassword = (e) => {this.setState({ password : e.target.value })};

  setPasswordChk = (e) => {this.setState({ passwordChk : e.target.value })};

  render() {
    const { open, size } = this.state;
    return (
      <div>
        <BasicButton
          text = {this.state.text}
          css = "ui right floated basic basic button"
          onClick={this.show('small')}
        ></BasicButton>

        <Modal size={size} open={open} onClose={this.close}>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <div className="ui container">
                  <div className="ui horizontal divider">
                    <h4 className="ui header">
                      <i className="user secret icon"></i>
                      {this.state.text}
                    </h4>
                  </div>
                  <table className="ui definition table">
                    <tbody>
                      <tr>
                        <td className="four wide">Password</td>
                        <td><h2><input type="password" onChange={this.setPassword}/></h2></td>
                      </tr>
                      <tr>
                      <td className="four wide">Confirm Password</td>
                        <td><h2><input type="password" onChange={this.setPasswordChk}/></h2></td>
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

export default ModalChangePassword
