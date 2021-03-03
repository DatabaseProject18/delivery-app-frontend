import React, { Component, Fragment } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormGroup,
  CLabel,
  CInputRadio,
  CAlert,
  CRow,
  CButton,
  CContainer,
  CImg,
  CCardFooter,
  CInput,
  CSelect,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
} from "@coreui/react";
import { toast } from "react-toastify";
import { api } from "../../services/api";
import { isLogin } from "../../services/auth";
import { numberWithCommas } from "../../utils/numberConvert";
import { divide } from "lodash";
import moment from "moment";

class placeOrder extends Component {
  state = {
    placeOrderDetails: [],
    locationDetails: [],
    meetPosistions: [],
    selectedRouteId: 0,
    selectedMeetPosition: 0,
    selectedPaymentMethod: "Mastercard",
    startDate: moment(new Date()),
    delivery_date: moment(new Date()).add(7, "d").format("YYYY-MM-DD"),
    isPaid: false,
    error: null,
  };

  async componentDidMount() {
    const response = await api.cart.getCart({
      customer_id: isLogin().customer_id,
    });
    //console.log(response);
    if (response.resCode === 200) {
      let data = response.result.data.multiple;
      this.setState({ placeOrderDetails: data });
    } else {
      if (response.result.error.single)
        toast.error(response.result.error.single);
    }

    const res = await api.truckRoute.getRoute();
    console.log(res);
    if (res.resCode === 200) {
      let data = res.result.data.multiple;
      this.setState({ locationDetails: data });
    } else {
      if (res.result.error.single) toast.error(res.result.error.single);
    }
  }

  componentWillUnmount() {
    toast.dismiss();
  }

  getTotalBill = () => {
    let totalBill = 0;
    this.state.placeOrderDetails.map((e) => {
      totalBill += (e.unit_price * e.quantity * (100 - e.discount)) / 100;
    });
    return totalBill;
  };

  handleRouteChange = (e) => {
    this.setState({ selectedRouteId: e.target.value, selectedMeetPosition: 0 });
    if (e.target.value == 0) {
      this.setState({ selectedMeetPosition: 0, meetPosistions: [] });
    } else {
      const cities = this.state.locationDetails[e.target.value - 1].route.split(
        ","
      );
      var meetPosistions = [];

      cities.map((item, index) => {
        meetPosistions.push({ position: index + 1, city: item });
      });
      this.setState({ meetPosistions });
    }
  };

  handlePosisionChange = (e) => {
    this.setState({ selectedMeetPosition: e.target.value });
  };

  handlePaymentMethode = (e) => {
    this.setState({ selectedPaymentMethod: e.target.value });
  };
  handleDateChange = (e) => {
    this.setState({ delivery_date: e.target.value });
  };

  handlePayCnClick = async () => {
    const error = this.isValidForm();
    console.log(error);
    if (error) {
      this.setState({ error });
    } else {
      const customerId = isLogin().customer_id;
      const orderDate = moment(this.state.startDate).format("YYYY-MM-DD");
      const deliveryDate = moment(this.state.delivery_date).format(
        "YYYY-MM-DD"
      );
      const routeId = this.state.selectedRouteId;
      const meetPosition = this.state.selectedMeetPosition;
      const product = [];
      this.state.placeOrderDetails.map((item, index) => {
        product.push({
          productId: item.product_id,
          quantity: item.quantity,
          itemPrice: (item.unit_price * (100 - item.discount)) / 100,
        });
      });
      const cost = this.getTotalBill(this.state.placeOrderDetails);
      const paymentMethod = this.state.selectedPaymentMethod;
      const numOfProducts = product.length;
      //   console.log({
      //     customerId,
      //     orderDate,
      //     deliveryDate,
      //     routeId,
      //     meetPosition,
      //     product,
      //     cost,
      //     paymentMethod,
      //     numOfProducts,
      //   });
      let quantityChange = false;
      this.state.placeOrderDetails.map(async (e) => {
        if (e.quantity > e.stock) {
          e.quantity = e.stock;
          quantityChange = true;

          await api.cart.setCartQuntity({
            customer_id: isLogin().customer_id,
            quantity: e.stock,
            cart_id: e.cart_id,
          });
          if (e.stock == 0) {
            await api.cart.productDeleteFromCart({ cart_id: e.cart_id });
          }
        }
      });

      if (!quantityChange) {
        const response = await api.order.createOrder({
          customerId,
          orderDate,
          deliveryDate,
          routeId,
          meetPosition,
          product,
          cost,
          paymentMethod,
          numOfProducts,
        });
        if (response.resCode === 200) {
          console.log("succesful");
          this.props.history.push(`/my/my-orders`);
        } else {
          if (response.result.error.single)
            toast.error(response.result.error.single);
        }
      } else {
        this.setState({ error: "Product quantity changed in store." });
      }
    }
  };
  isValidForm = () => {
    if (this.state.selectedRouteId == 0) return "Please Select a Route";
    if (this.state.selectedMeetPosition == 0) return "Please Select a City";
    else return null;
  };

  render() {
    const {
      placeOrderDetails,
      startDate,
      delivery_date,
      locationDetails,
      meetPosistions,
      selectedRouteId,
      selectedMeetPosition,
      error,
      selectedPaymentMethod,
    } = this.state;
    console.log(placeOrderDetails);
    return (
      <Fragment>
        <CContainer className="mt-5">
          <h1 style={{ fontWeight: "bold", textAlign: "center" }}>
            Place Order
          </h1>
          <CRow className="mt-5">
            <CCol sm="6">
              <CCard>
                <CCardHeader
                  style={{ fontWeight: "bold", textAlign: "center" }}
                >
                  Order Details
                </CCardHeader>
                <CCardBody>
                  {placeOrderDetails.map((item, index) => (
                    <div key={index}>
                      <CCard>
                        <CCardHeader
                          style={{
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          {item.product_name}
                        </CCardHeader>
                        <CCardBody className="d-flex justify-content-center bg-secondary">
                          <CImg
                            variant="full"
                            src="/sample/product.jpeg"
                            fluid
                          />
                        </CCardBody>
                        <CCardFooter>
                          <CRow>
                            <p style={{ fontWeight: "bold" }}>
                              Order Description
                            </p>
                            <p style={{ textAlign: "justify" }}>
                              {" "}
                              <br></br>
                              {item.product_description}
                            </p>
                          </CRow>
                          <CRow>
                            <CCol xs="12" md="3">
                              <p
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "center",
                                }}
                              >
                                {`Discount : ${item.discount}%`}
                              </p>
                            </CCol>
                            <CCol xs="12" md="3">
                              <p
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "center",
                                }}
                              >
                                Quantity : {item.quantity}
                              </p>
                            </CCol>
                            <CCol xs="12" md="3">
                              <p
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "center",
                                }}
                              >
                                Total Price for this product (Rs) :{" "}
                                {numberWithCommas(
                                  (
                                    (item.unit_price *
                                      item.quantity *
                                      (100 - item.discount)) /
                                    100
                                  ).toFixed(2)
                                )}
                              </p>
                            </CCol>
                            <CCol xs="12" md="3">
                              <p
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "center",
                                }}
                              >
                                Delivery Date :
                                {moment(delivery_date).format("YYYY-MM-DD")}
                              </p>
                            </CCol>
                          </CRow>
                        </CCardFooter>
                      </CCard>
                    </div>
                  ))}
                </CCardBody>
                <CCardFooter>
                  <p style={{ fontWeight: "bold", textAlign: "center" }}>
                    Total Bill (Rs) :{" "}
                    {numberWithCommas(
                      this.getTotalBill(placeOrderDetails).toFixed(2)
                    )}
                  </p>
                </CCardFooter>
              </CCard>
            </CCol>
            <CCol sm="6">
              <CCard>
                <CCardHeader
                  style={{ fontWeight: "bold", textAlign: "center" }}
                >
                  Select Your Route
                </CCardHeader>
                <CCardBody>
                  <CFormGroup className="mb-3">
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>Route</CInputGroupText>
                      </CInputGroupPrepend>
                      <CSelect
                        custom
                        name="route"
                        value={selectedRouteId}
                        onChange={(e) => this.handleRouteChange(e)}
                      >
                        <option key={-1} value={0}>
                          ...
                        </option>
                        {locationDetails.map((item, index) => {
                          return (
                            <option key={index} value={item.truck_route_id}>
                              {`${item.start_city} - ${item.destination_city}`}
                            </option>
                          );
                        })}
                      </CSelect>
                      {/* <CInvalidFeedback>{errors[name]}</CInvalidFeedback> */}
                    </CInputGroup>
                    {selectedRouteId > 0 && (
                      <p className="text-muted">
                        {
                          locationDetails.find(
                            (e) => e.truck_route_id == selectedRouteId
                          ).route
                        }
                      </p>
                    )}
                  </CFormGroup>
                  <CFormGroup className="mb-3">
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>Town</CInputGroupText>
                      </CInputGroupPrepend>
                      <CSelect
                        custom
                        name="town"
                        value={selectedMeetPosition}
                        onChange={(e) => this.handlePosisionChange(e)}
                      >
                        <option key={-1} value={0}>
                          ...
                        </option>
                        {meetPosistions.map((item, index) => {
                          return (
                            <option key={index} value={item.position}>
                              {item.city}
                            </option>
                          );
                        })}
                      </CSelect>
                    </CInputGroup>
                  </CFormGroup>
                  <CFormGroup>
                    <CInputGroup>
                      <CInputGroupPrepend>
                        <CInputGroupText>Delivery Date</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="date"
                        id="delivery_date"
                        name="delivery_date"
                        value={delivery_date}
                        min={moment(new Date())
                          .add(7, "d")
                          .format("YYYY-MM-DD")}
                        onChange={(e) => this.handleDateChange(e)}
                      />
                      {/* <CInvalidFeedback>{errors[name]}</CInvalidFeedback> */}
                    </CInputGroup>
                  </CFormGroup>
                </CCardBody>
              </CCard>

              <CCard>
                <CCardHeader
                  style={{ fontWeight: "bold", textAlign: "center" }}
                >
                  Payment Method
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol md="12">
                      <CFormGroup variant="custom-radio" inline>
                        <CInputRadio
                          onChange={(e) => this.handlePaymentMethode(e)}
                          checked={
                            selectedPaymentMethod === "Mastercard"
                              ? true
                              : false
                          }
                          custom
                          id="inline-radio1"
                          name="mastercard"
                          value="Mastercard"
                        />
                        <CLabel
                          variant="custom-checkbox"
                          htmlFor="inline-radio1"
                        >
                          Mastercard
                        </CLabel>
                      </CFormGroup>
                      <CFormGroup variant="custom-radio" inline>
                        <CInputRadio
                          onChange={(e) => this.handlePaymentMethode(e)}
                          checked={
                            selectedPaymentMethod === "VISA" ? true : false
                          }
                          custom
                          id="inline-radio2"
                          name="visa"
                          value="VISA"
                        />
                        <CLabel
                          variant="custom-checkbox"
                          htmlFor="inline-radio2"
                        >
                          VISA
                        </CLabel>
                      </CFormGroup>
                    </CCol>
                  </CRow>
                  <br></br>
                  <CRow mt="10">
                    <CCard className="d-flex justify-content-center">
                      <CCardHeader
                        style={{ fontWeight: "bold", textAlign: "center" }}
                      >
                        Credit Card
                        <small> Form</small>
                      </CCardHeader>
                      <CCardBody>
                        <CRow>
                          <CCol xs="12">
                            <CFormGroup>
                              <CLabel htmlFor="name">Name</CLabel>
                              <CInput
                                id="name"
                                placeholder="Enter your name"
                                required
                              />
                            </CFormGroup>
                          </CCol>
                        </CRow>
                        <CRow>
                          <CCol xs="12">
                            <CFormGroup>
                              <CLabel htmlFor="ccnumber">
                                Credit Card Number
                              </CLabel>
                              <CInput
                                id="ccnumber"
                                placeholder="0000 0000 0000 0000"
                                required
                              />
                            </CFormGroup>
                          </CCol>
                        </CRow>
                        <CRow>
                          <CCol xs="4">
                            <CFormGroup>
                              <CLabel htmlFor="ccmonth">Month</CLabel>
                              <CSelect custom name="ccmonth" id="ccmonth">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                              </CSelect>
                            </CFormGroup>
                          </CCol>
                          <CCol xs="4">
                            <CFormGroup>
                              <CLabel htmlFor="ccyear">Year</CLabel>
                              <CSelect custom name="ccyear" id="ccyear">
                                <option>2021</option>
                                <option>2022</option>
                                <option>2023</option>
                                <option>2024</option>
                                <option>2025</option>
                                <option>2026</option>
                                <option>2027</option>
                                <option>2028</option>
                                <option>2029</option>
                                <option>2030</option>
                              </CSelect>
                            </CFormGroup>
                          </CCol>
                          <CCol xs="4">
                            <CFormGroup>
                              <CLabel htmlFor="cvv">CVV/CVC</CLabel>
                              <CInput id="cvv" placeholder="123" required />
                            </CFormGroup>
                          </CCol>
                        </CRow>
                      </CCardBody>
                    </CCard>
                  </CRow>
                  <CRow>
                    <CCol xs="12" md="6">
                      {error && <CAlert color="danger">{error}</CAlert>}
                      <CButton
                        onClick={() => this.handlePayCnClick()}
                        className="mt-2"
                        size="lg"
                        style={{ width: "100%" }}
                        color="success"
                      >
                        Pay
                      </CButton>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </Fragment>
    );
  }
}

export default placeOrder;
