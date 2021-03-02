import React from 'react';
import {
    CBadge,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CRow,
    CLabel,
    CFormGroup,
} from "@coreui/react";
import { toast } from "react-toastify";
import { api } from "../../services/api";
import {Component} from "react/cjs/react.production.min";
import Moment from 'moment';

class NewSingleOrderDetails extends Component {
    state = {
        order_id: this.props.match.params.order_id,
        fields: ['product_name','product_volume'],
        orderData: [],
        totalVolume: 0,
        destination: '',
        ord_date: '',
        del_date: ''
    };

    async componentDidMount() {
        const response = await api.delivery_manager.getNewOrderDetails(this.state.order_id);
        console.log(response);
        if (response.resCode === 200) {
            const data = response.result.data.multiple;
            this.setState({ orderData: data });
            this.setState({ ord_date: Moment(this.state.orderData[0]['order_date']).format('DD-MM-YYYY')});
            this.setState({ del_date: Moment(this.state.orderData[0]['delivery_date']).format('DD-MM-YYYY')});
            this.setState({ destination: this.state.orderData[0]['destination']});
        } else {
            if (response.result.error.single)
                toast.error(response.result.error.single);
        }

        const volResponse = await api.delivery_manager.getTotalVolume(this.state.order_id);
        if (volResponse.resCode === 200) {
            const data = volResponse.result.data.multiple;
            this.setState({totalVolume: data[0]['supply_chain_management_db.get_total_volume_of_order(order_id)']});
        } else {
            if (volResponse.result.error.single)
                toast.error(volResponse.result.error.single);
        }
    }


    componentWillUnmount() {
        toast.dismiss();
    }

    render() {
        const { orderData, fields, destination, del_date, ord_date, totalVolume} = this.state;
        const DATE_OPTIONS = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return(
            <CRow>
                <CCol>
                    <CCard>
                        <CCardHeader>Order Items</CCardHeader>
                        <CCardBody>
                            <CDataTable
                                items={orderData}
                                fields={fields}
                                hover
                                striped
                                bordered
                                size="md"
                                itemsPerPage={10}
                                pagination
                                sorter
                                clickableRows
                            />
                        </CCardBody>
                    </CCard>
                </CCol>

                <CCol>
                    <CCard>
                        <CCardHeader>
                            Order Details
                        </CCardHeader>
                        <CCardBody>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel><b>Ordered Date</b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <p className="form-control-static">{ord_date}</p>
                                </CCol>
                            </CFormGroup>

                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel><b>Delivery Date</b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <p className="form-control-static">{del_date}</p>
                                </CCol>
                            </CFormGroup>

                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel><b>Destination</b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <p className="form-control-static">{destination}</p>
                                </CCol>
                            </CFormGroup>

                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel><b>Total Volume</b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <p className="form-control-static">{totalVolume}</p>
                                </CCol>
                            </CFormGroup>
                        </CCardBody>
                    </CCard>
                </CCol>

            </CRow>

        );
    }
}

export default NewSingleOrderDetails;
