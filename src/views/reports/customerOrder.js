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
  const [years, setYears] = useState([]);
  const [year,setYear] = useState("All");
  const [customerData, setCustomerData] = useState([]);

  useEffect(async () => {
    setLoading(true);
    const res = await api.report.getYears();
    if (res.resCode === 200) {
      setYears(res.result.data.multiple);
    } else {
      toast.error(res.result.error.single);
    }
    await requestCustomerData();
    setLoading(false);
  }, [year]);

  const requestCustomerData = async () => {
    let res;
    if (year === "All"){
      res = await api.report.getCustomerOrders();
    }else{
      res = await api.report.getCustomerOrders(year);
    }
    if (res.resCode === 200) {
      setCustomerData(res.result.data.multiple);
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

  useEffect(() => {
    return () => toast.dismiss();
  }, []);

  const fields = [
    { key: "name", label: "Name", _style: { width: "30%" } },
    {
      key: "email",
      label: "Email Address",
      _style: { width: "20%" },
    },
    { key: "address", label: "Address", _style: { width: "20%" } },
    { key: "customer_type", label: "Customer Type", _style: { width: "20%" } },
    {
      key: "num_of_orders",
      label: "Number Of Orders",
      _style: { width: "20%" },
    },
    { key: "income", label: "Income (Rs.)", _style: { width: "20%" } },
    {
      key: "show_details",
      label: "",
      _style: { width: "1%" },
      sorter: false,
      filter: false,
    },
  ];

  const handleYearChange = ({ currentTarget: input }) => {
    setYear(input.value);
  };

  return (
    <React.Fragment>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Customer Orders</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md="2" sm="3" xs="6">
                  <CFormGroup>
                    <CLabel htmlFor="year">Year</CLabel>
                    <CSelect
                      custom
                      name="year"
                      id="year"
                      onChange={handleYearChange}
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
                items={customerData}
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
                  show_details: (item) => {
                    return (
                      <td className="py-2">
                        <CButton
                          color="primary"
                          variant="outline"
                          shape="square"
                          size="sm"
                          onClick={() => {
                            props.history.push(
                              `/my/customer-order/${item.customer_id}`
                            );
                          }}
                        >
                          Show
                        </CButton>
                      </td>
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
