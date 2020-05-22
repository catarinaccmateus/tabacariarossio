import React, { Component } from "react";
import { getAllProducts as getAllProductsService } from "./../../services/product-management";
import { Link } from "react-router-dom";
import "./DisplayProducts.css";
import { squarePicture } from "./../../services/resizePicturesCloudinary";

export default class DisplayProducts extends Component {
  _isMounted = false;

  constructor() {
    super();
    this.state = {
      products: [],
      filteredProducts: [],
      type: "",
      search: "",
      price_order: "",
      limitTo: 6,
    };
    this.handleChange = this.handleChange.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    this._isMounted = true;
    const products = await getAllProductsService();
    if (this._isMounted) {
      this.setState({
        products: products,
        filteredProducts: products,
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleChange(event) {
    const nameOfState = event.target.name;
    let valueOfInput = event.target.value;
    const products = this.state.products;
    let filteredProducts = this.state.filteredProducts;
    if (nameOfState === "type") {
      if (valueOfInput !== "all") {
        filteredProducts = products.filter((currentValue) => {
          return currentValue.type === valueOfInput;
        });
      } else {
        filteredProducts = products;
      }
    } else if (nameOfState === "search") {
      filteredProducts = products.filter((currentValue) => {
        return (
          currentValue.model.includes(valueOfInput) ||
          currentValue.brand.includes(valueOfInput) ||
          currentValue.description.includes(valueOfInput)
        );
      });
    } else if (nameOfState === "price_order") {
      if (valueOfInput === "asc") {
        filteredProducts.sort((a, b) => {
          return a.price - b.price;
        });
      } else if (valueOfInput === "desc") {
        filteredProducts.sort((a, b) => {
          return b.price - a.price;
        });
      }
    }
    this.setState({
      [nameOfState]: valueOfInput,
      filteredProducts,
    });
  }

  loadMore() {
    this.setState({
      limitTo: this.state.limitTo + 3,
    });
  }

  render() {
    const products = this.state.filteredProducts.slice(0, this.state.limitTo);
    return (
      <div className="m-3 d-flex flex-column justify-content-center align-items-center" id="store-view">
        <h2 className="text-center color-bege">A nossa loja</h2>
        <input
          id="search_product"
          className="form-control m-2"
          type="search"
          placeholder="O que procura?"
          aria-label="Search"
          name="search"
          value={this.state.search}
          onChange={this.handleChange}
        />
        <div className="w-100 text-center">
          <select
            className="store-filters"
            name="type"
            value={this.state.type}
            onChange={this.handleChange}
            id="filter_products"
          >
            <option value="" disabled selected hidden>
              Filtro
            </option>
            <option value="watch">Relógios</option>
            <option value="pen">Canetas</option>
            <option value="lighter">Isqueiros</option>
            <option value="shaver">Máquinas de barbear</option>
            <option value="other">Outros acessórios</option>
            <option value="all">Todos os artigos</option>
          </select>

          <select
            className="store-filters"
            name="price_order"
            onChange={this.handleChange}
            value={this.state.price_order}
            id="price_order"
          >
            <option value="" disabled selected hidden>
              Ordenar por preço
            </option>
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
        <div className="d-flex flex-row flex-wrap justify-content-center w-100">
          {this.state.filteredProducts &&
            products.map((product) => (
              <div
                className="card text-center m-2 store-card card-background"
                key={product._id}
              >
                <img
                  src={squarePicture(product.image[0])}
                  alt={this.state.model}
                  className="card-img-top mx-auto store-image"
                  style={{ maxWidth: "300px" }}
                />
                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                  <h3 className="card-title">{product.model}</h3>
                  <h4 className="card-text">{product.brand}</h4>
                  <span className="card-text">{product.price / 100} €</span>
                  {!product.available_quantity && (
                    <div className="font-italic">
                      Produto temporariamente esgotado.
                    </div>
                  )}
                  {product.available_quantity > 0 && (
                    <div className="text-success">
                      Stock: {product.available_quantity}{" "}
                    </div>
                  )}
                </div>
                <div className="card-footer card-footer-background">
                  <Link className="text-light" to={`/store/${product._id}`}>
                    Mais informações
                  </Link>
                </div>
              </div>
            ))}
        </div>
        {this.state.limitTo < this.state.products.length && (
          <button onClick={this.loadMore} className="standard-button">
            Ver Mais
          </button>
        )}
      </div>
    );
  }
}
