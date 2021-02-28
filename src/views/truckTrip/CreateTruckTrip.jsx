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
import moment from "moment";
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
    trucks: [],
    selectedRouteID: 1,
    startTime: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
    selectedTruckID: 0,
  };

  async componentDidMount() {
    const response = await api.truckRoute.getTruckRoutes(
      _.pick(isLogin(), ["store_manager_id"])
    );
    console.log(response);
    if (response.resCode === 200) {
      const data = response.result.data.multiple;
      const routes = this.truckRoute(data);
      //console.log(routes[0].truck_route_id);
      this.setState({ selectedRouteID: routes[0].truck_route_id });
      this.setState({ truckRoutes: routes });
    } else {
      if (response.result.error.single)
        toast.error(response.result.error.single);
    }
  }
  componentWillUnmount() {
    toast.dismiss();
  }

  async componentDidUpdate() {
    //---------------------get Trucks-----------------------
    const response = await api.truckRoute.getTrucks(
      _.pick(isLogin(), ["store_manager_id"])
    );
    //console.log(response);
    if (response.resCode === 200) {
      const data = response.result.data.multiple;
      if (JSON.stringify(this.state.trucks) !== JSON.stringify(data)) {
        this.setState({ trucks: data });
      }
      console.log(data);
    } else {
      if (response.result.error.single)
        toast.error(response.result.error.single);
    }
  }

  handleSelectRoute = (currentTarget) => {
    //console.log(currentTarget.target.value);
    this.setState({ selectedRouteID: currentTarget.target.value });
  };

  handleTimeChange = (e) => {
    //console.log(e.target.value);
    if (
      moment(moment(new Date()).format("YYYY-MM-DDTHH:mm").toString()).isBefore(
        e.target.value
      )
    ) {
      this.setState({ startTime: e.target.value });
    }
  };

  handleChangeTruck = async (e) => {
    console.log(e.target.value);
    this.setState({ selectedTruckID: e.target.value });
  };

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
      const tempRoute = [];
      x.map((e) => {
        tempRoute.push(e.town);
      });
      result[index].route = tempRoute.join(" -> ");
      //console.log(tempRoute);
    });
    return result;
    //console.log(result);
  };

  render() {
    const {
      truckRoutes,
      selectedRouteID,
      startTime,
      trucks,
      selectedTruckID,
    } = this.state;
    // console.log(truckRoutes);
    return (
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h5>Create a Truck Trip</h5>
            </CCardHeader>
            <CCardBody>
              <CForm>
                {/* --------------- Route--------------------- */}
                <CFormGroup className="mb-3">
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-mobile" />
                        Route
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CSelect
                      custom
                      name="route"
                      value={selectedRouteID}
                      onChange={(e) => this.handleSelectRoute(e)}
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
                {truckRoutes.length > 0 && (
                  <p className="text-muted">
                    {
                      truckRoutes.find(
                        (e) => e.truck_route_id == selectedRouteID
                      ).route
                    }
                  </p>
                )}
                {/* ---------------Start Time------------------- */}
                <CFormGroup>
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText>Start Time</CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      type="datetime-local"
                      id="startTime"
                      name="startTime"
                      value={startTime}
                      min={moment(new Date()).format("YYYY-MM-DDTHH:mm")}
                      onChange={(e) => this.handleTimeChange(e)}
                    />
                    {/* <CInvalidFeedback>{errors[name]}</CInvalidFeedback> */}
                  </CInputGroup>
                </CFormGroup>
                {/* ---------------------Truck------------------- */}
                <CFormGroup className="mb-3">
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText>Truck</CInputGroupText>
                    </CInputGroupPrepend>
                    <CSelect
                      custom
                      name="route"
                      value={selectedTruckID}
                      onChange={(e) => this.handleChangeTruck(e)}
                      //invalid={errors[name] ? true : false}
                    >
                      <option key={-1} value={0}>
                        ...
                      </option>
                      {trucks.map((option, index) => {
                        return (
                          <option key={index} value={option.truck_id}>
                            {option.registration_no}
                          </option>
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
