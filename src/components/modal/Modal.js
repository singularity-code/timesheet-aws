import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import { Form, Button } from "semantic-ui-react";
import { Modal } from "semantic-ui-react";
import { notification } from "antd";
import BasicButton from "../buttons/Button";
import DateAndTimes from "../buttons/DateAndTimes";
import log from "loglevel";

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
      userInfo: props.userInfo
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

  async handleSubmit() {
    let dateNtimes = this.timeElement.current.getValue();
    if (!dateNtimes) {
      return false;
    }

    await axios
      .get("/timesheet/data/selectOneRecord", {
        params: {
          date: dateNtimes.date,
          id: this.state.userInfo.id,
          token: this.state.userInfo.token
        }
      }).then(async result => {
        if (result.data[0] && result.data[0].COUNT === 0) {
          await axios.get("/timesheet/data/insert", {
            params: {
              id: this.state.userInfo.id,
              date: dateNtimes.date,
              startTime: dateNtimes.startTime,
              endTime: dateNtimes.endTime,
              breakTime1: dateNtimes.breakTime1,
              breakTime2: dateNtimes.breakTime2,
              breakTime3: dateNtimes.breakTime3,
              breakTime4: dateNtimes.breakTime4
            }
          }).then(result => {
            if (result && result.status === 200) {
              this.close();
              this.state.getTimesheet();
            } else {
              log.error("Fail to insert data", result);
              this.openNotificationWithIcon("error", "Fail to insert data");
            }
          }).catch(err => {
            log.error(err);
            this.redirectToMain();
          });
        } else if (result.data.status === 'timeout') {
          this.openNotificationWithIcon("error", result.data.message);
          this.redirectToMain();
        } else {
          this.openNotificationWithIcon("error", "Selected date timesheet is already exist !");
        }
      })
      .catch(err => {
        log.error(err);
        this.redirectToMain();
      });
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
