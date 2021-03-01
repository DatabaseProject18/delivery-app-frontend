import React, { Component } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
} from "@coreui/react";
import { toast } from "react-toastify";
import { api } from "../../services/api";
import { isLogin } from "../../services/auth";
class Users extends Component {
  state = {
    fields: ["user_id","first_name","last_name","email","user_type"],
    userData: [],
  };

  async componentDidMount() {
    const response = await api.user.userDetails();
    console.log(response);
    if (response.resCode === 200) {
      const data = response.result.data.multiple;
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

  handleRowClick = (user_id) => {
    this.props.history.push(`/users/${user_id}`);
  };

  render() {
    const { userData, fields } = this.state;
    return (
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Users</CCardHeader>
            <CCardBody>
              <CDataTable
                items={userData}
                fields={fields}
                hover
                striped
                bordered
                size="md"
                itemsPerPage={10}
                pagination
                sorter
                onRowClick={(e) => this.handleRowClick(e.user_id)}
                clickableRows
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    );
  }
}

export default Users;
