// import React, { Component } from "react";
// import {
//   CBadge,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CDataTable,
//   CRow,
//   CButton,
// } from "@coreui/react";
// import moment from "moment";
// import { numberWithCommas, convertNumToTime } from "../../utils/numberConvert";
// class TripDetails extends Component {
//   state = {
//     truckTrip_id: this.props.match.params.trip_id,
//     orderData: [],
//     scheduleData: [],
//     route: "",
//   };

//     componentDidMount() {
//       const response = await api.customer.getPastOrder(this.state.order_id);
//   }

//   render() {
//     return (
//       <CRow>
//         <CCol>
//           <CCard>
//             <CCardHeader>
//               <h4>{`Schedule ID : ${truckTrip_id}`}</h4>
//               <CRow>
//                 <CCol>
//                   <hr />
//                   <h6>
//                     <div>{`Start Time : ${moment(
//                       new Date(scheduleData.date_time)
//                     ).calendar()}`}</div>
//                     <div>{`Truck No : ${scheduleData.truck_number}`}</div>
//                     <div>{`Driver : ${scheduleData.driver_name}`}</div>
//                     <div>{`Route : ${route}`}</div>
//                     <div>{`Distance : ${scheduleData.distance} Km`}</div>
//                     <div>{`Average time : ${convertNumToTime(
//                       scheduleData.average_time
//                     )}`}</div>
//                     <div>{`Orders : ${getDeliveredOrderCount()}/${
//                       orderData.length
//                     }`}</div>
//                   </h6>
//                 </CCol>
//               </CRow>
//             </CCardHeader>
//             <CCardBody>
//               {orderData.map((e) => (
//                 <CCard key={e.order_id} accentColor="info">
//                   <CCardHeader>
//                     <h6>{`Order ID : ${e.order_id}`} </h6>
//                   </CCardHeader>
//                   <CCardBody>
//                     <div>{`Customer Name : ${e.customer_name}`}</div>
//                     <div>{`Address : ${e.address}`}</div>
//                     <div>{`Tel : ${e.contact_no}`}</div>
//                     <div>{`Delivery place : ${e.town}`}</div>
//                     <div>
//                       {`Order State : `}
//                       <CBadge
//                         color={
//                           e.order_status === "Delivered" ? "success" : "primary"
//                         }
//                       >
//                         {e.order_status}
//                       </CBadge>
//                     </div>
//                     <CButton
//                       hidden={e.order_status == "Delivered" ? true : false}
//                       onClick={() => handleConfirm(e.order_id)}
//                       style={{ marginTop: "1rem" }}
//                       size="sm"
//                       color="info"
//                     >
//                       Confirm
//                     </CButton>
//                   </CCardBody>
//                 </CCard>
//               ))}
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>
//     );
//   }
// }

// export default TripDetails;
