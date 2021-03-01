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

class SheduledTruckTrips extends Component {
  state = {
    truckTrips: [],
    fields: ["driver_id", "first_name", "last_name", "email"],
  };

  render() {
    const { truckTrips, fields } = this.state;
    return (
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Drivers</CCardHeader>
            <CCardBody>
              <CDataTable
                items={truckTrips}
                fields={fields}
                hover
                striped
                bordered
                size="md"
                itemsPerPage={10}
                pagination
                sorter
                //onRowClick={(e) => this.truckTrips(e.driver_id)}
                clickableRows
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    );
  }
}

export default SheduledTruckTrips;
