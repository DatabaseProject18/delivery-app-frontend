import React from 'react'
import {
    CBadge,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CRow
} from '@coreui/react'
import { toast } from "react-toastify";
import { api } from "../../services/api";
import {Component} from "react/cjs/react.production.min";

class NewOrderDetails extends Component {
    state = {
        fields: ['order_id', 'order_date', 'delivery_date', 'destination'],
        newOrderDetails: [],
    };

    async componentDidMount() {
        const response = await api.delivery_manager.newOrders({});
        console.log(response);
        if (response.resCode === 200) {
            const data = response.result.data.multiple;
            this.setState({newOrderDetails: data});
        } else {
            if (response.result.error.single)
                toast.error(response.result.error.single);
        }
    }

    componentWillUnmount() {
        toast.dismiss();
    }

    handleRowClick = (order_id) => {
        this.props.history.push(`/my/newOrder/${order_id}`);
    };

    render() {
        const { newOrderDetails, fields } = this.state;
        return (
            <CRow>
                <CCol>
                    <CCard>
                        <CCardHeader>New Orders</CCardHeader>
                        <CCardBody>
                            <CDataTable
                                items={newOrderDetails}
                                fields={fields}
                                hover
                                striped
                                bordered
                                size="md"
                                itemsPerPage={10}
                                pagination
                                sorter
                                onRowClick={(e) => this.handleRowClick(e.order_id)}
                                clickableRows
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        );
    }
}

export default NewOrderDetails
