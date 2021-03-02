import React from 'react';
import {
    CBadge,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CRow
} from "@coreui/react";
import { toast } from "react-toastify";
import { api } from "../../services/api";
import {Component} from "react/cjs/react.production.min";

class NewSingleOrderDetails extends Component {
    state = {
        order_id: this.props.match.params.order_id,
        fields: ['product_name','product_volume'],
        orderData: [],
    };

    async componentDidMount() {
        const response = await api.delivery_manager.getNewOrderDetails(this.state.order_id);
        console.log(response);
        if (response.resCode === 200) {
            const data = response.result.data.multiple;
            this.setState({ orderData: data });
        } else {
            if (response.result.error.single)
                toast.error(response.result.error.single);
        }
    }

    componentWillUnmount() {
        toast.dismiss();
    }

    render() {
        const { orderData, fields} = this.state;
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



            </CRow>

        );
    }
}

export default NewSingleOrderDetails;
