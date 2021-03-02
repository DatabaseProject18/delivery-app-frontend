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

const AdminDashboard = (props) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [fetchData,setfetchData] = useState(true);

  useEffect(async () => {
    setLoading(true);
    const res = await api.user.getUsersDetailsWithAccountStatus();
    if (res.resCode === 200) {
      setUserData(res.result.data.multiple);
    } else {
      toast.error(res.result.error.single);
    }
    setLoading(false);
  }, [fetchData]);

  const enableAccount = async (userId) => {
    setLoading(true);
    const res = await api.user.enableAccount(userId);
    if (res.resCode === 200) {
      toast.success("Succefully enabled the account");
    } else {
      if (res.result.error.multiple && res.result.error.multiple.query) {
        Object.values(res.result.error.multiple.query).map((str) =>
          toast.error(str)
        );
      } else {
        toast.error(res.result.error.single);
      }
    }
    setfetchData(!fetchData);
    setLoading(false);
  };

  const disableAccount = async (userId) => {
    setLoading(true);
    const res = await api.user.disableAccount(userId);
    if (res.resCode === 200) {
      toast.success("Succefully disabled the account");
    } else {
      if (res.result.error.multiple && res.result.error.multiple.query) {
        Object.values(res.result.error.multiple.query).map((str) =>
          toast.error(str)
        );
      } else {
        toast.error(res.result.error.single);
      }
    }
    setfetchData(!fetchData);
    setLoading(false);
  };

  useEffect(() => {
    return () => toast.dismiss();
  }, []);

  const fields = [
    { key: "first_name", label: "First Name", _style: { width: "20%" } },
    { key: "last_name", label: "Last Name", _style: { width: "20%" } },
    { key: "email", label: "Email", _style: { width: "20%" } },
    {
      key: "address",
      label: "Address",
      _style: { width: "20%" },
    },
    { key: "user_type", label: "User Type", _style: { width: "20%" } },
    { key: "status", label: "Account Status", _style: { width: "20%" } },
    {
      key: "show_details",
      label: "",
      _style: { width: "1%" },
      sorter: false,
      filter: false,
    },
  ];

  const getBadge = (status) => {
    switch (status) {
      case 1:
        return "success";
      case 0:
        return "danger";
      default:
        return "dark";
    }
  };

  return (
    <React.Fragment>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Quaterly Income</CCardHeader>
            <CCardBody>
              <CDataTable
                items={userData}
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
                        {!item.status ? (
                          <CButton
                            color="success"
                            variant="outline"
                            shape="square"
                            size="sm"
                            onClick={() => {
                              enableAccount(item.user_id);
                            }}
                          >
                            Enable
                          </CButton>
                        ) : (
                          ""
                        )}
                        {item.status ? (
                          <CButton
                            color="danger"
                            variant="outline"
                            shape="square"
                            size="sm"
                            onClick={() => {
                              disableAccount(item.user_id);
                            }}
                          >
                            Disable
                          </CButton>
                        ) : (
                          ""
                        )}
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

export default AdminDashboard;
