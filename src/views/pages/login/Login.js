import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CRow,
} from "@coreui/react";
import Joi from "joi";
import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Form from "../../../components/common/Form";
import { api } from "../../../services/api";
import { isLogin } from "../../../services/auth";

class Login extends Form {
  state = {
    data: {
      email: "",
      password: "",
    },
    errors: {},
    btnDisable: false,
    spinner: false,
  };

  componentDidMount() {
    if (isLogin()) {
      this.props.history.push("/dashboard");
    }
  }

  schema = {
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),
    password: Joi.string().required().label("Password"),
  };

  componentWillUnmount() {
    toast.dismiss();
  }

  render() {
    return (
      <div className="c-app c-default-layout flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md="8">
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm onSubmit={this.handleSubmit}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      {this.renderInputGroup(
                        "email",
                        "email",
                        "Enter Your Email",
                        "cil-user"
                      )}
                      {this.renderInputGroup(
                        "password",
                        "password",
                        "Enter Your Password",
                        "cil-lock-locked"
                      )}
                      <CRow>
                        <CCol xs="6">
                          {this.renderButton(
                            "Login",
                            "primary",
                            this.state.spinner,
                            "danger",
                            {
                              className: "px-4",
                            }
                          )}
                        </CCol>
                        <CCol xs="6" className="text-right">
                          <CButton color="link" className="px-0">
                            Forgot password?
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
                <CCard
                  className="text-white bg-primary py-5 d-md-down-none"
                  style={{ width: "44%" }}
                >
                  <CCardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>You are new to the site? Create an account here.</p>
                      <Link to="/register">
                        <CButton
                          color="primary"
                          className="mt-3"
                          active
                          tabIndex={-1}
                        >
                          Register Now!
                        </CButton>
                      </Link>
                    </div>
                  </CCardBody>
                </CCard>
              </CCardGroup>
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
      localStorage.setItem(
        "scms-auth-token",
        response.result.data.multiple.accessToken
      );
      localStorage.setItem(
        "scms-refresh-token",
        response.result.data.multiple.refreshToken
      );
      const { state } = this.props.location;
      if (state) {
        this.props.history.push(state.from);
      } else {
        this.props.history.push("/dashboard");
      }
    } else {
      if (response.result.error.multiple) {
        this.setState({ errors: response.result.error.multiple });
      }
      if (response.result.error.single) {
        toast.error(response.result.error.single);
      }
    }
    this.setState({ spinner: false });
  };
}

export default Login;
