import React, { Component } from "react";
import calculateTotalBasket from "./../../middleware/calculateTotalBasket";
import { Link } from "react-router-dom";
import BasketLogo from "./../../public/images/logos/shopping cart brown.png";
import trashLogo from "./../../public/icons/trash.png";
import "./Basket.css";

export default class Basket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrayOfProducts: this.props.productsInBasket,
    };
    this.calculateTotalProduct = this.calculateTotalProduct.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  calculateTotalProduct(product) {
    const total = (product.price * product.order_quantity) / 100;
    return total.toFixed(2);
  }

  handleInputChange(event) {
    event.preventDefault();
    const order_quantity = parseInt(event.target.value);
    const product_id = event.target.id;
    const products_array = this.state.arrayOfProducts;
    for (let i = 0; i < products_array.length; i++) {
      if (products_array[i]._id === product_id) {
        products_array[i].order_quantity = order_quantity;
        this.setState({
          arrayOfProducts: products_array,
        });
        this.props.updateProductsInBasket(products_array);
      }
    }
  }

  handleDeleteButton(productId) {
    this.props.eliminateProductFromBasket(productId);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const totalInBasket = calculateTotalBasket().toFixed(2);
    this.props.updateTotalInBasket(totalInBasket);
  }

  componentDidUpdate() {
    const totalInBasket = calculateTotalBasket().toFixed(2);
    if (totalInBasket !== this.props.totalPriceInBasket) {
      return this.props.updateTotalInBasket(totalInBasket);
    }
  }

  render() {
    let productsInBasket = this.state.arrayOfProducts;
    function areThereProductsInBasket() {
      if (productsInBasket.length > 0) {
        return true;
      } else {
        return false;
      }
    }
    return (
      <div className="main-container text-center d-flex flex-column justify-content-center align-items-center basket-container">
        <h2 className="color-bege mb-2">Carrinho de Compras</h2>
        {areThereProductsInBasket() && (
          <div className="w-100">
            <div className="product-list">
              {productsInBasket.map((product) => (
                <div key={product._id} className="product-in-basket">
                  <div>
                    <img
                      src={product.image}
                      alt={product.model}
                      className="basket-image"
                    />
                  </div>
                  <div className="align-middle text-center p-1">
                    <Link to={`/store/${product._id}`}>{product.model}</Link>
                  </div>
                  <div className="align-middle text-center p-1">
                    {product.price / 100} €/unidade
                  </div>
                  <div className="align-middle text-center p-1">
                    <input
                      type="number"
                      min="1"
                      className="form-control quantity-input text-center"
                      max={product.available_quantity}
                      value={product.order_quantity}
                      id={product._id}
                      onChange={this.handleInputChange}
                    />{" "}
                    unidade/s
                  </div>
                  <div className="price align-middle text-center p-1">
                    {this.calculateTotalProduct(product)} €/total
                  </div>
                  <div>
                    <form>
                      <button
                        onClick={this.handleDeleteButton.bind(
                          this,
                          product._id
                        )}
                        className="btn"
                      >
                        <img
                          src={trashLogo}
                          alt="Remove this item"
                          width="15px"
                        />
                      </button>
                    </form>
                  </div>
                </div>
              ))}

              <div>
                <div>
                  <h2>
                  <b>Total: </b> {this.props.totalPriceInBasket} €
                  </h2>
              </div>
              </div>
            </div>
            <Link to={"/basket-confirmation"} className="standard-button m-0">
              Proceder para pagamento
            </Link>
          </div>
        )}
        {!productsInBasket.length ? (
          <div className="d-flex flex-column align-items-around my-5">
            <h2>Ups! </h2>
            <p>
              O seu carrinho está vazio. <br />
            </p>
            <img
              src={BasketLogo}
              alt="shopping-cart"
              className="shopping-cart img-fluid m-5"
            />
            <Link to="/store" className="standard-button m-5">
              Espreite a nossa loja.
            </Link>
          </div>
        ) : (
          <Link to="Store" className="m-5">
            Voltar à loja
          </Link>
        )}
      </div>
    );
  }
}
