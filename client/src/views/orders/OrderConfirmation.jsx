import React, { Component } from "react";
import { getOrder as getOrderService } from "./../../services/orders";
import { Link } from "react-router-dom";
import "./OrderConfirmation.css";

export class OrderConfirmation extends Component {
  constructor() {
    super();
    this.state = {
      order: "",
    };
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    const orderNumber = this.props.match.params.order_id;
    const response = await getOrderService(orderNumber);
    this.setState({
      order: response.order,
    });
  }

  render() {
    const user = this.props.user;
    const orderNumber = this.props.match.params.order_id;
    const order = this.state.order;
    const productsInOrder = order.products_basket;
    return (
      <div className="main-container d-flex flex-column m-4 justify-content-center align-items-center">
        {order && (
          <div>
            <div>
              <h2 className="color-bege"> A sua encomenda encontra-se realizada. </h2>
              <p> O código de encomenda é o {orderNumber}.</p>
            </div>
            <h3 className="color-bege">Resumo da encomenda</h3>
            <ul className="w-100 list-items">
              <li className="d-flex flex-row justify-content-between">
                <div className="font-weight-bold">Artigo</div>
                <div className="font-weight-bold">Quantidade</div>
                <div className="font-weight-bold">Preço</div>
              </li>
              {productsInOrder.map((product) => (
                <li
                  key={product._id}
                  className="d-flex flex-row justify-content-between"
                >
                  <div>
                    {product.model} {product.brand}
                  </div>
                  <div>{product.order_quantity}</div>
                  <div> {product.price / 100} euros</div>{" "}
                </li>
              ))}
            </ul>
            <div><b>Total:</b> {order.total} euros. </div>
            {order.status === "paid" && (
              <div><b>Estado:{" "}</b>O pagamento foi recebido com sucesso.</div>
            )}
            {order.status === "shipped" && <div><b>Estado:{" "}</b>A encomenda foi expedida.</div>}
            {order.status === "canceled" && (
              <div><b>Estado:{" "}</b>A encomenda foi cancelada.</div>
            )}
            {order.status === "ordered" && (
              <div>
                <div><b>Estado:{" "}</b>O pagamento encontra-se pendente</div>
                {order.payment_method === "bank_transfer" && (
                  <div>
                    Por favor realize a transferência do valor total para o IBAN
                    XXXXXXXXXXXXXX e envie o comprovativo de pagamento para
                    xxxx@xxx com o número de encomenda em assunto. Tem 3 dias
                    úteis para finalizar o seu pagamento, sendo que a encomenda
                    será cancelada automáticamente caso não proceda ao pagamento
                    do seu valor.
                  </div>
                )}
              </div>
            )}
            {order.invoice_files.length > 0 ? (
              <div>
                {order.invoice_files.map((file) => (
                  <div>
                    Esta encomenda tem fatura.
                    <a href={file.fileLink} target="_blank">
                      Link para a fatura.
                    </a>
                    <button
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
        )}
        <p>
          Poderá consultar o estado das suas encomendas em{" "}
          <Link to={"/my-orders"}>as minhas encomendas.</Link>
        </p>
      </div>
    );
  }
}

export default OrderConfirmation;
