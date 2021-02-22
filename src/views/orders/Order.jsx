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
import { toast } from "react-toastify";
import { api } from "../../services/api";
import { isLogin } from "../../services/auth";

class Order extends Component {
  state = {
    order_id: this.props.match.params.order_id,
    pastOrderData: [],
    cancelBtn: false,
  };

  async componentDidMount() {
    const response = await api.customer.getPastOrder(this.state.order_id);
    if (response.resCode === 200) {
      const data = response.result.data.multiple;
      console.log(data);
      this.setState({ pastOrderData: data });
    } else {
      if (response.result.error.single)
        toast.error(response.result.error.single);
    }
  }

  getBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Sent":
        return "primary";
      case "Preparing":
        return "warning";
      case "Canceled":
        return "danger";
      default:
        return "secondary";
    }
  };
  handleCancel = async () => {
    const temp = [...this.state.pastOrderData];
    const backup = JSON.parse(JSON.stringify(temp));
    temp.map((e) => {
      e.order_status = "Canceled";
    });
    this.setState({ pastOrderData: temp });
    const response = await api.customer.cancelOrder(this.state.order_id);
    //console.log(response);
    if (response.resCode !== 200) {
      this.setState({ pastOrderData: backup });
    }
  };

  render() {
    const { order_id, pastOrderData, cancelBtn } = this.state;

    return (
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h4>{`Order ID : ${order_id}`}</h4>
            </CCardHeader>
            {pastOrderData.length > 0 && (
              <CRow>
                <CCol style={{ marginLeft: "2rem" }}>
                  <br />
                  <div>
                    {`Order Date : ${
                      pastOrderData[0].order_date.split("T")[0]
                    }`}
                  </div>
                  <div>
                    {`Delivery Date : ${
                      pastOrderData[0].delivery_date.split("T")[0]
                    }`}
                  </div>
                  <div>
                    {`Total Cost (Rs) : ${numberWithCommas(
                      pastOrderData[0].cost
                    )}`}
                  </div>
                  <div>
                    Order Status :
                    {
                      <CBadge
                        style={{ marginLeft: "0.5rem" }}
                        color={this.getBadge(pastOrderData[0].order_status)}
                      >
                        {pastOrderData[0].order_status}
                      </CBadge>
                    }
                  </div>
                  {pastOrderData[0].order_status == "Preparing" && (
                    <CButton
                      disabled={cancelBtn}
                      onClick={this.handleCancel}
                      style={{ marginTop: "0.5rem" }}
                      color="danger"
                    >
                      Cancel
                    </CButton>
                  )}
                </CCol>
              </CRow>
            )}
            <CCardBody>
              {pastOrderData.map((e) => (
                <CCard
                  key={Math.floor(Math.random() * 100000)}
                  accentColor="info"
                >
                  <CCardHeader>
                    <h5>
                      {`${pastOrderData.indexOf(e) + 1}. ${e.product_name}`}{" "}
                    </h5>
                  </CCardHeader>
                  <CCardBody>
                    <div>Quantity : x{e.quantity}</div>
                    <div>{`Cost (Rs): ${numberWithCommas(
                      e.item_price
                    )} x ${numberWithCommas(e.quantity)} = ${numberWithCommas(
                      e.item_price * e.quantity
                    )}`}</div>
                    <div>Description : {e.product_description}</div>
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

export default Order;

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
