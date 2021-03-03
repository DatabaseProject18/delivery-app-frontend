import React from 'react';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCardFooter,
    CCol,
    CDataTable,
    CRow,
    CLabel,
    CFormGroup, CForm, CInputGroupText, CInputGroupPrepend, CSelect,
} from "@coreui/react";
import { toast } from "react-toastify";
import { api } from "../../services/api";
import {Component} from "react/cjs/react.production.min";
import Moment from 'moment';
import {isLogin} from "../../services/auth";

class NewSingleOrderDetails extends Component {
    state = {
        order_id: this.props.match.params.order_id,
        fields: ['product_name','product_volume'],
        orderData: [],
        totalVolume: 0,
        destination: '',
        ord_date: '',
        del_date: '',
        trains: [],
        timeSlots: [],
        sendTrainId: [],
        send_train_time_table_id: ''
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

        const trainsRes = await api.delivery_manager.getTrainList(this.state.order_id);
        if (trainsRes.resCode === 200) {
            const data = trainsRes.result.data.multiple;
            this.setState({trains: data})
            this.state.sendTrainId = this.state.trains[0].train_id;
        } else {
            if (trainsRes.result.error.single)
                toast.error(trainsRes.result.error.single);
        }

        const timeSlotRes = await api.delivery_manager.getTimeSlot(this.state.trains[0].train_id);
        if (timeSlotRes.resCode === 200) {
            const data = timeSlotRes.result.data.multiple;
            this.setState({timeSlots: data});
            this.state.send_train_time_table_id = this.state.timeSlots[0].train_time_table_id;
        } else {
            if (timeSlotRes.result.error.single)
                toast.error(timeSlotRes.result.error.single);
        }
    }


    componentWillUnmount() {
        toast.dismiss();
    }

    rejectOrder = async () => {
        const res = await api.delivery_manager.rejectOrder(this.state.order_id);
        if (res.resCode === 200) {
            toast.success('Order Successfully Rejected');
        } else {
            if (res.result.error.single)
                toast.error(res.result.error.single);
        }
    };

    shipOrder = async () => {
        console.log("********shiped*******", this.state.order_id, this.state.send_train_time_table_id, isLogin().delivery_manager_id)
        const shipRes = await api.delivery_manager.createTrainSchedule(this.state.order_id, this.state.send_train_time_table_id, isLogin().delivery_manager_id);
        if (shipRes.resCode === 200) {
            const data = shipRes.result.data.multiple;
        } else {
            if (shipRes.result.error.single)
                toast.error(shipRes.result.error.single);
        }

        const shipStateUpdate = await api.delivery_manager.shipOrder(this.state.order_id);
        if (shipStateUpdate.resCode === 200) {
            toast.success('Order Successfully Shipped');
        } else {
            if (shipStateUpdate.result.error.single)
                toast.error(shipStateUpdate.result.error.single);
        }
    };

    handleSelectTrain = async (e) => {
        const timeSlotRes = await api.delivery_manager.getTimeSlot(e.target.value);
        this.state.sendTrainId = e.target.value;
        if (timeSlotRes.resCode === 200) {
            const data = timeSlotRes.result.data.multiple;
            this.setState({timeSlots: data});
        } else {
            if (timeSlotRes.result.error.single)
                toast.error(timeSlotRes.result.error.single);
        }
    };

    setTrainTimeTableId = async (e) => {
        this.state.send_train_time_table_id = e.target.value;
    };

    render() {
        const { orderData, fields, destination, del_date, ord_date, totalVolume, trains, timeSlots} = this.state;
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

                    <CCard>
                        <CCardHeader>Create a Train Trip</CCardHeader>

                        <CCardBody>
                            <CForm>
                                <CFormGroup className="mb-3">
                                    <CInputGroupPrepend>
                                        <CInputGroupText>Train</CInputGroupText>
                                    </CInputGroupPrepend>
                                    <CSelect
                                        custom
                                        name="train"
                                        value ={this.state.train_id}
                                        onChange={(e) => this.handleSelectTrain(e)}
                                        //invalid={errors[name] ? true : false}
                                    >
                                        {trains.map((option, index) => {
                                            return (
                                                <option
                                                    key={index}
                                                    value={option.train_id}
                                                >{`${option.train_name}`}</option>
                                            );
                                        })}
                                    </CSelect>

                                </CFormGroup>

                                <CFormGroup className="mb-3">
                                    <CInputGroupPrepend>
                                        <CInputGroupText>Time Slot</CInputGroupText>
                                    </CInputGroupPrepend>
                                    <CSelect
                                        custom
                                        name="time_slot"
                                        value ={this.state.train_time_table_id}
                                        onChange={(e) => this.setTrainTimeTableId(e)}
                                        //invalid={errors[name] ? true : false}
                                    >
                                        {timeSlots.map((option, index) => {
                                            return (
                                                <option
                                                    key={index}
                                                    value={option.train_time_table_id}
                                                >{`${option.train_time}`}</option>
                                            );
                                        })}
                                    </CSelect>

                                </CFormGroup>
                            </CForm>
                        </CCardBody>

                        <CCardFooter>
                            <CButton type="submit"
                                     shape="pill"
                                     size="mm"
                                     color="success"
                                     onClick={() => {this.shipOrder();}}> <b>Ship Order</b></CButton>
                            <CButton type="reset"
                                     shape="pill"
                                     size="mm"
                                     color="danger"
                                     onClick={() => {this.rejectOrder();}}> <b>Reject Order</b></CButton>
                        </CCardFooter>
                    </CCard>
                </CCol>




            </CRow>

        );
    }
}

export default NewSingleOrderDetails;
