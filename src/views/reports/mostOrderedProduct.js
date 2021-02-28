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
  const [productData, setProductData] = useState([]);
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
  }, [year]);

  const requestProductData = async () => {
    let res;
    if (year === "All") {
      res = await api.report.getOrderCountOfProducts();
    } else {
      res = await api.report.getOrderCountOfProducts(year);
    }
    if (res.resCode === 200) {
      setProductData(res.result.data.multiple);
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
    setYear(input.value)
  };

  useEffect(() => {
    return () => toast.dismiss();
  }, []);

  const fields = [
    { key: "product_name", label: "Product Name", _style: { width: "30%" } },
    {
      key: "product_volume",
      label: "Product Volume (cm^3)",
      _style: { width: "20%" },
    },
    { key: "category_name", label: "Category", _style: { width: "20%" } },
    { key: "unit_price", label: "Unit Price", _style: { width: "20%" } },
    { key: "discount", label: "Discount (%)", _style: { width: "20%" } },
    {
      key: "num_of_orders",
      label: "Total Number Of Orders",
      _style: { width: "20%" },
    },
    { key: "quantity", label: "Sold Quantity", _style: { width: "20%" } },
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
                      value={year}
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
                items={productData}
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
