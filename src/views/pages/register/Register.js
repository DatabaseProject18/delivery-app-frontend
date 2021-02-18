import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import Joi from "joi";
import React from "react";
import Form from "../../../components/common/Form";
import { api } from "../../../services/api";
import { isLogin } from "../../../services/auth";

class Register extends Form {
  state = {
    data: {
      first_name: "",
      last_name: "",
      email: "",
      address: "",
      type: "",
      password: "",
      confrim_password: "",
      contact_no: "",
      registered_date: "",
    },
    errors: {},
    btnDisable: false,
    spinner: false,
    customerTypes: [],
  };

  async componentDidMount() {
    if (isLogin()) {
      this.props.history.push("/dashboard");
    }
    const response = await api.customer.getCustomerTypes();
    if (response.resCode === 200) {
      const types = [];
      response.result.data.multiple.map((each) => {
        types.push(each.type);
      });
      this.state.customerTypes = types;
    } else {
      this.props.history.push("/");
    }
  }

  schema = {
    first_name: Joi.string()
      .min(3)
      .$.regex(/^[A-Za-z]+$/)
      .rule({
        message: "First Name should only contain alphabet characters",
      })
      .required()
      .label("First Name"),
    last_name: Joi.string()
      .min(3)
      .$.regex(/^[A-Za-z]+$/)
      .rule({
        message: "Last Name should only contain alphabet characters",
      })
      .required()
      .label("Last Name"),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),
    address: Joi.string().required().label("Address"),
    type: Joi.string().required().label("Customer Type"),
    password: Joi.string().min(5).required().label("Password"),
    confirm_password: Joi.string()
      .equal(Joi.ref("password"))
      .required()
      .label("Confrim Password"),
    contact_no: Joi.string()
      .$.regex(/^[0-9]+$/)
      .rule({
        message: "Contact Number should only contain numbers",
      })
      .min(9)
      .max(20)
      .required()
      .label("Contact Number"),
    registered_date: Joi.string()
      .$.regex(/^(\d){4}(-(\d){1,2}){2}$/)
      .rule({
        message: "Registered Date should only contain '2000-01-01' pattern",
      })
      .required()
      .label("Registered Date"),
  };

  render() {
    return (
      <div className="c-app c-default-layout flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md="9" lg="7" xl="6">
              <CCard className="mx-4">
                <CCardBody className="p-4">
                  <CForm>
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>
                    {this.renderInputGroup(
                      "first_name",
                      "text",
                      "First Name",
                      "cil-user"
                    )}
                    {this.renderInputGroup(
                      "last_name",
                      "text",
                      "Last Name",
                      "cil-user"
                    )}
                    {this.renderInputGroup(
                      "email",
                      "email",
                      "Email",
                      "cil-envelope-letter"
                    )}
                    {this.renderInputGroup(
                      "address",
                      "text",
                      "Address",
                      "cil-home"
                    )}
                    {this.renderSelectGroup(
                      "type",
                      "Customer Type",
                      "cil-blur",
                      this.state.customerTypes
                    )}
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="password"
                        placeholder="Repeat password"
                        autoComplete="new-password"
                      />
                    </CInputGroup>
                    <CButton color="success" block>
                      Create Account
                    </CButton>
                  </CForm>
                </CCardBody>
                <CCardFooter className="p-4">
                  <CRow>
                    <CCol xs="12" sm="6">
                      <CButton className="btn-facebook mb-1" block>
                        <span>facebook</span>
                      </CButton>
                    </CCol>
                    <CCol xs="12" sm="6">
                      <CButton className="btn-twitter mb-1" block>
                        <span>twitter</span>
                      </CButton>
                    </CCol>
                  </CRow>
                </CCardFooter>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    );
  }
}

export default Register;
