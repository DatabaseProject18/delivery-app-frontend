import React, { Component } from "react";
import {
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
class DriverDetails extends Component {
  state = {
    fields: ["driver_id", "first_name", "last_name", "email"],
    driverData: [],
  };

  async componentDidMount() {
    const response = await api.driver.driverDetails(isLogin().store_manager_id);
    console.log(response);
    if (response.resCode === 200) {
      const data = response.result.data.multiple;
      this.setState({ driverData: data });
    } else {
      if (response.result.error.single)
        toast.error(response.result.error.single);
    }
  }
  componentWillUnmount() {
    toast.dismiss();
  }

  handleRowClick = (driver_id) => {
    this.props.history.push(`/my/drivers/${driver_id}`);
  };

  render() {
    const { driverData, fields } = this.state;
    return (
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Drivers</CCardHeader>
            <CCardBody>
              <CDataTable
                items={driverData}
                fields={fields}
                hover
                striped
                bordered
                size="md"
                itemsPerPage={10}
                pagination
                sorter
                onRowClick={(e) => this.handleRowClick(e.driver_id)}
                clickableRows
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    );
  }
}

export default DriverDetails;
