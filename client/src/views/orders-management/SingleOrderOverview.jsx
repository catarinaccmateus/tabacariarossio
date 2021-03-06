import React, { Component } from "react";
import { getOrder as getOrderService } from "./../../services/orders";
import { updateOrder as updateOrderService } from "./../../services/orders";
import { addCommentToOrder as addCommentToOrderService } from "./../../services/orders";
import { uploadFile as uploadFileService } from "./../../services/orders";
import { deleteFile as deleteFileService } from "./../../services/orders";

export class SingleOrderOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: null,
      user: null,
      err: false,
      new_status: "ordered",
      comment: "",
      errAddingComment: false,
      selectedFile: null,
    };
    this.handleOrderUpdate = this.handleOrderUpdate.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addCommentToOrder = this.addCommentToOrder.bind(this);
    this.handleSelectedFile = this.handleSelectedFile.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.deteleFile = this.deteleFile.bind(this);
  }

  async componentDidMount() {
    this.updateOrderDisplayed();
  }

  async updateOrderDisplayed() {
    try {
      const orderNumber = this.props.match.params.order_id;
      const response = await getOrderService(orderNumber);
      this.setState({
        user: response.order.user_id,
      });
      if (response.order.user_id) {
        response.order.user_id = response.order.user_id._id;
      }
      this.setState({
        order: response.order,
        err: false,
      });
    } catch (err) {
      console.log(err);
      this.setState({
        err: true,
      });
    }
  }

  async handleOrderUpdate(event) {
    event.preventDefault();
    const { new_status } = this.state;
    const orderId = this.props.match.params.order_id;
    try {
      await updateOrderService({
        key: "status",
        value: new_status,
        order_id: orderId,
      });
      this.updateOrderDisplayed();
    } catch (err) {
      console.log(err);
    }
  }

  handleInputChange(event) {
    const nameOfState = event.target.name;
    const valueOfInput = event.target.value;
    this.setState({
      [nameOfState]: valueOfInput,
    });
  }

  async addCommentToOrder(event) {
    event.preventDefault();
    const orderId = this.props.match.params.order_id;
    const comment = this.state.comment;
    const user = this.props.user;
    console.log(new Date());
    try {
      const response = await addCommentToOrderService({
        text: comment,
        order_id: orderId,
        creationDate: new Date(),
        user: user.email,
      });
      if (response === "Comment added") {
        this.updateOrderDisplayed();
        this.setState({
          errAddingComment: false,
        });
      } else {
        this.setState({
          errAddingComment: true,
        });
      }
    } catch (err) {
      this.setState({
        errAddingComment: true,
      });
      console.log(err);
    }
  }

  handleSelectedFile(e) {
    e.preventDefault();
    this.setState({
      selectedFile: e.target.files[0],
    });
  }

  async handleUpload(event) {
    event.preventDefault();
    const orderId = this.props.match.params.order_id;
    try {
      await uploadFileService({
        selectedFile: this.state.selectedFile,
        order_id: orderId,
      });
      this.updateOrderDisplayed();
    } catch (err) {
      console.log("error", err);
    }
  }

  async deteleFile(file) {
    console.log(file);
    const orderNumber = this.props.match.params.order_id;
    try {
      await deleteFileService({ order_id: orderNumber, file_key: file });
      this.updateOrderDisplayed();
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { order, user, err, errAddingComment } = this.state;
    return (
      <div className="m-3">
        <h3 className="color-bege">Gestão de encomenda</h3>
        {order && (
          <div className="m-2">
            <h4>Detalhes do cliente</h4>
            {user ? (
              <div className="border-bege">
                <p>
                  Nome do cliente:
                  {user.name} {user.surname}
                </p>
                <div>Contacto telefónico: {user.phoneNumber}</div>
                <div>E-mail: {user.email}</div>
                <p>
                  Morada de entrega:
                  {user.address.line1} {user.address.line2} {user.address.city}
                  {user.address.zipcode} {user.address.country}
                </p>
                <p>
                  Morada de faturação: {user.taxAddress.line1}
                  {user.taxAddress.line2} {user.taxAddress.city}
                  {user.taxAddress.zipcode} {user.taxAddress.country}
                </p>
              </div>
            ) : (
              <div className="border-bege">
                O utilizador eliminou a sua conta e os seus dados foram
                eliminados. <br /> Se for necessário, consulte no e-mail da loja
                o e-mail com o pedido de encomenda.
              </div>
            )}
            <h4>Detalhes da encomenda</h4>
            <div className="border-bege">
              <p>
                Data do pedido de encomenda: {order.creationDate.slice(0, 10)},{" "}
                {order.creationDate.slice(11, 16)}
              </p>
              <ul>
                {order.products_basket.map((product) => (
                  <li key={product._id}>
                    modelo: {product.model}, marca: {product.brand}, preço por
                    unidade: {product.price / 100}, quantidade:
                    {product.order_quantity}
                  </li>
                ))}
              </ul>
              <p>Total: {order.total}</p>
              <div>Estado: {order.status}</div>
              <form id="status" onSubmit={this.handleOrderUpdate}>
                <select
                  name="new_status"
                  onChange={this.handleInputChange}
                  className="form-control"
                >
                  <option value="ordered">Encomendada</option>
                  <option value="paid">Paga</option>
                  <option value="shipped">Enviada</option>
                  <option value="canceled">Cancelada</option>
                </select>
                <button className="standard-button">Atualizar</button>
              </form>
              Estado de faturação: {order.invoice}.
              {order.invoice_files.length > 0 ? (
                <div>
                  Esta venda tem {order.invoice_files.length} fatura/s
                  associada/s.
                  {order.invoice_files.map((file) => (
                    <div key={order._id}>
                      <a href={file.fileLink} target="_blank">
                        Link para a fatura.
                      </a>
                      <button
                        className="standard-button"
                        type="button"
                        onClick={() => this.deteleFile(file.s3_key)}
                      >
                        Eliminar fatura
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div>Esta encomenda ainda não tem uma fatura associada.</div>
              )}
            </div>
            <h4>Adicionar Fatura</h4>

            <div className="border-bege">
              <form onSubmit={this.handleUpload}>
                <span>*Cada fatura deve ter um título único.</span>
                <input
                  type="file"
                  onChange={this.handleSelectedFile}
                  className="form-control"
                />
                <button className="standard-button">Adicionar</button>
              </form>
            </div>
            <h4>Observações</h4>
            <div className="border-bege">
              <form onSubmit={this.addCommentToOrder}>
                <label htmlFor="comments">
                  Adicione comentários relativos a esta encomenda.
                </label>
                <input
                  className="form-control"
                  type="text"
                  id="comment"
                  name="comment"
                  onChange={this.handleInputChange}
                  value={this.state.comment}
                />
                <button className="standard-button">Adicionar</button>
              </form>

              {errAddingComment && (
                <div>
                  Ocorreu um erro ao adicionar o comentário. Por favor, contacte
                  os serviços técnicos informáticos para resolução do problema.
                </div>
              )}
              {order.comments.length > 0 ? (
                <div>
                  {order.comments.sort((a, b) => a.creationDate-b.creationDate).map((comment, index) => (
                    <div key={index} className="border-dark m-1 p-1">
                      <div className="d-flex flex-row flex-wrap justify-content-between mb-3">
                        <span>{comment.user}</span>
                        <span>
                          {comment.creationDate.slice(0, 10)},{" "}
                          {comment.creationDate.slice(11, 16)}
                        </span>
                      </div>
                      <p className="text-center">{comment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div>Não existem comentários relativos a esta encomenda.</div>
              )}
            </div>
          </div>
        )}
        {err && (
          <div>
            Ocorreu um erro na procura da respetiva encomenda. Por favor,
            contacte os serviços técnicos informáticos para resolução do
            problema.
          </div>
        )}
      </div>
    );
  }
}

export default SingleOrderOverview;
