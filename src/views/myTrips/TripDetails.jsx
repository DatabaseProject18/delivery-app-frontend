import React, { Component } from "react";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CButton,
} from "@coreui/react";
import moment from "moment";
import { numberWithCommas, convertNumToTime } from "../../utils/numberConvert";
import { api } from "../../services/api";
import { isLogin } from "../../services/auth";
import { toast } from "react-toastify";
class TripDetails extends Component {
  state = {
    truckTrip_id: this.props.match.params.trip_id,
    orderData: [],
    scheduleData: [],
    route: "",
  };

  async componentDidMount() {
    let response = "";
    let data = "";
    // ---------------------------- truck trip details
    response = await api.truckTrip.getTruckTripDetails(this.state.truckTrip_id);
    if (response.resCode === 200) {
      data = response.result.data.multiple[0];
      console.log(data);
      this.setState({ scheduleData: data });
    } else {
      if (response.result.error.single)
        toast.error(response.result.error.single);
    }
    // -------------------------------- truck route
    response = await api.truckRoute.getTruckRouteByID(this.state.truckTrip_id);
    if (response.resCode === 200) {
      data = "";
      response.result.data.multiple.map((e) => {
        data += e.town + "->";
      });
      console.log(data.slice(0, -2));
      this.setState({ route: data.slice(0, -2) });
    } else {
      if (response.result.error.single)
        toast.error(response.result.error.single);
    }
    // ---------------------------- order details
    data = await this.getOrderDetails();
    this.setState({ orderData: data });
  }

  getOrderDetails = async () => {
    const response = await api.truckTrip.getTruckTripOrderDetails(
      this.state.truckTrip_id
    );
    if (response.resCode === 200) {
      const data = response.result.data.multiple;
      return data;
      //console.log(data);
    } else {
      if (response.result.error.single)
        toast.error(response.result.error.single);
    }
    return [];
  };

  handleConfirm = async (order_id) => {
    const temp = [...this.state.orderData];
    const backup = JSON.parse(JSON.stringify(temp));
    var item = temp.find((x) => x.order_id == order_id);
    if (item) {
      item.order_status = "Delivered";
    }

    this.setState({ orderData: temp });
    const response = await api.order.confirmOrder(order_id);
    if (response.resCode === 200) {
      const data = await this.getOrderDetails();
      this.setState({ orderData: data });
    } else {
      this.setState({ orderData: backup });
      if (response.result.error.single)
        toast.error(response.result.error.single);
    }
  };

  getDeliveredOrderCount = () => {
    let count = 0;
    if (this.state.orderData.length > 0) {
      this.state.orderData.map((e) => {
        if (e.order_status == "Delivered") {
          count += 1;
        }
      });
    }
    return count;
  };

  render() {
    const { truckTrip_id, scheduleData, orderData, route } = this.state;
    return (
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h4>{`Schedule ID : ${truckTrip_id}`}</h4>
              <CRow>
                <CCol>
                  <hr />
                  <h6>
                    <div>{`Start Time : ${moment(
                      new Date(scheduleData.date_time)
                    ).calendar()}`}</div>
                    <div>{`Truck No : ${scheduleData.truck_number}`}</div>
                    <div>{`Driver : ${scheduleData.driver_name}`}</div>
                    <div>{`Route : ${route}`}</div>
                    <div>{`Distance : ${scheduleData.distance} Km`}</div>
                    <div>{`Average time : ${convertNumToTime(
                      scheduleData.average_time
                    )}`}</div>
                    <div>{`Orders : ${this.getDeliveredOrderCount()}/${
                      orderData.length
                    }`}</div>
                  </h6>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              {orderData.map((e) => (
                <CCard key={e.order_id} accentColor="info">
                  <CCardHeader>
                    <h6>{`Order ID : ${e.order_id}`} </h6>
                  </CCardHeader>
                  <CCardBody>
                    <div>{`Customer Name : ${e.customer_name}`}</div>
                    <div>{`Address : ${e.address}`}</div>
                    <div>{`Tel : ${e.contact_no}`}</div>
                    <div>{`Delivery place : ${e.town}`}</div>
                    <div>
                      {`Order State : `}
                      <CBadge
                        color={
                          e.order_status === "Delivered" ? "success" : "primary"
                        }
                      >
                        {e.order_status}
                      </CBadge>
                    </div>
                    <CButton
                      hidden={e.order_status == "Delivered" ? true : false}
                      onClick={() => this.handleConfirm(e.order_id)}
                      style={{ marginTop: "1rem" }}
                      size="sm"
                      color="info"
                    >
                      Confirm
                    </CButton>
                  </CCardBody>
                </CCard>
              ))}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    );
  }
}

export default TripDetails;
