import React, { Component } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
//VIEWS AND COMPONENTS
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Index from "./views/Index";
import Private from "./views/Private";
//import SignIn from "./views/authentication/SignIn";
import TermsAndConditions from "./views/authentication/TermsAndConditions";
import Reset from "./views/authentication/Reset";
import CreateProduct from "./views/product-management/CreateProduct";
import DisplayProducts from "./views/product-management/DisplayProducts";
import IndividualProduct from "./views/product-management/IndividualProduct";
import Basket from "./views/orders/Basket";
import BasketConfirmation from "./views/orders/BasketConfirmation";
import ProductManagement from "./views/product-management/ProductManagement";
import PaymentMethod from "./views/orders/PaymentMethod";
import OrderConfirmation from "./views/orders/OrderConfirmation";
import MyOrders from "./views/orders/MyOrders";
import OrdersOverview from "./views/orders-management/OrdersOverview";
import SingleOrderOverview from "./views/orders-management/SingleOrderOverview";
import EmployeesList from "./views/users-management-for-admin/EmployeesList";
//ROUTE GUARDS
import RouteForAdmin from "./services/RouteForAdmin";
import RouteForAdminAndEmployee from "./services/RouteForAdminAndEmployee";
import RouteForAllLoggedIn from "./services/RouteForAllLoggedIn";
//SERVICES/CONNECTION TO BACKEND
import { loadUserInformation as loadUserInformationService } from "./services/authentication";

class App extends Component {
  sessionCheck = "";

  constructor() {
    super();
    this.state = {
      user: null,
      loaded: false,
      arrayOfProducts: [],
      totalPriceInBasket: 0,
    };
    this.loadUserInformation = this.loadUserInformation.bind(this);
    this.addProductToBasket = this.addProductToBasket.bind(this);
    this.updateTotalInBasket = this.updateTotalInBasket.bind(this);
    this.updateProductsInBasket = this.updateProductsInBasket.bind(this);
    this.eliminateProductFromBasket = this.eliminateProductFromBasket.bind(
      this
    );
    this.verifyAuthentication = this.verifyAuthentication.bind(this);
  }

  async componentDidMount() {
    this.loadUserInformation();
    //if there is a user, his session will be checked every 2 minutes, this way we can update the user in the state when the session is expired.
    this.sessionCheck = setInterval(this.loadUserInformation(), 120000);
  }

  //GET USER INFO IN THE STATE
  async loadUserInformation() {
    //   let sessionCheck;
    try {
      const user = await loadUserInformationService();
      this.setState({
        user,
        loaded: true,
      });
      return user;
    } catch (error) {
      this.setState({
        user: null,
        loaded: true,
      });
      //No user, so no need for an interval to check if user has a session.
      clearInterval(this.sessionCheck);
      console.log("couldnt load user information in App.jsx due to", error);
    }
  }

  //VERIFY IF WE HAVE A USER IN STATE
  verifyAuthentication() {
    console.log(this.state.user);
    return this.state.user;
  }

  //FUNCTIONS FOR UPDATING THE BASKET ITEMS IN THE STATE
  addProductToBasket(product) {
    let array = this.state.arrayOfProducts;
    let productExists = false;

    for (let i = 0; i < array.length; i++) {
      if (
        product._id === array[i]._id &&
        array[i].order_quantity + 1 <= array[i].available_quantity
      ) {
        productExists = true;
        array[i].order_quantity += 1;
      } else if (product._id === array[i]._id) {
        productExists = true;
        alert(
          "A quantidade seleccionada é superior à quantidade do artigo que temos em stock."
        );
      }
    }
    if (!productExists) {
      array.push(product);
    }

    this.setState({
      arrayOfProducts: array,
    });
  }

  updateTotalInBasket(value) {
    const updatedValue = value;
    this.setState({
      totalPriceInBasket: updatedValue,
    });
  }

  updateProductsInBasket(array) {
    this.setState({
      arrayOfProducts: array,
    });
  }

  eliminateProductFromBasket(productId) {
    let array = this.state.arrayOfProducts;
    for (let i = 0; i < array.length; i++) {
      if (productId === array[i]._id) {
        array.splice(i, 1);
      }
      this.setState({
        arrayOfProducts: array,
      });
    }
  }

  render() {
    const loaded = this.state.loaded;
    return (
      <div className="app">
        <BrowserRouter>
          <NavBar
            user={this.state.user}
            loadUserInformation={this.loadUserInformation}
          />
          <div className="appBody">
            {loaded && <Switch>
              <RouteForAllLoggedIn
                exact
                redirect="/"
                verify={this.verifyAuthentication}
                path="/private"
                render={(props) => (
                  <Private
                    {...props}
                    user={this.state.user}
                    loadUserInformation={this.loadUserInformation}
                  />
                )}
              />
              <RouteForAllLoggedIn
                exact
                redirect="/"
                verify={this.verifyAuthentication}
                path="/my-orders"
                render={(props) => (
                  <MyOrders {...props} user={this.state.user} />
                )}
              />
              <RouteForAllLoggedIn
                exact
                redirect="/"
                verify={this.verifyAuthentication}
                path="/payment-method"
                render={(props) => (
                  <PaymentMethod
                    {...props}
                    user={this.state.user}
                    productsInBasket={this.state.arrayOfProducts}
                    totalPriceInBasket={this.state.totalPriceInBasket}
                  />
                )}
              />
              <RouteForAllLoggedIn
                exact
                redirect="/"
                verify={this.verifyAuthentication}
                path="/order-confirmed/:order_id"
                render={(props) => (
                  <OrderConfirmation {...props} user={this.state.user} />
                )}
              />
              <RouteForAllLoggedIn
                exact
                redirect="/"
                verify={this.verifyAuthentication}
                path="/orders-overview/:order_id"
                render={(props) => (
                  <SingleOrderOverview {...props} user={this.state.user} />
                )}
              />
              <RouteForAdminAndEmployee
                redirect="/"
                verify={this.verifyAuthentication}
                path="/orders-overview"
                render={(props) => (
                  <OrdersOverview {...props} user={this.state.user} />
                )}
              />
              <RouteForAdminAndEmployee
                path="/create"
                exact
                component={CreateProduct}
                redirect="/"
                verify={this.verifyAuthentication}
              />
              <RouteForAdmin
                path="/user-management"
                exact
                component={EmployeesList}
                verify={this.verifyAuthentication}
                redirect="/"
              />
              <RouteForAdminAndEmployee
                redirect="/"
                verify={this.verifyAuthentication}
                path="/store/management"
                exact
                component={ProductManagement}
              />
              <Route
                path="/store/:id"
                exact
                render={(props) => (
                  <IndividualProduct
                    {...props}
                    user={this.state.user}
                    addProductToBasket={this.addProductToBasket}
                  />
                )}
              />
              <Route path="/store" exact component={DisplayProducts} />
              <Route
                path="/terms-and-conditions"
                exact
                component={TermsAndConditions}
              />
              <Route
                path="/basket-confirmation"
                exact
                render={(props) => (
                  <BasketConfirmation
                    {...props}
                    user={this.state.user}
                    productsInBasket={this.state.arrayOfProducts}
                    totalPriceInBasket={this.state.totalPriceInBasket}
                    loadUserInformation={this.loadUserInformation}
                  />
                )}
              />
              <Route
                path="/basket"
                exact
                render={(props) => (
                  <Basket
                    {...props}
                    productsInBasket={this.state.arrayOfProducts}
                    updateTotalInBasket={this.updateTotalInBasket}
                    totalPriceInBasket={this.state.totalPriceInBasket}
                    updateProductsInBasket={this.updateProductsInBasket}
                    eliminateProductFromBasket={this.eliminateProductFromBasket}
                  />
                )}
              />
              <Route
                path="/reset/:token"
                render={(props) => (
                  <Reset
                    {...props}
                    loadUserInformation={this.loadUserInformation}
                  />
                )}
              />
              <Route path="/" component={Index} />
              {/* CONVERTED THIS TWO ROUTES INTO A MODAL
              <Route
                path="/sign-in"
                exact
                render={(props) => (
                  <SignIn
                    {...props}
                    loadUserInformation={this.loadUserInformation}
                  />
                )}
              /> 
                          <Route
                path="/sign-up"
                exact
                render={(props) => (
                  <SignUp
                    {...props}
                    loadUserInformation={this.loadUserInformation}
                  />
                )}
              />
              */}
            </Switch>}
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
