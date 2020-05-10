import React from "react";
import { Link } from "react-router-dom";
import BasketLogo from "./../../public/images/logos/shopping cart brown.png";
import "./Basket.css";

function BasketConfirmation(props) {
  const user = props.user;
  const productsInBasket = props.productsInBasket;
  function areItemsInBasket() {
    if (productsInBasket.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  let createOrder = async (e) => {
    e.preventDefault();
    props.history.push(`/payment-method`);
  };

  return (
    <div className="main-container m-5 d-flex flex-column justify-content-center align-items-center">
      {user && (
        <div>
          <h1 className="color-bege mb-1">Carrinho de compras</h1>
          {areItemsInBasket() ? (
            <div>
              <ul>
                <h4>Lista de artigos no carrinho</h4>
                {props.productsInBasket.map((product) => (
                  <li key={product._id}>
                    {product.model}, {product.price}, {product.order_quantity}
                  </li>
                ))}
              </ul>
              <h4>Total da compra: {props.totalPriceInBasket}</h4>
              <div>
                <h4>Os seus dados</h4>
                <div>Nome: {user.name}</div>
                <div>Contacto telefónico: {user.phoneNumber}</div>
                <div>E-mail: {user.email}</div>
                <div>
                  Morada de entrega: {user.address.line1} {user.address.line2}{" "}
                  {user.address.city} {user.address.zipcode}{" "}
                  {user.address.country}{" "}
                </div>
                <div>
                  Morada de faturação: {user.taxAddress.line1}{" "}
                  {user.taxAddress.line2} {user.taxAddress.city}{" "}
                  {user.taxAddress.zipcode} {user.taxAddress.country}
                </div>
                <div>
                  <Link to="/private">Atualizar dados</Link>
                </div>
                <form>
                  <input type="checkbox" name="basket-confirmation" required />
                  <label htmlFor="basket-confirmation">
                    Confirmo que os dados acima mencionados estão corretos.
                  </label>
                  <button onClick={createOrder}>
                    Prosseguir para pagamento
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="text-center">
          <h2>
            Ups! </h2>
            <p>O seu carrinho está vazio. <br />
            <Link to="/store">Espreite a nossa loja.</Link>
            </p>
            <img src={BasketLogo} alt="shopping-cart"  className="shopping-cart img-fluid"/>
          </div>
          )}
        </div>
      )}

      {!user && (
        <h2>
          <Link to={"/sign-in"}>Por favor, inicie sessão para continuar</Link>
        </h2>
      )}
    </div>
  );
}

export default BasketConfirmation;
