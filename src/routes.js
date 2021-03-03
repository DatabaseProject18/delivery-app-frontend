import React from "react";

const Dashboard = React.lazy(() =>
    import ("./views/dashboard/Dashboard"));
const Cart = React.lazy(() =>
    import ("./views/cart/Cart"));
const MyOrders = React.lazy(() =>
    import ("./views/orders/Orders"));
const MyOrder = React.lazy(() =>
    import ("./views/orders/Order"));
const MyTrips = React.lazy(() =>
    import ("./views/myTrips/MyTrips"));
const TripsDetails = React.lazy(() =>
    import ("./views/myTrips/TripDetails"));
const DriverDetails = React.lazy(() =>
    import ("./views/driver/driverDetails"));
const SingleDriver = React.lazy(() =>
    import ("./views/driver/singleDriver"));


const NewOrderDetails = React.lazy(() => import("./views/newOrders/newOrders"));
const SingleOrderDetails = React.lazy(() =>
  import("./views/newOrders/newOrderDetails")
);

const YearIncome = React.lazy(() => import("./views/reports/yearIncome"));
const QuarterlyIncome = React.lazy(() =>
  import("./views/reports/quarterlyIncome")
);
const BasicOrderDetailsOfQuarter = React.lazy(() =>
  import("./views/reports/basicOrderDetailsOfQuarter")
);
const MostOrderedProduct = React.lazy(() =>
  import("./views/reports/mostOrderedProduct")
);
const CityRouteIncome = React.lazy(() =>
  import("./views/reports/cityRouteIncome")
);
const DriverWorkingHours = React.lazy(() =>
  import("./views/reports/driverWorkingHours")
);
const DriverAssistantWorkingHours = React.lazy(() =>
  import("./views/reports/driverAssistantWorkingHours")
);
const TruckUsedHours = React.lazy(() =>
  import("./views/reports/truckUsedHours")
);
const CustomerOrders = React.lazy(() =>
  import("./views/reports/customerOrder")
);
const CustomerOrderDetails = React.lazy(() =>
  import("./views/reports/customerOrderDetails")
);


const SheduledTruckTrips = React.lazy(() =>
    import ("./views/truckTrip/SheduledTruckTrips")
);
const CreateTruckTrip = React.lazy(() =>

  import("./views/truckTrip/CreateTruckTrip"));


const DriverAssistantDetails = React.lazy(() =>
    import ("./views/driverAssistant/driverAssistantDetails")
);
const SingleDriverAssistant = React.lazy(() =>
    import ("./views/driverAssistant/singleDriverAssistant")
);
const Users = React.lazy(() =>
    import ("./views/user/users"));
const User = React.lazy(() =>
    import ("./views/user/user"));


const PlaceOrder = React.lazy(() =>
    import ("./views/placeOrder/placeOrder"));

const routes = [

  { path: "/my", exact: true, name: "Home" },
  { path: "/my/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/my/cart", name: "Cart", component: Cart },
  { path: "/my/my-orders/:order_id", name: "Order", component: MyOrder },
  { path: "/my/my-orders", name: "MyOrders", component: MyOrders },
  { path: "/my/my-trips/:trip_id", name: "Details", component: TripsDetails },
  { path: "/my/my-trips", name: "MyTrips", component: MyTrips },
  { path: "/my/drivers/:driver_id", name: "Full Driver Details", component: SingleDriver},
  { path: "/my/drivers", name: "Driver Details", component: DriverDetails },
  { path: "/my/yearly-income", name: "Sales Income", component: YearIncome },
  { path: "/my/quarterly-income/:year", name: "Quarterly Income", component: QuarterlyIncome },
  { path: "/my/quarter-orders-basic/:year/:quarter", name: "Basic Order Details", component: BasicOrderDetailsOfQuarter },
  { path: "/my/most-ordered-product", name: "Sales Of Products", component: MostOrderedProduct },
  { path: "/my/sales-income-city", name: "Sales Income of Each City", component: CityRouteIncome },
  { path: "/my/working-hours/drivers", name: "Drivers Working Hours", component: DriverWorkingHours },
  { path: "/my/working-hours/driver-assistants", name: "Drivers Assistants Working Hours", component: DriverAssistantWorkingHours },
  { path: "/my/working-hours/trucks", name: "Trucks Working Hours", component: TruckUsedHours },
  { path: "/my/customer-order/:customerId", name: "Basic Details", component: CustomerOrderDetails },
  { path: "/my/customer-order", name: "Customer Orders", component: CustomerOrders },
  // { path: "/my/newOrders",name: "NewOrders",component: NewOrderDetails},
  { path: "/my/newOrder/:order_id", name: "NewSingleOrder",component: SingleOrderDetails},
  { path: "/yearly-income", name: "Sales Income", component: YearIncome },
  { path: "/quarterly-income/:year", name: "Quarterly Income", component: QuarterlyIncome },
  { path: "/quarter-orders-basic/:year/:quarter", name: "Basic Order Details", component: BasicOrderDetailsOfQuarter },
  { path: "/most-ordered-product", name: "Sales Of Products", component: MostOrderedProduct },
  { path: "/sales-income-city", name: "Sales Income of Each City", component: CityRouteIncome },
  { path: "/working-hours/drivers", name: "Drivers Working Hours", component: DriverWorkingHours },
  { path: "/working-hours/driver-assistants", name: "Drivers Assistants Working Hours", component: DriverAssistantWorkingHours },
  { path: "/working-hours/trucks", name: "Trucks Working Hours", component: TruckUsedHours },
  { path: "/customer-order/:customerId", name: "Basic Details", component: CustomerOrderDetails },
  { path: "/customer-order", name: "Customer Orders", component: CustomerOrders },

  {
    path: "/my/sheduled-truck-trips",
    name: "Truck Trips",
    component: SheduledTruckTrips,
  },
  {
    path: "/my/create-truck-trips",
    name: "Create TruckTrip",
    component: CreateTruckTrip,
  },

  {
    path: "/my/driverAssistants/:driver_assistant_id",
    name: "Full Driver Assistant Details",
    component: SingleDriverAssistant,
  },
  {
    path: "/my/driverAssistants",
    name: "Driver Assistant Details",
    component: DriverAssistantDetails,
  },
  {
    path: "/my/users/:user_id",
    name: "Full User Details",
    component: User,
  },
  { path: "/my/users", name: "User Details", component: Users },


];

export default routes;
