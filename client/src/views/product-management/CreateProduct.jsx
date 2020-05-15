import React, { Component } from "react";
import { Create as CreateProductService } from "./../../services/product-management";

export default class CreateProduct extends Component {
  constructor() {
    super();
    this.state = {
      brand: "",
      model: "",
      price: "",
      image: "",
      barCode: "",
      internalCode: "",
      description: "",
      type: "watch",
      available_quantity: 1,
    };
    this.handleSubmission = this.handleSubmission.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
  }

  componentDidMount(){
    window.scrollTo(0, 0);
  }

  async handleSubmission(event) {
    event.preventDefault();
    await CreateProductService(this.state)
      .then((product) => {
        let productId = product._id;
        this.props.history.push(`/store/${productId}`);
      })
      .catch((err) => {
        throw err;
      });
  }

  handleInputChange(event) {
    const nameOfState = event.target.name;
    let valueOfInput = event.target.value;
    this.setState({
      [nameOfState]: valueOfInput,
    });
  }

  handleImageChange(event) {
    event.preventDefault();
    const imgs = event.target.files;
    this.setState({
      image: imgs,
    });
  }

  render() {
    return (
      <div className="main-container center-container m-3">
        <form
          onSubmit={this.handleSubmission}
          className="form d-flex flex-column"
          encType="multipart/form-data"
        >
          <h3 className="color-bege">Adicionar Artigo</h3>
          <label htmlFor="brand">Marca</label>
          <input
            type="text"
            name="brand"
            value={this.state.brand}
            onChange={this.handleInputChange}
            className="form-control"
          />
          <label htmlFor="model">Modelo</label>
          <input
            className="form-control"
            type="text"
            name="model"
            value={this.state.model}
            onChange={this.handleInputChange}
          />
          <label htmlFor="price">Preço</label>
          <input
            className="form-control"
            type="number"
            name="price"
            value={this.state.price}
            onChange={this.handleInputChange}
            min="0"
            step="0.01"
          />
          <label htmlFor="description">Descrição</label>
          <input
            className="form-control"
            type="text"
            name="description"
            value={this.state.description}
            onChange={this.handleInputChange}
          />
          <label htmlFor="barCode">Código de barras</label>
          <input
            className="form-control"
            type="text"
            name="barCode"
            value={this.state.barCode}
            onChange={this.handleInputChange}
          />
          <label htmlFor="internalCode">Código interno</label>
          <input
            className="form-control"
            type="text"
            name="internalCode"
            value={this.state.internalCode}
            onChange={this.handleInputChange}
          />
          <label htmlFor="type">Tipo de produto</label>
          <select
            name="type"
            value={this.state.type}
            onChange={this.handleInputChange}
            className="my-2 form-control"
          >
            <option value="watch">Relógio</option>
            <option value="pen">Caneta</option>
            <option value="lighter">Isqueiro</option>
            <option value="shaver">Máquina de Barbear</option>
            <option value="other">Outro</option>
          </select>
          <label htmlFor="available_quantity">Quantidade disponível</label>
          <input
            type="number"
            name="available_quantity"
            value={this.state.available_quantity}
            onChange={this.handleInputChange}
            min="0"
            className="form-control"
          />
          <input
            type="file"
            onChange={this.handleImageChange}
            name="images"
            multiple
            accept="image/*"
            className="form-control my-1"
          />
          <button className="standard-button">Adicionar</button>
        </form>
      </div>
    );
  }
}
