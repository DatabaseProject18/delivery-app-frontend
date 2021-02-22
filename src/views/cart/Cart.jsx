import React, { Component, Fragment } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CAlert,
  CRow,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import { toast } from "react-toastify";
import { api } from "../../services/api";
import { isLogin } from "../../services/auth";

class Cart extends Component {
  state = {
    cart: [],
    modalState: false,
    deleteItemIndex: null,
  };

  async componentDidMount() {
    const response = await api.customer.getCart({
      customer_id: isLogin().customer_id,
    });
    console.log(response);
    if (response.resCode === 200) {
      let data = response.result.data.multiple;
      data.map((e) => {
        if (e.quantity > e.stock) e.quantity = e.stock;
      });
      this.setState({ cart: data });
      //console.log(data);
    } else {
      if (response.result.error.single)
        toast.error(response.result.error.single);
    }
  }

  componentWillUnmount() {
    toast.dismiss();
  }

  getTotalCost = () => {
    let totalCost = 0;
    this.state.cart.map((e) => {
      totalCost += (e.unit_price * e.quantity * (100 - e.discount)) / 100;
    });
    return totalCost;
  };

  handleQuntity = async (e, oparation) => {
    if (e.quantity > 0 && e.quantity <= e.stock) {
      const temp = [...this.state.cart];
      const backup = JSON.parse(JSON.stringify(temp));
      const index = temp.indexOf(e);
      if (oparation === "+" && e.quantity < e.stock) {
        temp[index].quantity += 1;
      } else if (oparation === "-" && e.quantity > 1) {
        temp[index].quantity -= 1;
      }
      this.setState({ cart: temp });
      const data = {
        customer_id: isLogin().customer_id,
        quantity: temp[index].quantity,
        cart_id: temp[index].cart_id,
      };
      const response = await api.customer.setCartQuntity(data);
      console.log(temp);
      console.log(backup);
      if (response.resCode !== 200) {
        this.setState({ cart: backup });
        if (response.result.error.single)
          toast.error(response.result.error.single);
      }
    }
  };

  onClickDeleteProduct = (index) => {
    this.setState({ modalState: true });
    this.setState({ deleteItemIndex: index });
  };
  modalClose = () => {
    this.setState({ modalState: false });
  };
  handleDeleteProduct = async () => {
    const index = this.state.deleteItemIndex;
    const data = {
      cart_id: this.state.cart[index].cart_id,
    };
    const temp = [...this.state.cart];
    const backup = JSON.parse(JSON.stringify(temp));
    if (index > -1) {
      temp.splice(index, 1);
    }
    this.setState({ cart: temp });
    this.setState({ modalState: false });
    const response = await api.customer.productDeleteFromCart(data);
    if (response.resCode !== 200) {
      this.setState({ cart: backup });
      if (response.result.error.single)
        toast.error(response.result.error.single);
    }
  };

  render() {
    const { cart, modalState } = this.state;
    return (
      <Fragment>
        <CRow>
          <CCol>
            <CCard>
              <CCardHeader>
                <h4>Cart</h4>
              </CCardHeader>
              {cart.length > 0 ? (
                <CCardBody>
                  {cart.map((e) => (
                    <CCard key={e.cart_id} accentColor="info">
                      <CCardHeader>
                        <h5>{`${cart.indexOf(e) + 1}. ${e.product_name}`} </h5>
                        <div>Stock in Store : {e.stock}</div>
                      </CCardHeader>
                      <CCardBody>
                        <div style={{ display: "flex" }}>
                          <div> Quantity : x{e.quantity}</div>
                          <div>
                            <CButton
                              disabled={e.quantity < 2}
                              onClick={() => this.handleQuntity(e, "-")}
                              size="sm"
                              style={{ marginLeft: "1rem" }}
                              color="dark"
                            >
                              -
                            </CButton>
                            <CButton
                              disabled={e.stock <= e.quantity}
                              onClick={() => this.handleQuntity(e, "+")}
                              size="sm"
                              style={{ marginLeft: "1rem" }}
                              color="info"
                            >
                              +
                            </CButton>
                          </div>
                        </div>
                        <div>{`Subtotal (Rs) : ${numberWithCommas(
                          e.unit_price
                        )} x ${numberWithCommas(
                          e.quantity
                        )} = ${numberWithCommas(
                          e.unit_price * e.quantity
                        )}`}</div>
                        <div>Discount : {e.discount}%</div>
                        <div>
                          Cost (Rs) :{" "}
                          {numberWithCommas(
                            (e.unit_price * e.quantity * (100 - e.discount)) /
                              100
                          )}
                        </div>
                        <CButton
                          style={{ marginTop: "1rem" }}
                          size="sm"
                          color="danger"
                          onClick={() =>
                            this.onClickDeleteProduct(cart.indexOf(e))
                          }
                        >
                          Delete
                        </CButton>
                      </CCardBody>
                    </CCard>
                  ))}
                  <h5>
                    Total Cost (Rs) :{" "}
                    {numberWithCommas(this.getTotalCost(cart).toFixed(2))}
                  </h5>
                  <CButton style={{ marginTop: "1rem" }} color="success">
                    Place Order
                  </CButton>
                </CCardBody>
              ) : (
                <CAlert style={{ margin: "1rem" }} color="danger">
                  Your cart empty...
                </CAlert>
              )}
            </CCard>
          </CCol>
        </CRow>
        <CModal
          centered
          show={modalState}
          onClose={this.modalClose}
          color="danger"
        >
          <CModalHeader closeButton>
            <CModalTitle>Delete Product</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Are you sure you want to delete this product in your cart?
          </CModalBody>
          <CModalFooter>
            <CButton color="danger" onClick={() => this.handleDeleteProduct()}>
              Yes
            </CButton>{" "}
            <CButton color="secondary" onClick={this.modalClose}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
      </Fragment>
    );
  }
}

export default Cart;

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
