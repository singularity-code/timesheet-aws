import React, { Component } from "react";
import moment from "moment";
import { Form, Button } from "semantic-ui-react";
import { Modal } from "semantic-ui-react";
import { notification } from "antd";
import BasicButton from "../buttons/Button";
import DateAndTimes from "../buttons/DateAndTimes";

class ModalCreateSheet extends Component {
  constructor(props) {
    super(props);
    this.timeElement = React.createRef();
    this.endTimeElement = React.createRef();
    this.state = {
      open: false,
      format: "HH:mm",
      accountId: props.accountId,
      timesheetId: props.timesheetId,
      date: props.date ? props.date : moment().format("YYYY-MM-DD"),
      breakTime1: props.breakTime1,
      breakTime2: props.breakTime2,
      breakTime3: props.breakTime3,
      breakTime4: props.breakTime4,
      startTime: props.startTime,
      endTime: props.endTime,
      requestSatus: "",
      getTimesheet: props.getTimesheet,
      userInfo: props.userInfo,
      updateShift: props.updateShift
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.redirectToMain = this.redirectToMain.bind(this);
  }

  show = size => () => this.setState({ size, open: true });
  close = () => this.setState({ open: false });

  openNotificationWithIcon(type, text) {
    notification.config({
      placement: "topLeft"
    });
    notification[type]({
      message: [text]
    });
  }

  redirectToMain() {
    setTimeout(function() {
      window.location.href = "http://localhost:3000";
    }, 5000);
  }

  handleSubmit = () => {
    let dateNtimes = this.timeElement.current.getValue();
    if (!dateNtimes) {
      return false;
    }
    this.state.updateShift(dateNtimes);
    this.close();
  }

  render() {
    const { open, size } = this.state;
    const btnText = "ADD A SHIFT";
    if (!this.props.historyMode) {
      return (
        <div>
          <BasicButton text={btnText} css="ui right floated basic red button" icon="large pencil alternate icon" onClick={this.show("tiny")}></BasicButton>

          <Modal size={size} open={open} onClose={this.close}>
            <Modal.Content>
              <Form onSubmit={this.handleSubmit}>
                <Form.Field>
                  <DateAndTimes
                    ref={this.timeElement}
                    date={this.state.date}
                    startTime={this.state.startTime}
                    endTime={this.state.endTime}
                    breakTime1={this.state.breakTime1}
                    breakTime2={this.state.breakTime2}
                    breakTime3={this.state.breakTime3}
                    breakTime4={this.state.breakTime4}
                  />
                </Form.Field>
                <Button className="ui fluid inverted green button" content={btnText} />
              </Form>
            </Modal.Content>
          </Modal>
        </div>
      );
    } else {
      return "";
    }
  }
}

export default ModalCreateSheet;
