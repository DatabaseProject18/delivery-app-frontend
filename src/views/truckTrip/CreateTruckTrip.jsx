import React, { Component } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CForm,
  CButton,
  CCardFooter,
  CContainer,
  CFormGroup,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CInvalidFeedback,
  CLabel,
  CSelect,
  CSpinner,
  CTextarea,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import Joi from "joi";
import _ from "lodash";
import { toast } from "react-toastify";
import { api } from "../../services/api";
import { isLogin } from "../../services/auth";
import Form from "../../components/common/Form";

class CreateTruckTrip extends Component {
  state = {
    truckRoutes: [],
  };

  async componentDidMount() {
    const response = await api.truckRoute.getTruckRoutes(
      _.pick(isLogin(), ["store_manager_id"])
    );
    console.log(response);
    if (response.resCode === 200) {
      const data = response.result.data.multiple;
      console.log(this.truckRoute(data));
      const routes = this.truckRoute(data);
      this.setState({ truckRoutes: routes });
    } else {
      if (response.result.error.single)
        toast.error(response.result.error.single);
    }
  }

  truckRoute = (data) => {
    var lookup = {};
    var items = data;
    var result = [];
    for (var item, i = 0; (item = items[i++]); ) {
      var name = item.truck_route_id;
      if (!(name in lookup)) {
        lookup[name] = 1;
        result.push({ truck_route_id: name });
      }
    }
    result.map((e) => {
      const x = data.filter(
        (element) => element.truck_route_id == e.truck_route_id
      );
      const index = result.indexOf(e);
      result[index].start_city = x[0].town;
      result[index].destination_city = x[Object.keys(x).length - 1].town;
      //result[index].route = x.map(x, function (v) {return v.town;}).join(", ");
      // const start_city = x[0].town;
      // const destination_city = x[-1].town;
      //console.log(x);
    });
    return result;
    //console.log(result);
  };

  render() {
    const { truckRoutes } = this.state;
    console.log(truckRoutes);
    return (
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h5>Create a Truck Trip</h5>
            </CCardHeader>
            <CCardBody>
              <CForm>
                <CFormGroup className="mb-3">
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-mobile" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CSelect
                      custom
                      name="route"

                      //onChange={this.handleChange}
                      //invalid={errors[name] ? true : false}
                    >
                      {truckRoutes.map((option, index) => {
                        return (
                          <option
                            key={index}
                            value={option.truck_route_id}
                          >{`${option.start_city} -> ${option.destination_city}`}</option>
                        );
                      })}
                    </CSelect>
                    {/* <CInvalidFeedback>{errors[name]}</CInvalidFeedback> */}
                  </CInputGroup>
                </CFormGroup>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    );
  }
}

export default CreateTruckTrip;
