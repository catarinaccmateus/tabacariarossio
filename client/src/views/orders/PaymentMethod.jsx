import React, { Component, createContext } from "react";
import { createOrder as createOrderService } from "./../../services/orders";
import "./PaymentMethod.css";

export default class PaymentMethod extends Component {
  constructor(props) {
    super(props);
    this.handleSubmission = this.handleSubmission.bind(this);
  }

  async handleSubmission(event) {
    event.preventDefault();
    let paymentOptions = document.getElementsByName("payment_method");
    const user = this.props.user;
    const productsInBasket = this.props.productsInBasket;
    const totalPriceInBasket = this.props.totalPriceInBasket;

    for (let i = 0; i < paymentOptions.length; i++) {
      if (paymentOptions[i].checked) {
        const paymentOptionSelected = paymentOptions[i].value;
        if (paymentOptionSelected === "bank_transfer") {
          try {
            const response = await createOrderService({
              basket: productsInBasket,
              user: user,
              total: totalPriceInBasket,
              payment_option: paymentOptionSelected,
            });
            if (response.errors) {
              console.log('error');
              console.log(response.errors);
              alert(
                "Ocorreu um erro no servidor. Por favor, entre em contacto connosco."
              );
            } else {
              console.log("else");
              const orderId = response._id;
              this.props.history.push(`/order-confirmed/${orderId}`);
            }
          } catch (err) {
            console.log("error when creating order", err);
            alert(
              "Ocorreu um erro. A sua sessão poderá ter expirado. Por favor, reenicie sessão e tente novamente."
            );
          }
        } else {
          alert(
            "De momento só estamos a aceitar pagamentos via transferência bancária."
          );
        }
      }
    }
  }

  render() {
    return (
      <div className="main-container my-5 margin-responsive-size p-3 d-flex justify-content-center align-items-center border-bege">
        <form
          onSubmit={this.handleSubmission}
          className="d-flex flex-column align-items-center"
        >
          <h3 className="color-bege">Seleccione a forma de pagamento.</h3>
          <label htmlFor="bank_transfer">Transferência bancária</label>
          <input
            type="radio"
            id="bank_transfer"
            name="payment_method"
            value="bank_transfer"
            required
          />
          <label htmlFor="credit_Card">Cartão de Crédito</label>
          <input
            type="radio"
            id="credit_card"
            name="payment_method"
            value="credit_card"
          />
          <label htmlFor="mbway">Mbway</label>
          <input type="radio" id="mbway" name="payment_method" value="mbway" />
          <button className="standard-button">Realizar pagamento</button>
          <span>
            De momento só estamos a aceitar pagamentos por transferência
            bancária. <br /> O comprovativo de pagamento deverá ser enviado por
            e-mail com o assunto nr de encomenda .
          </span>
        </form>
      </div>
    );
  }
}
