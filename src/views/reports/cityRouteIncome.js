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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { api } from "../../services/api";
import _ from "lodash";

const QuarterlyIncome = (props) => {
  const [loading, setLoading] = useState(false);
  const [incomeData, setIncomeData] = useState([]);
  const [years, setYears] = useState([]);
  const [year, setYear] = useState("All");

  useEffect(async () => {
    setLoading(true);
    const res = await api.report.getYears();
    if (res.resCode === 200) {
      setYears(res.result.data.multiple);
    } else {
      toast.error(res.result.error.single);
    }
    await requestProductData();
    setLoading(false);
  }, []);

  const requestProductData = async (year) => {
    let res;
    if (year) {
      res = await api.report.getCityRouteIncome();
    } else {
      res = await api.report.getCityRouteIncome(year);
    }
    if (res.resCode === 200) {
      setIncomeData(res.result.data.multiple);
    } else {
      if (res.result.error.multiple && res.result.error.multiple.query) {
        Object.values(res.result.error.multiple.query).map((str) =>
          toast.error(str)
        );
      } else {
        toast.error(res.result.error.single);
      }
    }
  };

  const handleChange = async ({ currentTarget: input }) => {
    setLoading(true);
    if (input.value === "All") {
      await requestProductData();
    } else {
      await requestProductData(input.value);
    }
    setLoading(false);
  };

  useEffect(() => {
    return () => toast.dismiss();
  }, []);

  const fields = [
    { key: "route_name", label: "Route Name", _style: { width: "30%" } },
    {
      key: "delivery_town",
      label: "Delivery Town",
      _style: { width: "20%" },
    },
    { key: "store_name", label: "Store Name", _style: { width: "20%" } },
    { key: "train_destination", label: "Train Destination", _style: { width: "20%" } },
    {
      key: "number_of_orders",
      label: "Total Number Of Orders",
      _style: { width: "20%" },
    },
    { key: "income", label: "Income (Rs.)", _style: { width: "20%" } },
  ];

  return (
    <React.Fragment>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Order Count of Each Product</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md="2" sm="3" xs="6">
                  <CFormGroup>
                    <CLabel htmlFor="year">Year</CLabel>
                    <CSelect
                      custom
                      name="year"
                      id="year"
                      onChange={handleChange}
                    >
                      <option value="All">All</option>
                      {years.map((item, index) => (
                        <option key={index} value={item.year}>
                          {item.year}
                        </option>
                      ))}
                    </CSelect>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CDataTable
                items={incomeData}
                fields={fields}
                columnFilter
                footer
                loading={loading}
                itemsPerPageSelect
                itemsPerPage={5}
                hover
                sorter
                pagination
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </React.Fragment>
  );
};

export default QuarterlyIncome;
