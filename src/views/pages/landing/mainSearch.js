import {
  CCol,
  CRow,
  CSpinner,
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CInput,
  CInputGroup,
  CInputGroupText,
  CInputGroupAppend,
  CInputGroupPrepend,
  CContainer,
  CButton,
  CSelect,
  CImg,
  CPagination,
  CNavbarNav,
  CNavLink,
  CCollapse,
  CNavbarBrand,
  CNavbar,
  CToggler,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { api } from "../../../services/api";

const MainSearch = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <React.Fragment>
      <CNavbar sticky fixed="top" style={{ height: "60px" }} expandable="sm" color="info">
        <CToggler inNavbar onClick={() => setIsOpen(!isOpen)} />
        <CNavbarBrand>Lanka Express</CNavbarBrand>
        <CCollapse show={isOpen} navbar>
          <CNavbarNav className="ml-auto">
            <CNavbarNav>
              <CNavLink className="bg-success text-light" to="/login">
                Login
              </CNavLink>
              <CNavLink className="bg-success text-light" to="/register">
                Sign Up
              </CNavLink>
            </CNavbarNav>
          </CNavbarNav>
        </CCollapse>
      </CNavbar>
      <CContainer className="mt-5">
        <CRow>
          <CInputGroup size="lg" style={{ height: "60px" }}>
            <CInputGroupPrepend>
              <CInputGroupText className={"bg-primary text-white"}>
                Category
              </CInputGroupText>
              <CSelect
                custom
                name="category"
                id="category"
                style={{ height: "60px" }}
              >
                <option value="All">All</option>
                <option value="All">All</option>
                <option value="All">Allsfsfsfsfsfsfsfs</option>
                <option value="All">All</option>
              </CSelect>
            </CInputGroupPrepend>
            <CInput
              type="text"
              id="search"
              name="search"
              placeholder="Search Products Here.."
              style={{ height: "60px" }}
            />
            <CInputGroupAppend>
              <CButton className="bg-dark text-white">
                <CIcon
                  name={"cil-search"}
                  style={{ height: "30px", width: "30px" }}
                />
              </CButton>
            </CInputGroupAppend>
          </CInputGroup>
        </CRow>
        <CRow className="mt-5">
          <CCol sm="4">
            <CCard>
              <CCardHeader
                style={{ fontWeight: "bold", textAlign: "center" }}
                className="bg-info"
              >
                Title - Lorem Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the industry's
                standard dummy text ever since the 1500s, when
              </CCardHeader>
              <CCardBody className="d-flex justify-content-center bg-secondary">
                <CImg variant="full" src="/sample/product.jpeg" fluid />
              </CCardBody>
              <CCardFooter>
                <CRow>
                  <p style={{ fontWeight: "bold" }}>Order Description</p>
                  <p style={{ textAlign: "justify" }}>
                    {" "}
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum
                  </p>
                </CRow>
                <CRow>
                  <CCol xs="12" md="6">
                    <p style={{ fontWeight: "bold", textAlign: "center" }}>
                      Discount : 10%
                    </p>
                  </CCol>
                  <CCol xs="12" md="6">
                    <p style={{ fontWeight: "bold", textAlign: "center" }}>
                      Price : Rs. 10000
                    </p>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xs="12" md="6">
                    <CButton
                      className="mt-2"
                      size="lg"
                      style={{ width: "100%" }}
                      color="success"
                    >
                      Buy
                    </CButton>
                  </CCol>
                  <CCol xs="12" md="6">
                    <CButton
                      className="mt-2"
                      size="lg"
                      style={{ width: "100%" }}
                      color="warning"
                    >
                      Add to Cart
                    </CButton>
                  </CCol>
                </CRow>
              </CCardFooter>
            </CCard>
          </CCol>
          <CCol sm="4">
            <CCard>
              <CCardHeader
                style={{ fontWeight: "bold", textAlign: "center" }}
                className="bg-info"
              >
                Title - Lorem Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the industry's
                standard dummy text ever since the 1500s, when
              </CCardHeader>
              <CCardBody className="d-flex justify-content-center bg-secondary">
                <CImg variant="full" src="/sample/product.jpeg" fluid />
              </CCardBody>
              <CCardFooter>
                <CRow>
                  <p style={{ fontWeight: "bold" }}>Order Description</p>
                  <p style={{ textAlign: "justify" }}>
                    {" "}
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum
                  </p>
                </CRow>
                <CRow>
                  <CCol xs="12" md="6">
                    <p style={{ fontWeight: "bold", textAlign: "center" }}>
                      Discount : 10%
                    </p>
                  </CCol>
                  <CCol xs="12" md="6">
                    <p style={{ fontWeight: "bold", textAlign: "center" }}>
                      Price : Rs. 10000
                    </p>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xs="12" md="6">
                    <CButton
                      className="mt-2"
                      size="lg"
                      style={{ width: "100%" }}
                      color="success"
                    >
                      Buy
                    </CButton>
                  </CCol>
                  <CCol xs="12" md="6">
                    <CButton
                      className="mt-2"
                      size="lg"
                      style={{ width: "100%" }}
                      color="warning"
                    >
                      Add to Cart
                    </CButton>
                  </CCol>
                </CRow>
              </CCardFooter>
            </CCard>
          </CCol>
          <CCol sm="4">
            <CCard>
              <CCardHeader
                style={{ fontWeight: "bold", textAlign: "center" }}
                className="bg-info"
              >
                Title - Lorem Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the industry's
                standard dummy text ever since the 1500s, when
              </CCardHeader>
              <CCardBody className="d-flex justify-content-center bg-secondary">
                <CImg variant="full" src="/sample/product.jpeg" fluid />
              </CCardBody>
              <CCardFooter>
                <CRow>
                  <p style={{ fontWeight: "bold" }}>Order Description</p>
                  <p style={{ textAlign: "justify" }}>
                    {" "}
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum
                  </p>
                </CRow>
                <CRow>
                  <CCol xs="12" md="6">
                    <p style={{ fontWeight: "bold", textAlign: "center" }}>
                      Discount : 10%
                    </p>
                  </CCol>
                  <CCol xs="12" md="6">
                    <p style={{ fontWeight: "bold", textAlign: "center" }}>
                      Price : Rs. 10000
                    </p>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xs="12" md="6">
                    <CButton
                      className="mt-2"
                      size="lg"
                      style={{ width: "100%" }}
                      color="success"
                    >
                      Buy
                    </CButton>
                  </CCol>
                  <CCol xs="12" md="6">
                    <CButton
                      className="mt-2"
                      size="lg"
                      style={{ width: "100%" }}
                      color="warning"
                    >
                      Add to Cart
                    </CButton>
                  </CCol>
                </CRow>
              </CCardFooter>
            </CCard>
          </CCol>
          <CCol sm="4">
            <CCard>
              <CCardHeader
                style={{ fontWeight: "bold", textAlign: "center" }}
                className="bg-info"
              >
                Title - Lorem Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the industry's
                standard dummy text ever since the 1500s, when
              </CCardHeader>
              <CCardBody className="d-flex justify-content-center bg-secondary">
                <CImg variant="full" src="/sample/product.jpeg" fluid />
              </CCardBody>
              <CCardFooter>
                <CRow>
                  <p style={{ fontWeight: "bold" }}>Order Description</p>
                  <p style={{ textAlign: "justify" }}>
                    {" "}
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum
                  </p>
                </CRow>
                <CRow>
                  <CCol xs="12" md="6">
                    <p style={{ fontWeight: "bold", textAlign: "center" }}>
                      Discount : 10%
                    </p>
                  </CCol>
                  <CCol xs="12" md="6">
                    <p style={{ fontWeight: "bold", textAlign: "center" }}>
                      Price : Rs. 10000
                    </p>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xs="12" md="6">
                    <CButton
                      className="mt-2"
                      size="lg"
                      style={{ width: "100%" }}
                      color="success"
                    >
                      Buy
                    </CButton>
                  </CCol>
                  <CCol xs="12" md="6">
                    <CButton
                      className="mt-2"
                      size="lg"
                      style={{ width: "100%" }}
                      color="warning"
                    >
                      Add to Cart
                    </CButton>
                  </CCol>
                </CRow>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          <CPagination
            activePage={3}
            pages={10}
            onActivePageChange={(i) => console.log(i)}
          ></CPagination>
        </CRow>
      </CContainer>
    </React.Fragment>
  );
};

export default MainSearch;
