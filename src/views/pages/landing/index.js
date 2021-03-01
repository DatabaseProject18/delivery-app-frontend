import {
  CCol,
  CRow,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdown,
  CNavbarNav,
  CNavLink,
  CCollapse,
  CNavbarBrand,
  CForm,
  CInput,
  CButton,
  CNavbar,
  CToggler,
  CInputGroup,
  CInputGroupAppend,
  CInputGroupPrepend,
  CInputGroupText,
  CSelect,
  CCarouselItem,
  CCarouselCaption,
  CCarouselControl,
  CCarouselIndicators,
  CCarouselInner,
  CCarousel,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { api } from "../../../services/api";

const Landing = () => {
  const [isOpen, setIsOpen] = useState(false);
  const slides = [
    "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvcHBpbmd8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NHx8c2hvcHBpbmd8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjJ8fHNob3BwaW5nfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  ];

  return (
    <React.Fragment>
      <CNavbar style={{ height: "60px" }} expandable="sm" color="info">
        <CToggler inNavbar onClick={() => setIsOpen(!isOpen)} />
        <CNavbarBrand>Lanka Express</CNavbarBrand>
        <CCollapse show={isOpen} navbar>
          <CNavbarNav className="ml-auto">
            <CButton color="primary" to="/search">
              <CIcon
                name={"cil-search"}
                style={{ height: "30px", width: "30px" }}
              />
            </CButton>
          </CNavbarNav>
          <CNavbarNav className="ml-auto">
            <CNavbarNav>
              <CNavLink className="bg-success text-light" to="/login">Login</CNavLink>
              <CNavLink className="bg-success text-light" to="/register">Sign Up</CNavLink>
            </CNavbarNav>
          </CNavbarNav>
        </CCollapse>
      </CNavbar>
      <CCarousel style={{position:"fixed",width:"100%",height:"100%"}} autoSlide={3000}>
        <CCarouselIndicators />
        <CCarouselInner>
          <CCarouselItem>
            <img className="d-block w-100" src={slides[0]} alt="slide 1" />
            <CCarouselCaption>
              <h3>Slide 1</h3>
              <p>Slide 1</p>
            </CCarouselCaption>
          </CCarouselItem>
          <CCarouselItem>
            <img className="d-block w-100" src={slides[1]} alt="slide 2" />
            <CCarouselCaption>
              <h3>Slide 2</h3>
              <p>Slide 2</p>
            </CCarouselCaption>
          </CCarouselItem>
          <CCarouselItem>
            <img className="d-block w-100" src={slides[2]} alt="slide 3" />
            <CCarouselCaption>
              <h3>Slide 3</h3>
              <p>Slide 3</p>
            </CCarouselCaption>
          </CCarouselItem>
        </CCarouselInner>
        <CCarouselControl direction="prev" />
        <CCarouselControl direction="next" />
      </CCarousel>
    </React.Fragment>
  );
};

export default Landing;
