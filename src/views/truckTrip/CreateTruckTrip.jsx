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
  CFormGroup,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CSelect,
  CAlert,
  CProgress,
} from "@coreui/react";
import moment from "moment";
import CIcon from "@coreui/icons-react";
import Joi, { boolean } from "joi";
import _ from "lodash";
import { toast } from "react-toastify";
import { api } from "../../services/api";
import { isLogin } from "../../services/auth";
import { numberWithCommas } from "../../utils/numberConvert";

class CreateTruckTrip extends Component {
  state = {
    orderTableColums: [
      { key: "order_id" },
      { key: "order_date" },
      { key: "place_of_delivery" },
      { key: "total_volume", label: "Volume (cmxcmxcm)" },
      {
        key: "isSelected",
        label: "",
        _style: { width: "1%" },
        sorter: false,
        filter: false,
      },
    ],
    truckRoutes: [],
    trucks: [],
    drivers: [],
    driverAssistants: [],
    avalableOrdersForRoute: [],
    selectedRouteID: 1,
    startTime: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
    selectedTruckID: 0,
    selectedDriverID: 0,
    selectedDriverAssistantID: 0,
    error: null,
  };

  async componentDidMount() {
    const routes = await this.getRoutes();
    if (routes) {
      this.setState({ selectedRouteID: routes[0].truck_route_id });
      this.setState({ truckRoutes: routes });
    }
  }
  componentWillUnmount() {
    toast.dismiss();
  }

  async componentDidUpdate() {
    const trucks = await this.getTrucks();
    if (trucks) this.setState({ trucks: trucks });
    const drivers = await this.getDrivers();
    if (drivers) this.setState({ drivers });
    const driverAssistants = await this.getDriverAssistants();
    if (driverAssistants) this.setState({ driverAssistants });
    const avalableOrdersForRoute = await this.getAvalableOrders();
    console.log(avalableOrdersForRoute);
    if (avalableOrdersForRoute) this.setState({ avalableOrdersForRoute });
  }

  getRoutes = async () => {
    const response = await api.truckRoute.getTruckRoutes(
      _.pick(isLogin(), ["store_manager_id"])
    );
    console.log(response);
    if (response.resCode === 200) {
      const data = response.result.data.multiple;
      const routes = this.truckRoute(data);
      //console.log(routes[0].truck_route_id);
      return routes;
    } else {
      if (response.result.error.single)
        toast.error(response.result.error.single);
    }
    return null;
  };

  getTrucks = async () => {
    const response = await api.truckRoute.getTrucks(
      _.pick(isLogin(), ["store_manager_id"])
    );
    if (response.resCode === 200) {
      const truckData = response.result.data.multiple;
      const sheduledData = await this.getScheduledData(moment(this.state.startTime).format(
        "YYYY-MM-DD HH:mm:ss"
      ));
      const filteredTrucks = truckData.filter((e) =>
        this.isAvalable(sheduledData, this.state.startTime, "truck", e.truck_id)
      );
      if (
        JSON.stringify(this.state.trucks) !== JSON.stringify(filteredTrucks)
      ) {
        return filteredTrucks;
      }
    } else {
      if (response.result.error.single)
        toast.error(response.result.error.single);
    }
    return null;
  };

  getDrivers = async () => {
    const routeDetails = this.getRouteDetailsByRouteID();
    if (routeDetails) {
      const start_time = moment(this.state.startTime).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      const end_time = moment(this.state.startTime)
        .add(routeDetails.average_time * 60, "m")
        .format("YYYY-MM-DD HH:mm:ss");
      //console.log(this.handleCreate.truck_route_id);
      const response = await api.truckRoute.getFreeDrivers({
        truck_route_id: this.state.selectedRouteID,
        store_manager_id: isLogin().store_manager_id,
        start_time,
        end_time,
      });
      //console.log(response);
      if (response.resCode === 200) {
        const drivers = response.result.data.multiple;
        if (JSON.stringify(this.state.drivers) !== JSON.stringify(drivers)) {
          return drivers;
        }
      } else {
        if (response.result.error.single)
          toast.error(response.result.error.single);
      }
      return null;
    }
  };

  getDriverAssistants = async () => {
    const routeDetails = this.getRouteDetailsByRouteID();
    if (routeDetails) {
      const start_time = moment(this.state.startTime).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      const end_time = moment(this.state.startTime).add(
        routeDetails.average_time * 60,
        "m"
      );
      const response = await api.truckRoute.getFreeDriverAssistants({
        truck_route_id: this.state.selectedRouteID,
        store_manager_id: isLogin().store_manager_id,
        start_time,
        end_time,
      });
      //console.log(response);
      if (response.resCode === 200) {
        const driversAssistants = response.result.data.multiple;
        if (
          JSON.stringify(this.state.driverAssistants) !==
          JSON.stringify(driversAssistants)
        ) {
          return driversAssistants;
        }
      } else {
        if (response.result.error.single)
          toast.error(response.result.error.single);
      }
      return null;
    }
  };

  getAvalableOrders = async () => {
    const response = await api.order.getOrdersByRouteId({
      route_id: this.state.selectedRouteID,
    });
    if (response.resCode === 200) {
      const orders = response.result.data.multiple;
      orders.map((e) => {
        e.order_date = e.order_date.split("T")[0];
      });
      const preState = this.state.avalableOrdersForRoute.map((e) => {
        return { order_id: e.order_id };
      });
      const newState = orders.map((e) => {
        return { order_id: e.order_id };
      });
      if (JSON.stringify(preState) !== JSON.stringify(newState)) {
        orders.map((e) => {
          e.isSelected = false;
        });
        return orders;
      }
    } else {
      if (
        response.resCode === 404 &&
        this.state.avalableOrdersForRoute.length !== 0
      )
        return [];
      if (response.result.error.single)
        toast.error(response.result.error.single);
    }
    return null;
  };

  getRouteDetailsByRouteID = async () => {
    const response = await api.truckRoute.getRouteDetailsByRouteID({
      truck_route_id: this.state.selectedRouteID,
    });
    if (response.resCode === 200) return response.result.data.multiple;
    else return null;
  };

  handleSelectRoute = (currentTarget) => {
    this.setState({ avalableOrdersForRoute: [] });
    this.setState({ selectedRouteID: currentTarget.target.value });
  };

  handleTimeChange = (e) => {
    if (
      moment(moment(new Date()).format("YYYY-MM-DDTHH:mm").toString()).isBefore(
        e.target.value
      )
    ) {
      this.setState({ startTime: e.target.value });
    }
  };

  handleChangeTruck = async (e) => {
    this.setState({ selectedTruckID: e.target.value });
  };

  handleChangeDriver = async (e) => {
    this.setState({ selectedDriverID: e.target.value });
  };

  handleChangeDriverAssistant = async (e) => {
    this.setState({ selectedDriverAssistantID: e.target.value });
  };

  handleProductSelect = (index) => {
    const avalableOrdersForRoute = [...this.state.avalableOrdersForRoute];
    avalableOrdersForRoute[index].isSelected = !avalableOrdersForRoute[index]
      .isSelected;
    this.setState({ avalableOrdersForRoute });
  };

  handleCreate = () => {
    let error = this.isFormValid();
    if (error) {
      console.log(error);
      this.setState({ error });
    } else {
      const truck_route_id = this.state.selectedRouteID;
      const truck_id = this.state.selectedTruckID;
      const date_time = moment(this.state.startTime).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      const store_manager_id = isLogin().store_manager_id;
      const driver_id = this.state.selectedDriverID;
      const driver_assistant_id = this.state.selectedDriverAssistantID;
      const selectedOrders = [];
      this.state.avalableOrdersForRoute.map((e) => {
        if (e.isSelected) selectedOrders.push(e.order_id);
      });

      console.log({
        truck_route_id,
        truck_id,
        date_time,
        store_manager_id,
        driver_id,
        driver_assistant_id,
        selectedOrders,
      });
      api.truckRoute.createTruckTrip({
        truck_route_id,
        truck_id,
        date_time,
        store_manager_id,
        driver_id,
        driver_assistant_id
      });
    }

    this.setState({ trucks: [] });
    this.setState({ drivers: [] });
    this.setState({ driverAssistants: [] });
    this.setState({ avalableOrdersForRoute: [] });
    this.setState({ selectedRouteID: 1 });
    this.setState({ startTime: moment(new Date()).format("YYYY-MM-DDTHH:mm") });
    this.setState({ selectedTruckID: 0 });
    this.setState({ selectedDriverID: 0 });
    this.setState({ selectedDriverAssistantID: 0 });
    this.setState({ error: null });
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

  getScheduledData = async (date) => {
    const response = await api.truckTrip.getNewSheduledTruckTrips({
      date: moment(date).subtract(7, "d").format("YYYY-MM-DD"),
    });
    if (response.resCode === 200) {
      return response.result.data.multiple;
    } else {
      // if (response.result.error.single)
      //   toast.error(response.result.error.single);
      return null;
    }
  };

  isAvalable = (sheduledData, date, what, id) => {
    const givenDateTime = moment(date);
    if (sheduledData) {
      for (let i = 0; i < sheduledData.length; i++) {
        const startTime = moment(sheduledData[i].date_time);
        const endTime = moment(sheduledData[i].date_time).add(
          sheduledData[i].average_time * 60,
          "m"
        );
        if (startTime < givenDateTime && endTime > givenDateTime) {
          if (what === "truck") {
            if (sheduledData[i].truck_id === id) return false;
          }
          if (what === "driver") {
            let houreCount = 0;
            sheduledData.map((e) => {
              if (e.driver_id == id) houreCount += e.average_time;
            });
            if (houreCount > 40) return false;
          }
          if (what === "driver_assistant") {
            let houreCount = 0;
            sheduledData.map((e) => {
              if (e.driver_assistant_id == id) houreCount += e.average_time;
            });
            if (houreCount > 60) return false;
          }
        }
      }
    }
    return true;
  };

  isFormValid = () => {
    if (this.state.selectedTruckID === 0) {
      return "Please Select a Truck";
    }
    if (this.state.selectedDriverID === 0) {
      return "Please Select a Driver";
    }
    if (this.state.selectedDriverAssistantID === 0) {
      return "Please Select a Driver Assistant";
    }
    const selectedOrderCount = this.state.avalableOrdersForRoute.filter(
      (e) => e.isSelected == true
    ).length;
    if (selectedOrderCount == 0) {
      return "Please select at least one order";
    }
    if (this.getTruckFullProgress() > 100) {
      return "Maximum truck capacity exceed";
    }
    return null;
  };

  getTruckFullProgress = () => {
    if (this.state.selectedTruckID > 0) {
      const truckCapacity = this.state.trucks.find(
        (e) => e.truck_id == this.state.selectedTruckID
      ).truck_capacity;
      let capacityOfSelectedOrders = 0;
      this.state.avalableOrdersForRoute.map((e) => {
        if (e.isSelected) capacityOfSelectedOrders += e.total_volume;
      });
      return capacityOfSelectedOrders / 10000 / truckCapacity;
    }
    return 0;
  };

  isOrderSelectButtonHide(order_id) {
    let isOrderSelected = this.state.avalableOrdersForRoute.find(
      (e) => e.order_id === order_id
    );
    if (isOrderSelected) {
      isOrderSelected = isOrderSelected.isSelected;

      if (isOrderSelected) {
        return false;
      } else if (this.state.selectedTruckID > 0) {
        const truckCapacity = this.state.trucks.find(
          (e) => e.truck_id == this.state.selectedTruckID
        ).truck_capacity;
        let capacityOfSelectedOrders = 0;
        this.state.avalableOrdersForRoute.map((e) => {
          if (e.isSelected) capacityOfSelectedOrders += e.total_volume;
        });
        capacityOfSelectedOrders += this.state.avalableOrdersForRoute.find(
          (e) => e.order_id == order_id
        ).total_volume;
        const precentage = capacityOfSelectedOrders / 10000 / truckCapacity;

        if (precentage > 100) return true;
        else return false;
      }
    }

    return true;
  }

  render() {
    const {
      orderTableColums,
      truckRoutes,
      selectedRouteID,
      startTime,
      trucks,
      avalableOrdersForRoute,
      selectedTruckID,
      selectedDriverID,
      selectedDriverAssistantID,
      drivers,
      driverAssistants,
      error,
    } = this.state;
    //console.log(this.getTruckFullProgress());
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
                      <CInputGroupText>Route</CInputGroupText>
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
                  {truckRoutes.length > 0 && (
                    <p className="text-muted">
                      {
                        truckRoutes.find(
                          (e) => e.truck_route_id == selectedRouteID
                        ).route
                      }
                    </p>
                  )}
                </CFormGroup>
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
                  {this.state.selectedTruckID > 0 && (
                    <p className="text-muted">
                      {`Truck Capacity : ${
                        trucks.find((e) => e.truck_id == selectedTruckID)
                          .truck_capacity
                      } mxmxm`}
                    </p>
                  )}
                </CFormGroup>
                {/* ---------------------Driver------------------------------ */}
                <CFormGroup className="mb-3">
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText>Driver</CInputGroupText>
                    </CInputGroupPrepend>
                    <CSelect
                      custom
                      name="route"
                      value={selectedDriverID}
                      onChange={(e) => this.handleChangeDriver(e)}
                      //invalid={errors[name] ? true : false}
                    >
                      <option key={-1} value={0}>
                        ...
                      </option>
                      {drivers.map((option, index) => {
                        return (
                          <option key={index} value={option.driver_id}>
                            {`${option.first_name} ${option.last_name}`}
                          </option>
                        );
                      })}
                    </CSelect>
                    {/* <CInvalidFeedback>{errors[name]}</CInvalidFeedback> */}
                  </CInputGroup>
                </CFormGroup>
                {/* ---------------------Driver Assistant------------------------------ */}
                <CFormGroup className="mb-3">
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText>Driver Assistant</CInputGroupText>
                    </CInputGroupPrepend>
                    <CSelect
                      custom
                      name="route"
                      value={selectedDriverAssistantID}
                      onChange={(e) => this.handleChangeDriverAssistant(e)}
                      //invalid={errors[name] ? true : false}
                    >
                      <option key={-1} value={0}>
                        ...
                      </option>
                      {driverAssistants.map((option, index) => {
                        return (
                          <option
                            key={index}
                            value={option.driver_assistant_id}
                          >
                            {`${option.first_name} ${option.last_name}`}
                          </option>
                        );
                      })}
                    </CSelect>
                    {/* <CInvalidFeedback>fgfh</CInvalidFeedback> */}
                  </CInputGroup>
                </CFormGroup>
                <br />
                {/* ---------------------------Orders---------------------- */}
                <CDataTable
                  items={avalableOrdersForRoute}
                  fields={orderTableColums}
                  hover
                  striped
                  bordered
                  size="md"
                  itemsPerPage={10}
                  pagination
                  sorter
                  //onRowClick={(e) => this.handleRowClick(e.driver_id)}
                  //clickableRows
                  scopedSlots={{
                    isSelected: (item, index) => {
                      return (
                        <td className="py-2">
                          <CButton
                            color="primary"
                            variant="outline"
                            shape="square"
                            size="sm"
                            disabled={this.isOrderSelectButtonHide(
                              item.order_id
                            )}
                            onClick={() => {
                              this.handleProductSelect(index);
                            }}
                          >
                            {item.isSelected ? "Unselect" : "Select"}
                          </CButton>
                        </td>
                      );
                    },
                  }}
                />
              </CForm>
              <br />
              <CProgress
                value={this.getTruckFullProgress()}
                showValue
                className="mb-1 bg-white"
                color={this.getTruckFullProgress() > 75 ? "danger" : "bg-white"}
              />
              <br />

              {error && <CAlert color="danger">{error}</CAlert>}

              <CButton
                onClick={() => this.handleCreate()}
                style={{ marginTop: "1rem" }}
                color="success"
              >
                Create
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    );
  }
}

export default CreateTruckTrip;
