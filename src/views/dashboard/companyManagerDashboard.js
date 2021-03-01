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
  CFormGroup,
  CLabel,
  CSelect,
  CWidgetProgressIcon,
  CCardGroup,
} from "@coreui/react";
import { CChartBar } from "@coreui/react-chartjs";
import CIcon from "@coreui/icons-react";
import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { toast } from "react-toastify";

const CompanyManagerDashboard = () => {
  const [orderCount, setOrderCount] = useState({});
  const [loading,setLoading] = useState(false);
  const [values,setValues] = useState([]);
  const [labels,setLabels] = useState([]);

  useEffect(async() => {
    setLoading(true);
    let res = await api.order.getOrdersByStatus();
    if (res.resCode === 200){
      createOrderCountObject(res.result.data.multiple);
    }else{
      toast.error(res.result.error.single);
    }
    res = await api.report.getYearlyIncome();
    if (res.resCode === 200){
      createYearlyIncomeArrayss(res.result.data.multiple);
    }else{
      toast.error(res.result.error.single);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    return () => toast.dismiss();
  }, []);

  const createOrderCountObject = (data) => {
    let obj = {};
    data.map((item)=>{
      obj[item.order_status] = item.num_of_orders
    })
    setOrderCount(obj);
  }

  const createYearlyIncomeArrayss = (data) => {
    let values = [];
    let labels = [];
    data.map((item)=>{
      labels.push(item.order_year);
      values.push(item.income);
    })
    setValues(values);
    setLabels(labels)
  }

  return (
    <React.Fragment>
      <CRow hidden={!loading}>
        <CCol className="d-flex justify-content-center" style={{ top: "35vh" }}>
          <CSpinner color="danger" style={{ width: "3rem", height: "3rem" }} />
        </CCol>
      </CRow>
      <CRow hidden={loading}>
        <CCol sm="12" md="3">
          <CWidgetProgressIcon
            header={`${orderCount.Delivered}`}
            text="Delivered Orders"
            color="gradient-success"
            inverse
          >
            <CIcon name="cil-gift" height="36" />
          </CWidgetProgressIcon>
        </CCol>
        <CCol sm="12" md="3">
          <CWidgetProgressIcon
            header={`${orderCount.Sent}`}
            text="Sent Orders"
            color="gradient-info"
            inverse
          >
            <CIcon name="cil-arrow-thick-from-left" height="36" />
          </CWidgetProgressIcon>
        </CCol>
        <CCol sm="12" md="3">
          <CWidgetProgressIcon
            header={`${orderCount.Preparing}`}
            text="Preparing Orders"
            color="gradient-primary"
            inverse
          >
            <CIcon name="cil-sync" height="36" />
          </CWidgetProgressIcon>
        </CCol>
        <CCol sm="12" md="3">
          <CWidgetProgressIcon
            header={`${orderCount.Canceled}`}
            text="Canceled Orders"
            color="gradient-danger"
            inverse
          >
            <CIcon name="cil-trash" height="36" />
          </CWidgetProgressIcon>
        </CCol>
      </CRow>
      <CRow hidden={loading}>
        <CCol>
          <CCard>
            <CCardHeader>Yearly Income</CCardHeader>
            <CCardBody>
              <CChartBar
                datasets={[
                  {
                    label: "Income",
                    backgroundColor: "#f87979",
                    data: values,
                  },
                ]}
                labels={labels}
                options={{
                  tooltips: {
                    enabled: true,
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

export default CompanyManagerDashboard;
