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
import "./ProductManagement.css";

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
      console.log("cell", cell);
      if (cell.getElementsByTagName("input").length > 0) {
        //the split will allow us to get only the first class that is the same name than the property.
        productUpdated[
          cell.className.split(" ")[0]
        ] = cell.getElementsByTagName("input")[0].value;
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
      <div className="margin-responsive d-flex flex-column">
        <h3 className="color-bege">Gestão de artigos</h3>
        <form
          className="form-inline m-2 d-flex justify-content-center"
          onSubmit={this.handleSearchSubmit}
        >
          <input
            className="form-control w-50 "
            type="search"
            placeholder="Qual o artigo que procura alterar?"
            aria-label="Search"
            name="searchWords"
          />
          <button className="standard-button" type="submit">
            Pesquisa
          </button>
        </form>
        <br />
        <form>
          <div className="table-responsive">
            <table className="table table-sm" id="table-product-management">
              <thead className="background-color-dark">
                <tr className="color-bege text-center">
                  <th className="align-middle">
                    Imagem
                    <br />
                    <span>
                      <i>*Limite 3 ficheiros</i>
                    </span>
                    {this.state.errorLoadingFile && (
                      <span className="text-danger">
                        Erro no upload the imagens
                      </span>
                    )}
                  </th>
                  <th className="align-middle">Marca</th>
                  <th className="align-middle">Modelo</th>
                  <th className="align-middle">Descrição</th>
                  <th className="align-middle">Código interno</th>
                  <th className="align-middle">Código de barras</th>
                  <th className="align-middle">Preço</th>
                  <th className="align-middle">Quantidade em stock</th>
                  <th className="align-middle">Quantidade em vendas</th>
                  <th className="align-middle">Acções</th>
                </tr>
              </thead>
              <tbody>
                {this.state.filteredProducts &&
                  this.state.filteredProducts.map((product) => (
                    <tr key={product._id} id={product._id}>
                      <td className="image d-flex flex-column align-items-center justify-content-center">
                        <div className="img-container">
                          <img
                            src={product.image[0]}
                            alt={product.model}
                            style={{
                              height: "100px",
                              width: "auto",
                              borderRadius: "15px",
                            }}
                          />
                          <button
                            className="btn"
                            type="button"
                            onClick={(e) => this.deleteImage(e, 0, product._id)}
                          >
                            X
                          </button>
                        </div>
                        {product.image[1] && (
                          <div className="img-container">
                            <img
                              src={product.image[1]}
                              alt={product.model}
                              style={{
                                height: "100px",
                                width: "auto",
                                borderRadius: "15px",
                              }}
                            />
                            <button
                              className="btn"
                              type="button"
                              onClick={(e) =>
                                this.deleteImage(e, 1, product._id)
                              }
                            >
                              X
                            </button>
                          </div>
                        )}
                        {product.image[2] && (
                          <div className="img-container">
                            <img
                              src={product.image[2]}
                              alt={product.model}
                              style={{
                                height: "100px",
                                width: "auto",
                                borderRadius: "15px",
                              }}
                            />
                            <button
                              className="btn"
                              type="button"
                              onClick={(e) =>
                                this.deleteImage(e, 2, product._id)
                              }
                            >
                              X
                            </button>
                          </div>
                        )}
                        <label for="upload-photo" class="label-upload">
                          Adicione uma imagem...
                        </label>
                        <input
                          type="file"
                          placeholder="Adicione uma foto"
                          name="image"
                          onChange={(e) =>
                            this.handleFileChange(e, product._id)
                          }
                          accept="image/*"
                          id="upload-photo"
                        />
                      </td>
                      <td className="brand align-middle">
                        <input
                          type="text"
                          defaultValue={product.brand}
                          className="w-100 form-control text-center"
                        />
                      </td>
                      <td className="model align-middle">
                        <input
                          type="text"
                          defaultValue={product.model}
                          className="w-100 form-control text-center"
                        />
                      </td>
                      <td className="description align-middle">
                        <input
                          type="text"
                          defaultValue={product.description}
                          className="w-100 form-control text-center"
                        />
                      </td>
                      <td className="internalCode align-middle">
                        <input
                          type="text"
                          defaultValue={product.internalCode}
                          className="w-100 form-control text-center"
                        />
                      </td>
                      <td className="barCode align-middle">
                        <input
                          type="text"
                          defaultValue={product.barCode}
                          className="w-100 form-control text-center"
                        />
                      </td>
                      <td className="price align-middle">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={product.price / 100}
                          className="w-100 form-control text-center"
                        />
                      </td>
                      <td className="available_quantity align-middle">
                        <input
                          type="number"
                          min="0"
                          step="0"
                          defaultValue={product.available_quantity}
                          className="w-100 form-control text-center"
                        />
                      </td>
                      <td></td>
                      <td className="">
                        <button
                          onClick={(e) => this.updateItem(product._id, e)}
                          className="btn"
                        >
                          <b>Atualizar</b>
                        </button>
                        <Popup
                          trigger={
                            <button
                              onClick={this.preventDefault}
                              type="button"
                              className="btn"
                            >
                              <b>Eliminar</b>
                            </button>
                          }
                          modal
                          contentStyle={{
                            borderRadius: "15px",
                            padding: "1em",
                          }}
                        >
                          <div>
                            <b> Tem a certeza?</b>
                            <br />
                            Ao carregar eliminar este artigo será removido da
                            sua base de dados. <br />
                            <button
                              type="button"
                              className="standard-button"
                              onClick={this.deleteItem.bind(this, product._id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </Popup>
                        <br />
                        <span className="text-center">
                          Atualizado a <br /> {product.lastUpdate.substr(0, 10)}{" "}
                          às {product.lastUpdate.substr(11, 8)}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </form>
      </div>
    );
  }
}

export default ProductManagement;
