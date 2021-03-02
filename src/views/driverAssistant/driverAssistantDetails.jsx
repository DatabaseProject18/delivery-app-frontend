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
class DriverAssistantDetails extends Component {
  state = {
    fields: ["driver_assistant_id", "first_name", "last_name", "email"],
    driverAssistantData: [],
  };

  async componentDidMount() {
    const response = await api.driverAssistant.driverAssistantDetails(isLogin().store_manager_id);
    console.log(response);
    if (response.resCode === 200) {
      const data = response.result.data.multiple;
      this.setState({ driverAssistantData: data });
    } else {
      if (response.result.error.single)
        toast.error(response.result.error.single);
    }
  }
  componentWillUnmount() {
    toast.dismiss();
  }

  handleRowClick = (driver_assistant_id) => {
    this.props.history.push(`/my/driverAssistants/${driver_assistant_id}`);
  };

  render() {
    const { driverAssistantData, fields } = this.state;
    return (
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Driver Assistants</CCardHeader>
            <CCardBody>
              <CDataTable
                items={driverAssistantData}
                fields={fields}
                hover
                striped
                bordered
                size="md"
                itemsPerPage={10}
                pagination
                sorter
                onRowClick={(e) => this.handleRowClick(e.driver_assistant_id)}
                clickableRows
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    );
  }
}

export default DriverAssistantDetails;
