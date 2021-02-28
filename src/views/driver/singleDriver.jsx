// import React, { Component } from "react";
// import { api } from "../../services/api";
// import { toast } from "react-toastify";
// class singleDriver extends Component {
//   state = {
//     driverDetails: [],
//   };

//   async componentDidMount() {
//     const response = await api.driver.driverDetails();

//     if (response.resCode === 200) {
//       const data = response.result.data.multiple;
//       console.log(data);
//       this.setState({ driverDetails: data });
//     } else {
//       if (response.result.error.single)
//         toast.error(response.result.error.single);
//     }
//   }

//   render() {
//       return <div></div>;
//   }
// }

// export default singleDriver;
