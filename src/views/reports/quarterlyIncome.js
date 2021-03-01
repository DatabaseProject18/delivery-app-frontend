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
  const [quarterIncomeData, setQuarterIncomeData] = useState([]);

  useEffect(async () => {
    setLoading(true);
    const res = await api.report.getQuarterlyIncome(props.match.params.year);
    if (res.resCode === 200) {
      setQuarterIncomeData(res.result.data.multiple);
    } else {
      if (res.result.error.multiple) {
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
    { key: "quarter", label: "Quarter", _style: { width: "20%" } },
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

  return (
    <React.Fragment>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Quaterly Income</CCardHeader>
            <CCardBody>
              <CDataTable
                items={quarterIncomeData}
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
                              `/my/quarter-orders-basic/${props.match.params.year}/${item.quarter}`
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
