import React, { Component } from "react";
import {
  getAllProducts as getAllProductsService,
  editProduct,
} from "./../../services/product-management";
import { Delete as DeleteService } from "./../../services/product-management";
import { DeleteImage as DeleteImageService } from "./../../services/product-management";
import { editProduct as editProductService } from "./../../services/product-management";
import { addNewPicture as addNewPictureService } from "./../../services/product-management";
import Popup from "reactjs-popup";

export class ProductManagement extends Component {
  _isMounted = false;

  constructor() {
    super();
    this.state = {
      products: [],
      filteredProducts: [],
    };
    this.deleteImage = this.deleteImage.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  handleSearchSubmit(event) {
    event.preventDefault();
    const wordsToSearch = event.target.searchWords.value;
    let newList = [];
    if (wordsToSearch !== "") {
      let currentList = this.state.products;
      newList = currentList.filter((item) => {
        const lcBrand = item.brand.toLowerCase();
        const lcModel = item.model.toLowerCase();
        const lcDescription = item.description.toLowerCase();
        const filter = wordsToSearch.toLowerCase();
        return (
          lcBrand.includes(filter) ||
          lcModel.includes(filter) ||
          lcDescription.includes(filter)
        );
      });
    } else {
      newList = this.state.products;
    }
    this.setState({
      filteredProducts: newList,
    });
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

  async deleteItem(productId) {
    await DeleteService(productId);
    const products = await getAllProductsService();
    this.setState({
      products: products,
      filteredProducts: products,
    });
    this.props.history.push(`/store/management`);
  }

  async updateItem(productId, event) {
    event.preventDefault();
    let productUpdated = {};
    productUpdated["_id"] = productId;
    const content = document
      .getElementById("table-product-management")
      .rows.namedItem(productId).cells;
    for (let cell of content) {
      if (cell.getElementsByTagName("input").length > 0) {
        productUpdated[cell.className] = cell.getElementsByTagName(
          "input"
        )[0].value;
        /* The code below would be in case we wanted to upload an image at the same time of the update, but I decided
        that the picture would be uploaded immediately through other function - handleFileChange()
        if(cell.className === "image") {
          productUpdated[cell.className] = cell.getElementsByTagName("input")[0].files;
          console.log('teste', productUpdated[cell.className]);
        }*/
      }
    }
    await editProductService(productUpdated);
    const products = await getAllProductsService();
    this.setState({
      products: products,
      filteredProducts: products,
      errorLoadingFile: false,
    });
  }

  async deleteImage(e, index, productId) {
    try {
      const response = await DeleteImageService({
        id: productId,
        index: index,
      });
      if (response.data === "Image deleted") {
        const products = await getAllProductsService();
        this.setState({
          products: products,
          filteredProducts: products,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async handleFileChange(event, productId) {
    const file = event.target.files[0];
    try {
      const response = await addNewPictureService({
        image: file,
        productId: productId,
      });
      if (response.data === "Image added") {
        const products = await getAllProductsService();
        this.setState({
          products: products,
          filteredProducts: products,
          errorLoadingFile: false,
        });
      } else {
        this.setState({
          errorLoadingFile: true,
        });
      }
    } catch (error) {
      console.log("Not possible to load picture in React Profile View", error);
    }
  }

  render() {
    return (
      <div className="m-5 d-flex flex-column justify-content-center align-items-center">
        <h3>Gestão de artigos</h3>
        <form
          className="form-inline m-2 d-flex justify-content-center"
          onSubmit={this.handleSearchSubmit}
        >
          <input
            className="form-control w-50"
            type="search"
            placeholder="Qual o artigo?"
            aria-label="Search"
            name="searchWords"
          />
          <button className="btn btn-secondary ml-2" type="submit">
            Pesquisa
          </button>
        </form>
        <br />
        <form>
          <table className="table table-striped" id="table-product-management">
            <thead className="thead-dark ">
              <tr>
                <th>
                  Imagem - Limite 3 ficheiros
                  {this.state.errorLoadingFile && (
                    <span className="text-danger">
                      Erro no upload the imagens
                    </span>
                  )}
                </th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Descrição</th>
                <th>Código interno</th>
                <th>Código de barras</th>
                <th>Preço</th>
                <th>Quantidade em stock</th>
                <th>Quantidade em vendas</th>
                <th>Acções</th>
              </tr>
            </thead>
            <tbody>
              {this.state.filteredProducts &&
                this.state.filteredProducts.map((product) => (
                  <tr key={product._id} id={product._id}>
                    <td className="image">
                      <div>
                        <img
                          src={product.image[0]}
                          alt={product.model}
                          style={{ height: "100px", width: "auto" }}
                        />
                        <button
                          className="btn btn-danger"
                          type="button"
                          onClick={(e) => this.deleteImage(e, 0, product._id)}
                        >
                          X
                        </button>
                      </div>
                      {product.image[1] && (
                        <div>
                          <img
                            src={product.image[1]}
                            alt={product.model}
                            style={{ height: "100px", width: "auto" }}
                          />
                          <button
                            className="btn btn-danger"
                            type="button"
                            onClick={(e) => this.deleteImage(e, 1, product._id)}
                          >
                            X
                          </button>
                        </div>
                      )}
                      {product.image[2] && (
                        <div>
                          <img
                            src={product.image[2]}
                            alt={product.model}
                            style={{ height: "100px", width: "auto" }}
                          />
                          <button
                            className="btn btn-danger"
                            type="button"
                            onClick={(e) => this.deleteImage(e, 2, product._id)}
                          >
                            X
                          </button>
                        </div>
                      )}
                      <input
                        type="file"
                        placeholder="Adicione uma foto"
                        name="image"
                        onChange={(e) => this.handleFileChange(e, product._id)}
                        accept="image/*"
                      />
                    </td>
                    <td className="brand">
                      <input
                        type="text"
                        defaultValue={product.brand}
                        className="w-100"
                      />
                    </td>
                    <td className="model">
                      <input
                        type="text"
                        defaultValue={product.model}
                        className="w-100"
                      />
                    </td>
                    <td className="description">
                      <input
                        type="text"
                        defaultValue={product.description}
                        className="w-100"
                      />
                    </td>
                    <td className="internalCode">
                      <input
                        type="text"
                        defaultValue={product.internalCode}
                        className="w-100"
                      />
                    </td>
                    <td className="barCode">
                      <input
                        type="text"
                        defaultValue={product.barCode}
                        className="w-100"
                      />
                    </td>
                    <td className="price">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={product.price / 100}
                        className="w-100"
                      />
                    </td>
                    <td className="available_quantity">
                      <input
                        type="number"
                        min="0"
                        step="0"
                        defaultValue={product.available_quantity}
                        className="w-100"
                      />
                    </td>
                    <td></td>
                    <td>
                      <button onClick={(e) => this.updateItem(product._id, e)}>
                        Atualizar
                      </button>
                      <Popup
                        trigger={
                          <button onClick={this.preventDefault} type="button">
                            Eliminar
                          </button>
                        }
                        position="left"
                      >
                        <div>
                          Tem a certeza? Ao carregar eliminar este artigo será
                          removido da sua base de dados. <br />
                          <button
                            type="button"
                            onClick={this.deleteItem.bind(this, product._id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </Popup>
                      <br />
                      <span>
                        Atualizado em {product.lastUpdate.substr(0, 10)} às
                        {product.lastUpdate.substr(11, 8)}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </form>
      </div>
    );
  }
}

export default ProductManagement;
