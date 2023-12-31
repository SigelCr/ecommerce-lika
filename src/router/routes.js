import Cart from "../components/pages/cart/Cart";
import FormCheckoutContainer from "../components/pages/checkout/FormCheckoutContainer";
//import Home from "../components/pages/home/Home";
//import ItemDetail from "../components/pages/itemDetail/ItemDetailContainer";
//import ItemListContainer from "../components/pages/itemlist/ItemListContainer";
import UserOrders from "../components/pages/userOrders/UserOrders";

export const routes = [
  /*   {
    id: "home",
    path: "/",
    Element: Home,
  }, */
  /*   {
    id: "shop",
    path: "/shop",
    Element: ItemListContainer,
  }, */
  /*   {
    id: "detail",
    path: "/itemDetail/:id",
    Element: ItemDetail,
  }, */
  {
    id: "cart",
    path: "/cart",
    Element: Cart,
  },
  {
    id: "checkout",
    path: "/checkout",
    Element: FormCheckoutContainer,
  },
  {
    id: "userOrders",
    path: "/user-orders",
    Element: UserOrders,
  },
];
