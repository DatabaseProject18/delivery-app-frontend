import React, { Component } from "react";
import moment from "moment";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CButton,
} from "@coreui/react";
import { toast } from "react-toastify";
import { api } from "../../services/api";
import { isLogin } from "../../services/auth";
import { convertNumToTime } from "../../utils/numberConvert";

class MyTrips extends Component {
  state = {
    truckTripsDetais: [],
    isPastTruckTrip: false,
    userType: isLogin().user_type,
    fields: [
      "no",
      "date_time",
      "truck_number",
      `${
        isLogin().user_type === "driver" ? "driver_assistant" : "driver"
      }_name`,
      "destination",
      "distance",
      "average_time",
    ],
  };
  async componentDidMount() {
    const data = await this.getDataFromDB();
    this.setState({ truckTripsDetais: data });
  }
  async componentDidUpdate() {
    //console.log(new Date());
    const data = await this.getDataFromDB();
    if (JSON.stringify(data) != JSON.stringify(this.state.truckTripsDetais))
      this.setState({ truckTripsDetais: data });
  }
  componentWillUnmount() {
    toast.dismiss();
  }

  handlePastTrips = async () => {
    const isPastTruckTrip = !this.state.isPastTruckTrip;
    this.setState({ isPastTruckTrip });
  };

  handleOnRowClick = (truck_schedule_id) => {
    if (this.state.userType === "driver_assistant") {
      this.props.history.push(`/my/my-trips/${truck_schedule_id}`);
    }
    // console.log(truck_schedule_id);
    // this.props.history.push(`/my/my-orders/${1}`);
  };

  getDataFromDB = async () => {
    let data = {
      type: this.state.userType,
      date: "2021-02-22",
      isPast: this.state.isPastTruckTrip,
      [`${this.state.userType}_id`]: isLogin()[`${this.state.userType}_id`],
    };

    const response = await api.truckTrip.getSheduledTruckTrips(data);
    if (response.resCode === 200) {
      const data = response.result.data.multiple;
      data.map((e) => {
        e.date_time = moment(new Date(e.date_time)).format("LLL");
        e.distance += " Km";
        e.average_time = convertNumToTime(e.average_time);
        e.no = data.indexOf(e) + 1;
      });
      return data;
    } else {
      if (response.result.error.single)
        toast.error(response.result.error.single);
    }
    return [];
  };

  render() {
    const { truckTripsDetais, fields, isPastTruckTrip, userType } = this.state;

    console.log(this.props);
    return (
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h4>My Truck Trip</h4>
            </CCardHeader>
            <CCardBody>
              {/* <CButton
                className="mb-3"
                active={isPastTruckTrip}
                onClick={() => this.handlePastTrips()}
                variant="outline"
                color="primary"
              >
                Past Trip
              </CButton> */}
              {truckTripsDetais.length > 0 && (
                <CDataTable
                  items={truckTripsDetais}
                  fields={fields}
                  hover
                  striped
                  bordered
                  size="md"
                  itemsPerPage={10}
                  pagination
                  //sorter
                  //onRowClick={(e) => this.handleOnRowClick(e.truck_schedule_id)}
                  //clickableRows
                />
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    );
  }
}

export default MyTrips;
