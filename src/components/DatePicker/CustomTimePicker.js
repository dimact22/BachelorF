import React, { Component } from "react";
import {
  Button,
  Input,
  InputAdornment,
  IconButton,
  Dialog,
  DialogActions
} from "@material-ui/core";
import { TimePicker } from "material-ui-time-picker";
import AccessTime from "@material-ui/icons/AccessTime";
import moment from "moment";

import "./CustomTimePicker.css";

class CustomTimePicker extends Component {
  TIME_FORMAT = "hh:mm";

  constructor(props) {
    super(props);

    this.state = {
      dialogIsOpen: false,
      selectedValue: this.props.defaultValue
    };

    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.handleDialogTimeChange = this.handleDialogTimeChange.bind(this);
    this.adjustTimeInBounds = this.adjustTimeInBounds.bind(this);

    this.timeSelectRef = React.createRef();
  }

  openDialog() {
    this.setState({
      dialogIsOpen: true
    });
  }

  closeDialog() {
    this.setState({
      dialogIsOpen: false
    });

    this.props.value(this.adjustTimeInBounds(this.state.selectedValue));
  }

  adjustTimeInBounds(newValue) {
    console.log("adjustTimeInBounds", newValue);
    if (newValue) {
      const momentValue = moment(newValue);
      if (momentValue.isBefore(this.props.minDateTime)) {
        return this.props.minDateTime;
      } else {
        if (momentValue.isAfter(this.props.maxDateTime)) {
          return this.props.maxDateTime;
        } else {
          // New value is within bounds
          return momentValue;
        }
      }
    } else {
      return undefined;
    }
  }

  handleDialogTimeChange(newValue) {
    this.setState({
      selectedValue: this.adjustTimeInBounds(newValue)
    });
  }

  render() {
    console.log("render", this.state.selectedValue);
    return (
      <span>
        <Input
          className="time-selector"
          readOnly
          ref={this.timeSelectRef}
          value={
            this.state.selectedValue
              ? this.adjustTimeInBounds(this.state.selectedValue).format(
                  this.TIME_FORMAT
                )
              : undefined
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={this.openDialog}>
                <AccessTime />
              </IconButton>
            </InputAdornment>
          }
        />
        <Dialog maxWidth="xs" open={this.state.dialogIsOpen}>
          <TimePicker
            mode="24h"
            value={
              this.state.selectedValue && this.state.selectedValue.toDate()
            }
            onChange={this.handleDialogTimeChange}
          />
          <DialogActions>
            <Button onClick={this.closeDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.closeDialog} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </span>
    );
  }
}

export default CustomTimePicker;
