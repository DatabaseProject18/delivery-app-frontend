import { CWidgetIcon, CCol, CRow, CSpinner } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../services/api";

const YearIncome = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(async () => {
    setLoading(true);
    const res = await api.report.getYearlyIncome();
    if (res.resCode === 200) {
      setData(res.result.data.multiple);
    } else {
      toast.error(res.result.error.single);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    return () => toast.dismiss();
  }, []);

  return (
    <React.Fragment>
      <CRow hidden={!loading}>
        <CCol className="d-flex justify-content-center" style={{ top: "35vh" }}>
          <CSpinner color="danger" style={{ width: "3rem", height: "3rem" }} />
        </CCol>
      </CRow>
      <CRow hidden={loading}>
        {data.map((item, index) => (
          <CCol key={index} xs="12" sm="6" md="3">
            <Link to={`/my/quarterly-income/${item.order_year}`}>
              <CWidgetIcon
                text={`Income of ${item.order_year}`}
                header={`RS. ${item.income}`}
                color="primary"
              >
                <CIcon width={24} name="cil-dollar" />
              </CWidgetIcon>
            </Link>
          </CCol>
        ))}
      </CRow>
    </React.Fragment>
  );
};

export default YearIncome;
