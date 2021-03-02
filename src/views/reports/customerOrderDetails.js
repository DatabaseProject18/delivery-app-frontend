import {
  CCol,
  CRow,
  CSpinner,
  CCard,
  CCardHeader,
  CCardBody,
  CDataTable,
  CBadge,
  CButton,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { api } from "../../services/api";
import _ from "lodash";

const QuarterlyIncome = (props) => {
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState([]);

  useEffect(async () => {
    setLoading(true);
    const res = await api.report.getCustomerOrderBasicDetails(
      props.match.params.customerId
    );
    if (res.resCode === 200) {
      setOrderData(res.result.data.multiple);
    } else {
      if (res.result.error.multiple && res.result.error.multiple.query) {
        Object.values(res.result.error.multiple.query).map((str) =>
          toast.error(str)
        );
      } else {
        toast.error(res.result.error.single);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    return () => toast.dismiss();
  }, []);

  const fields = [
    { key: "order_date", label: "Order Date", _style: { width: "20%" } },
    {
      key: "cost",
      label: "Cost (Rs.)",
      _style: { width: "20%" },
    },
    { key: "destination", label: "Store City", _style: { width: "20%" } },
    { key: "order_status", label: "Order Status", _style: { width: "20%" } },
  ];

  const getBadge = (status) => {
    switch (status) {
      case "Preparing":
        return "primary";
      case "Canceled":
        return "danger";
      case "Sent":
        return "info";
      case "Delivered":
        return "success";
      default:
        return "dark";
    }
  };

  return (
    <React.Fragment>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Basic Order Details</CCardHeader>
            <CCardBody>
              <CDataTable
                items={orderData}
                fields={fields}
                columnFilter
                footer
                loading={loading}
                itemsPerPageSelect
                itemsPerPage={5}
                hover
                sorter
                pagination
                scopedSlots={{
                  order_status: (item) => (
                    <td>
                      <CBadge color={getBadge(item.order_status)}>
                        {item.order_status}
                      </CBadge>
                    </td>
                  ),
                  order_date: (item) => {
                    const dateTime = new Date(item.order_date);
                    return (
                      <td>{`${dateTime.getFullYear()}-${
                        dateTime.getMonth() + 1
                      }-${dateTime.getDate()}`}</td>
                    );
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </React.Fragment>
  );
};

export default QuarterlyIncome;
