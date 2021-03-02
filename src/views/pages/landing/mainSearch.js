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

const MainSearch = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [category, setCategory] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [numOfItemsPerPage, setNumOfItemsPerPage] = useState(1);
  const [resultCount, setResultCount] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [inputCategory, setInputCategory] = useState("");

  useEffect(async () => {
    setLoading(true);
    let res = await api.product.getCategories();
    if (res.resCode === 200) {
      setCategories(res.result.data.multiple);
    } else {
      toast.error(res.result.error.single);
    }

    if (searchQuery !== "") {
      res = await api.product.getSearchResult(offset, searchQuery, category);
      if (res.resCode === 200) {
        setSearchResult(res.result.data.multiple);
        setResultCount(res.result.data.single[0]);
        setNumOfItemsPerPage(res.result.data.single[1]);
      } else {
        setSearchResult([]);
        setResultCount(0);
        if (res.result.error.multiple && res.result.error.multiple.query) {
          Object.values(res.result.error.multiple.query).map((str) =>
            toast.error(str)
          );
        } else {
          toast.error(res.result.error.single);
        }
      }
    }
    setLoading(false);
  }, [searchQuery, offset, category]);

  useEffect(() => {
    return () => toast.dismiss();
  }, []);

  const handleClick = async (productId, buttonName) => {
    setLoading(true);
    const res = await api.cart.newProduct(productId);
    if (res.resCode === 200) {
      toast.success("Product is sccessfully added to the cart");
      if (buttonName === "buy") {
        props.history.push("/my/cart");
      }
    } else {
      if (res.result.error.multiple && res.result.error.multiple.query) {
        Object.values(res.result.error.multiple.query).map((str) =>
          toast.error(str)
        );
      } else {
        toast.error(res.result.error.single);
      }
    }
    setLoading(false);
  };

  return (
    <React.Fragment>
      <CNavbar
        sticky
        fixed="top"
        style={{ height: "60px" }}
        expandable="sm"
        color="info"
        hidden={!props.showNav}
      >
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
      <CRow hidden={!loading}>
        <CCol className="d-flex justify-content-center" style={{ top: "35vh" }}>
          <CSpinner color="danger" style={{ width: "3rem", height: "3rem" }} />
        </CCol>
      </CRow>
      <CContainer className="mt-5" hidden={loading}>
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
                onChange={({ currentTarget: input }) =>
                  setInputCategory(input.value)
                }
                value={inputCategory}
                style={{ height: "60px" }}
              >
                <option value="">All</option>
                {categories.map((item) => (
                  <option key={item.category_id} value={item.category_id}>
                    {item.category_name}
                  </option>
                ))}
              </CSelect>
            </CInputGroupPrepend>
            <CInput
              type="text"
              id="search"
              name="search"
              onChange={({ currentTarget: input }) =>
                setSearchInput(input.value)
              }
              value={searchInput}
              placeholder="Search Products Here.."
              style={{ height: "60px" }}
            />
            <CInputGroupAppend>
              <CButton
                className="bg-dark text-white"
                onClick={() => {
                  setSearchQuery(searchInput);
                  setCategory(inputCategory);
                }}
              >
                <CIcon
                  name={"cil-search"}
                  style={{ height: "30px", width: "30px" }}
                />
              </CButton>
            </CInputGroupAppend>
          </CInputGroup>
        </CRow>
        <CRow className="mt-5">
          {searchResult.map((item, index) => (
            <CCol key={item.product_id} sm="4">
              <CCard>
                <CCardHeader
                  style={{ fontWeight: "bold", textAlign: "center" }}
                  className="bg-info"
                >
                  {item.product_name}
                </CCardHeader>
                <CCardBody className="d-flex justify-content-center bg-secondary">
                  <CImg variant="full" src="/sample/product.jpeg" fluid />
                </CCardBody>
                <CCardFooter>
                  <CRow>
                    <p style={{ fontWeight: "bold" }}>Order Description</p>
                    <p style={{ textAlign: "justify" }}>
                      {" "}
                      {item.product_description}
                    </p>
                  </CRow>
                  <CRow>
                    <CCol xs="12" md="6">
                      <p style={{ fontWeight: "bold", textAlign: "center" }}>
                        Discount : {item.discount}%
                      </p>
                    </CCol>
                    <CCol xs="12" md="6">
                      <p style={{ fontWeight: "bold", textAlign: "center" }}>
                        Price : Rs. {item.unit_price}
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
                        onClick={() => handleClick(item.product_id, "buy")}
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
                        onClick={() =>
                          handleClick(item.product_id, "addToCart")
                        }
                      >
                        Add to Cart
                      </CButton>
                    </CCol>
                  </CRow>
                </CCardFooter>
              </CCard>
            </CCol>
          ))}
        </CRow>
        <CRow hidden={!(resultCount / numOfItemsPerPage)}>
          {resultCount / numOfItemsPerPage && (
            <CPagination
              activePage={Math.ceil(offset / numOfItemsPerPage) + 1}
              pages={Math.ceil(resultCount / numOfItemsPerPage)}
              onActivePageChange={(i) => setOffset(numOfItemsPerPage * (i - 1))}
            ></CPagination>
          )}
        </CRow>
      </CContainer>
    </React.Fragment>
  );
};

export default MainSearch;
