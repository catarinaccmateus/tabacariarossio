import React, { Component } from "react";
import { ProductInfo as ProductInfoService } from "./../../services/product-management";
import { Delete as DeleteService } from "./../../services/product-management";
import "./IndividualProduct.css";

export class IndividualProduct extends Component {
  constructor() {
    super();
    this.state = {
      product: {
        brand: "",
        model: "",
        price: "",
        image: "",
        barCode: "",
        internalCode: "",
        description: "",
        type: "",
        available_quantity: "",
      },
      loaded: false,
      numberOfImages: 0,
    };
    this.deleteItem = this.deleteItem.bind(this);
    this.addItemToBasket = this.addItemToBasket.bind(this);
    this.passToNextImage = this.passToNextImage.bind(this)
    this.passToPreviousImage = this.passToPreviousImage.bind(this);
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    let productId = this.props.match.params.id;
    await ProductInfoService(productId)
      .then((product) => {
        this.setState({
          product: product,
          loaded: true,
          numberOfImages: product.image.length,
          indexOfImage: 0
        });
      })
      .catch((err) => {
        throw err;
      });
  }

  async deleteItem() {
    let productId = this.props.match.params.id;
    await DeleteService(productId)
      .then(() => {
        this.props.history.push(`/store`);
      })
      .catch((err) => {
        throw err;
      });
  }

  addItemToBasket() {
    this.props.addProductToBasket(this.state.product);
    this.props.history.push(`/basket`);
  }

  passToNextImage() {
    let newIndex;
    if (this.state.indexOfImage + 1 < this.state.numberOfImages) {
    newIndex = this.state.indexOfImage + 1;
    this.setState({
      indexOfImage: newIndex
    });
    } 
  }

  passToPreviousImage() {
    let newIndex;
    if (this.state.indexOfImage !== 0) {
    newIndex = this.state.indexOfImage - 1;
    this.setState({
      indexOfImage: newIndex
    });
   }
  }

  render() {
    let index = this.state.indexOfImage;
    const user = this.props.user;
    return (
      <div className="main-container d-flex flex-column m-3">
        <h3 className="color-bege">Artigo seleccionado</h3>
        {this.state.loaded ? (
          <div className="form d-flex flex-row flex-wrap justify-content-around align-items-center m-2">
          <div className="half-width">
          <div className="d-flex flex-row justify-content-between">
          {
            this.state.indexOfImage > 0 ? 
           <button onClick={this.passToPreviousImage} className="btn">Imagem anterior</button> :
           <div></div>
           }
          {
            this.state.numberOfImages > 1 && this.state.indexOfImage < this.state.numberOfImages - 1 ? 
           <button onClick={this.passToNextImage} className="btn">Próxima imagem</button> :
           <div></div>
           }
           </div>
            <img
              src={this.state.product.image[index]}
              alt={this.state.product.model}
              style={{ width: "100%", height: "auto" }}
              className="styled-images"
            />
           </div>
           <div className="half-width d-flex flex-column justify-content-center align-items-center">
            <h3>{this.state.product.model}</h3>
            <h4>{this.state.product.brand}</h4>
            <p>{this.state.product.description}</p>
            <span>{this.state.product.price / 100} €</span>
            {this.state.product.available_quantity > 0 ? (
              <button
                onClick={this.addItemToBasket}
                className="standard-button"
              >
                Adicionar ao carrinho
              </button>
            ) : (
              <div className="font-italic">Artigo temporariamente esgotado.</div>
            )}
            </div>
          </div>
        ) : (
          <div className="text-center color-dark"> Procurando o artigo para si... </div>
        )}
        {user && (user.role === "admin" || user.role === "employee") &&
            <button onClick={this.deleteItem} className="btn text-danger">
              Eliminar artigo
            </button>
            }
        <button
          className="btn text-primary"
          onClick={this.props.history.goBack}
        >
          Retroceder
        </button>
      </div>
    );
  }
}

export default IndividualProduct;
