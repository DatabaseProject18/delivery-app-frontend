import React, { Component } from "react";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
} from "@coreui/react";
import { toast } from "react-toastify";
import { api } from "../../services/api";
import { isLogin } from "../../services/auth";

class Orders extends Component {
  state = {
    fields: ["order_date", "delivery_date", "cost", "order_status"],
    pastOrdersData: [],
  };

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

  async componentDidMount() {
    const response = await api.customer.getPastOrders({
      customer_id: isLogin().customer_id,
    });
    if (response.resCode === 200) {
      const data = response.result.data.multiple;
      data.map((key) => {
        key.order_date = key.order_date.split("T")[0];
        key.delivery_date = key.delivery_date.split("T")[0];
        key.cost = "Rs " + numberWithCommas(key.cost);
      });
      this.setState({ pastOrdersData: data });
    } else {
      if (response.result.error.single)
        toast.error(response.result.error.single);
    }
  }
  componentWillUnmount() {
    toast.dismiss();
  }

  handleRowClick = (order_id) => {
    this.props.history.push(`/my-orders/${order_id}`);
  };

  render() {
    const { pastOrdersData, fields } = this.state;
    return (
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Orders</CCardHeader>
            <CCardBody>
              <CDataTable
                items={pastOrdersData}
                fields={fields}
                hover
                striped
                bordered
                size="md"
                itemsPerPage={10}
                pagination
                sorter
                onRowClick={(e) => this.handleRowClick(e.order_id)}
                clickableRows
                scopedSlots={{
                  order_status: (item) => (
                    <td>
                      <CBadge color={this.getBadge(item.order_status)}>
                        {item.order_status}
                      </CBadge>
                    </td>
                  ),
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    );
  }
}

export default Orders;

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
