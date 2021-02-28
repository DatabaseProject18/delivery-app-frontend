import React, { Component } from "react";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CButton,
} from "@coreui/react";
import { toast } from "react-toastify";
import { api } from "../../services/api";
import { isLogin } from "../../services/auth";
import { numberWithCommas } from "../../utils/numberConvert";

class User extends Component {
  state = {
    fields: ["first_name","last_name","email","address","user_type"],
    user_id: this.props.match.params.user_id,
    userData: [],
  };

  async componentDidMount() {
    const response = await api.user.userFullDetails(this.state.user_id);
    if (response.resCode === 200) {
      const data = response.result.data.multiple;
      console.log(data);
      data.map((key) => {
        if(key.user_type.split("_").length === 2){
          key.user_type = key.user_type.split("_")[0]+" "+key.user_type.split("_")[1];
          key.user_type = key.user_type.charAt(0).toUpperCase()+ key.user_type.slice(1);
        }else{
          key.user_type = key.user_type.split("_")[0].charAt(0).toUpperCase()+key.user_type.slice(1);
        }
    });
      this.setState({ userData: data });
    } else {
      if (response.result.error.single)
        toast.error(response.result.error.single);
    }
  }
  componentWillUnmount() {
    toast.dismiss();
  }

  render() {
    const { user_id, userData, fields } = this.state;

    return (
        <CRow>
          <CCol>
            <CCard>
              <CCardHeader>User</CCardHeader>
              <CCardBody>
                <CDataTable
                  items={userData}
                  fields={fields}
                  hover
                  striped
                  bordered
                  size="md"
                  //itemsPerPage={10}
                  //pagination
                  sorter
                  //onRowClick={(e) => this.handleRowClick(e.driver_id)}
                  //clickableRows
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      );
  }
}

export default User;

