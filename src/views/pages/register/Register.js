import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CContainer,
  CForm,
  CRow,
} from "@coreui/react";
import Joi from "joi";
import _ from "lodash";
import React from "react";
import { toast } from "react-toastify";
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
      confirm_password: "",
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
      const customerTypes = types;
      this.setState({ customerTypes });
    } else {
      this.props.history.push("/");
    }
    const data = { ...this.state.data };
    data.registered_date = this.getCurrentDate();
    this.setState({ data });
  }

  componentWillUnmount() {
    toast.dismiss();
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
      .custom(this.comparePassword(this.getState()))
      .required()
      .label("Confrim Password")
      .messages({
        "any.invalid": "Repeat password does not match with the above password",
      }),
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

  comparePassword() {
    return (value, helper) => {
      if (value !== this.state.data.password) {
        return helper.error("any.invalid");
      }
      return value;
    };
  }

  getState() {
    return this.state;
  }

  render() {
    return (
      <div className="c-app c-default-layout flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md="9" lg="7" xl="6">
              <CCard className="mx-4">
                <CCardBody className="p-4">
                  <CForm onSubmit={this.handleSubmit}>
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
                    {this.renderInputGroup(
                      "contact_no",
                      "number",
                      "Contact Number",
                      "cil-mobile"
                    )}
                    {this.renderInputGroup(
                      "password",
                      "password",
                      "Password",
                      "cil-lock-locked"
                    )}
                    {this.renderInputGroup(
                      "confirm_password",
                      "password",
                      "Repeat Password",
                      "cil-lock-locked"
                    )}
                    {this.renderButton("Create Account", "success", "danger")}
                  </CForm>
                </CCardBody>
                <CCardFooter className="p-4">
                  <CRow>
                    <CButton to="/" color="info" className="mb-1" block>
                      <span>Home</span>
                    </CButton>
                  </CRow>
                </CCardFooter>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    );
  }

  callServer = async () => {
    this.setState({ spinner: true });
    const response = await api.auth.register(this.state.data);
    if (response.resCode === 200) {
      const response2 = await api.auth.login(
        _.pick(this.state.data, ["email", "password"])
      );
      this.setState({ spinner: false });
      if (response2.resCode === 200) {
        localStorage.setItem(
          "scms-auth-token",
          response2.result.data.multiple.accessToken
        );
        localStorage.setItem(
          "scms-refresh-token",
          response2.result.data.multiple.refreshToken
        );
        this.props.history.push("/dashboard");
      } else {
        this.props.history.push("/login");
      }
    } else {
      if (response.result.error.multiple) {
        this.setState({ errors: response.result.error.multiple });
      }
      if (response.result.error.single) {
        toast.error(response.result.error.single);
      }
      this.setState({ spinner: false });
    }
  };

  getCurrentDate = () => {
    const now = new Date();
    const date = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();
    return `${year}-${month + 1}-${date}`;
  };
}

export default Register;
