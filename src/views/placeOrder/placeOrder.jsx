import React, { Component, Fragment } from 'react';
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
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CContainer,
    CImg,
    CCardFooter,
    CInput,
    CSelect,
  } from "@coreui/react";
  import { toast } from "react-toastify";
  import { api } from "../../services/api";
  import { isLogin } from "../../services/auth";
  import { numberWithCommas } from "../../utils/numberConvert";
  import { divide } from 'lodash';
  import moment from "moment";

class placeOrder extends Component {
    state = {
        placeOrderDetails: [{"kjg":45}],
        startDate: moment(new Date()),
        isPaid: false,
    }

    async componentDidMount() {
        const response = await api.cart.getCart({
            customer_id: isLogin().customer_id,
        });
        console.log(response);
        if (response.resCode === 200) {
            let data = response.result.data.multiple;
            this.setState({ placeOrderDetails: data });
        } 
        else {
            if (response.result.error.single)
                toast.error(response.result.error.single);
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

    render() {
        const {placeOrderDetails, startDate} = this.state
        console.log(placeOrderDetails)
        return (
            <Fragment>
                <CContainer className = "mt-5">
                    <h1 style = {{ fontWeight: "bold", textAlign: "center" }}>Place Order</h1>
                    <CRow className = "mt-5">
                        <CCol sm = "6">                           
                                <CCard>
                                    <CCardHeader style = {{ fontWeight: "bold", textAlign: "center"}}>
                                        Order Details
                                    </CCardHeader>
                                    <CCardBody>
                                    {placeOrderDetails.map((item,index)=>(<div key={index}>
                                        <CCard>
                                            <CCardHeader style = {{ fontWeight: "bold", textAlign: "center"}}>
                                                {item.product_name}
                                            </CCardHeader>
                                            <CCardBody className = "d-flex justify-content-center bg-secondary">
                                                <CImg variant = "full" src = "/sample/product.jpeg" fluid />
                                            </CCardBody>
                                            <CCardFooter>
                                                <CRow>
                                                    <p style={{ fontWeight: "bold" }}>Order Description</p>
                                                    <p style={{ textAlign: "justify" }}>
                                                        {" "}
                                                        <br></br>
                                                        {item.product_description}
                                                    </p>
                                                </CRow>
                                                <CRow>
                                                    <CCol xs="12" md="3">
                                                        <p style={{ fontWeight: "bold", textAlign: "center" }}>
                                                            {`Discount : ${item.discount}%`}
                                                        </p>
                                                    </CCol>
                                                    <CCol xs="12" md="3">
                                                        <p style={{ fontWeight: "bold", textAlign: "center" }}>
                                                            Quantity : {item.quantity}
                                                        </p>
                                                    </CCol>
                                                    <CCol xs="12" md="3">
                                                        <p style={{ fontWeight: "bold", textAlign: "center" }}>
                                                            Total Price for this product (Rs) : {numberWithCommas(
                                                                ((item.unit_price*item.quantity*(100-item.discount)/100).toFixed(2)
                                                            ))}                                               
                                                        </p>
                                                    </CCol>
                                                    <CCol xs="12" md="3">
                                                        <p style={{ fontWeight: "bold", textAlign: "center" }}>
                                                            Delivery Date : {moment(startDate).add(7, 'days').format('YYYY/MM/DD')}
                                                        </p>
                                                    </CCol>
                                                </CRow>
                                            </CCardFooter>
                                        </CCard>
                                    </div>))}
                                    </CCardBody>
                                    <CCardFooter>
                                        <p style={{ fontWeight: "bold", textAlign: "center" }}>
                                            Total Bill (Rs) : {" "}
                                            {numberWithCommas(this.getTotalBill(placeOrderDetails).toFixed(2))}
                                        </p>
                                    </CCardFooter>
                                </CCard>
                                
                            
                               
                        </CCol>
                        <CCol sm = "6">
                            <CCard>
                                <CCardHeader style = {{ fontWeight: "bold", textAlign: "center"}}>
                                    Payment Method
                                </CCardHeader>
                                <CCardBody>
                                    <CRow>
                                        <CCol md="12">
                                            <CFormGroup variant="custom-radio" inline>
                                                <CInputRadio custom id="inline-radio1" name="inline-radios" value="option1" />
                                                <CLabel variant="custom-checkbox" htmlFor="inline-radio1">Mastercard</CLabel>
                                            </CFormGroup>
                                            <CFormGroup variant="custom-radio" inline>
                                                <CInputRadio custom id="inline-radio2" name="inline-radios" value="option2" />
                                                <CLabel variant="custom-checkbox" htmlFor="inline-radio2">VISA</CLabel>
                                            </CFormGroup>
                                        </CCol>                                   
                                    </CRow>
                                    <br></br>
                                    <CRow mt="10">
                                        <CCard className="d-flex justify-content-center">
                                            <CCardHeader style = {{ fontWeight: "bold", textAlign: "center"}}>
                                                Credit Card
                                                <small> Form</small>
                                            </CCardHeader>
                                            <CCardBody>
                                            <CRow>
                                                <CCol xs="12">
                                                <CFormGroup>
                                                    <CLabel htmlFor="name">Name</CLabel>
                                                    <CInput id="name" placeholder="Enter your name" required />
                                                </CFormGroup>
                                                </CCol>
                                            </CRow>
                                            <CRow>
                                                <CCol xs="12">
                                                <CFormGroup>
                                                    <CLabel htmlFor="ccnumber">Credit Card Number</CLabel>
                                                    <CInput id="ccnumber" placeholder="0000 0000 0000 0000" required />
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
                                                        <CInput id="cvv" placeholder="123" required/>
                                                    </CFormGroup>
                                                </CCol>
                                            </CRow>
                                            </CCardBody>
                                        </CCard>
                                    </CRow>
                                    <CRow>
                                        <CCol xs="12" md="6">
                                            <CButton
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