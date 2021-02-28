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
import { numberWithCommas } from "../../utils/numberConvert";

class SingleDriverAssistant extends Component {
  state = {
    fields: ["first_name", "last_name", "email","staff_id","store_id","total_work_hours"],
    driver_assistant_id: this.props.match.params.driver_assistant_id,
    driverAssistantData: [],
  };

  async componentDidMount() {
    const response = await api.driverAssistant.driverAssistantFullDetails(this.state.driver_assistant_id);
    if (response.resCode === 200) {
      const data = response.result.data.multiple;
      console.log(data);
      this.setState({ driverAssistantData: data });
    } else {
      if (response.result.error.single)
        toast.error(response.result.error.single);
    }
  }
  componentWillUnmount() {
    toast.dismiss();
  }

  render() {
    const { driver_assistant_id, driverAssistantData, fields } = this.state;

    return (
        <CRow>
          <CCol>
            <CCard>
              <CCardHeader>Driver Assistant</CCardHeader>
              <CCardBody>
                <CDataTable
                  items={driverAssistantData}
                  fields={fields}
                  hover
                  striped
                  bordered
                  size="md"
                  //itemsPerPage={10}
                  //pagination
                  sorter
                  //onRowClick={(e) => this.handleRowClick(e.driver_id)}
                  //clickableRows
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      );
  }
}

export default SingleDriverAssistant;

