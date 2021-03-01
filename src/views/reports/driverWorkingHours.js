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
  const [driverData, setDriverData] = useState([]);
  const [years, setYears] = useState([]);
  const [year, setYear] = useState("All");
  const [month, setMonth] = useState("All");
  const [monthDisable, setMonthDisable] = useState(true);

  const months = [
    {
      name: "Jan",
      num: 1,
    },
    {
      name: "Feb",
      num: 2,
    },
    {
      name: "Mar",
      num: 3,
    },
    {
      name: "Apr",
      num: 4,
    },
    {
      name: "May",
      num: 5,
    },
    {
      name: "Jun",
      num: 6,
    },
    {
      name: "Jul",
      num: 7,
    },
    {
      name: "Aug",
      num: 8,
    },
    {
      name: "Sep",
      num: 9,
    },
    {
      name: "Oct",
      num: 10,
    },
    {
      name: "Nov",
      num: 11,
    },
    {
      name: "Dec",
      num: 12,
    },
  ];

  useEffect(async () => {
    setLoading(true);
    const res = await api.report.getYears();
    if (res.resCode === 200) {
      setYears(res.result.data.multiple);
    } else {
      toast.error(res.result.error.single);
    }
    await requestDriverData();
    setLoading(false);
  }, [year,month]);

  const requestDriverData = async () => {
    let res;
    if (year === "All" && month === "All"){
      res = await api.report.getDriverWorkingHours();
    }else if (year !== "All" && month !== "All" ){
      res = await api.report.getDriverWorkingHours(year,month);
    }else if (year !== "All" && month === "All"){
      res = await api.report.getDriverWorkingHours(year);
    }
    if (res.resCode === 200) {
      setDriverData(res.result.data.multiple);
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

  const handleYearChange = ({ currentTarget: input }) => {
    setYear(input.value);
    if (input.value === "All") {
      setMonth("All");
      setMonthDisable(true);
    } else {
      setMonthDisable(false);
    }
  };

  const handleMonthChange = async ({ currentTarget: input }) => {
    setMonth(input.value);
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
    {
      key: "working_place",
      label: "Working Place",
      _style: { width: "20%" },
    },
    {
      key: "num_of_turns",
      label: "Total Number Of Turns",
      _style: { width: "20%" },
    },
    {
      key: "total_working_hours",
      label: "Total Working Hours (Hours)",
      _style: { width: "20%" },
    },
  ];

  return (
    <React.Fragment>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Driver Working Hours</CCardHeader>
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
                <CCol md="2" sm="3" xs="6">
                  <CFormGroup>
                    <CLabel htmlFor="month">Month</CLabel>
                    <CSelect
                      disabled={monthDisable}
                      custom
                      name="month"
                      id="month"
                      onChange={handleMonthChange}
                      value={month}
                    >
                      <option value="All">All</option>
                      {months.map((item, index) => (
                        <option key={index} value={item.num}>
                          {item.name}
                        </option>
                      ))}
                    </CSelect>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CDataTable
                items={driverData}
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
