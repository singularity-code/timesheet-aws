import React, { Component } from 'react';
import moment from 'moment';
import { Form, Button } from 'semantic-ui-react';
import { Modal } from 'semantic-ui-react';
import { notification } from 'antd';
import BasicButton from '../buttons/Button';

class ModalChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.text,
      open: false,
      date: props.date ? props.date : moment().format('YYYY-MM-DD'),
      password: '',
      passwordChk: '',
      firstName: '',
      lastName: '',
      id: props.id,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  show = (size) => () => this.setState({ size, open: true });
  close = () => this.setState({ open: false });

  openNotificationWithIcon = function(type, text) {
    notification.config({
      placement: 'topLeft',
    });
    notification[type]({
      message: [text],
    });
  };

  handleSubmit() {
    if (this.state.password === this.state.passwordChk) {
      this.openNotificationWithIcon('success', 'Password changed');
      this.close();
    } else {
      this.openNotificationWithIcon('error', 'Password does not match.');
    }
  }

  setPassword = (e) => {
    this.setState({ password: e.target.value });
  };

  setPasswordChk = (e) => {
    this.setState({ passwordChk: e.target.value });
  };

  render() {
    const { open, size } = this.state;
    return (
      <div>
        <BasicButton text={this.state.text} css='ui right floated basic basic button'
                     onClick={this.show('small')}></BasicButton>

        <Modal size={size} open={open} onClose={this.close}>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <div className='ui container'>
                  <div className='ui horizontal divider'>
                    <h4 className='ui header'>
                      <i className='user secret icon'></i>
                      {this.state.text}
                    </h4>
                  </div>
                  <table className='ui definition table'>
                    <tbody>
                    <tr>
                      <td className='four wide'>Password</td>
                      <td>
                        <input type='password' autoComplete='off' onChange={this.setPassword} />
                      </td>
                    </tr>
                    <tr>
                      <td className='four wide'>Confirm Password</td>
                      <td>
                        <input type='password' autoComplete='off' onChange={this.setPasswordChk} />
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </Form.Field>
              <Button className='ui fluid inverted green button' content={this.state.text} />
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default ModalChangePassword;
