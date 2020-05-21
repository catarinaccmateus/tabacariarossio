import React, { useState } from "react";
import { Link } from "react-router-dom";
import BasketLogo from "./../../public/images/logos/shopping cart brown.png";
import "./Basket.css";
import SignInModal from "./../../components/SignIn";
import SignUpModal from "./../../components/SignUp";

function BasketConfirmation(props) {
  const [signInModalOpen, setsignInModalOpen] = useState(false);
  const [signUpModalOpen, setsignUpModalOpen] = useState(false);

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

  let handleSignInModalOpen = () => {
    setsignInModalOpen(!signInModalOpen);
  };

  let handleSignUpModalOpen = () => {
    setsignUpModalOpen(!signUpModalOpen);
  };

  return (
    <div className="main-container m-5 ">
      {user && (
        <div className="d-flex flex-column justify-content-center align-items-center w-100">
          <h1 className="color-bege mb-2">Carrinho de compras</h1>
          {areItemsInBasket() ? (
            <div className="w-100 d-flex flex-column align-items-center justify-content-center">
            <div className="confirm-basket-data">
              <div className="border-bege validation-item">
                <h4 className="color-dark mb-2">Os seus dados</h4>
                <div>
                  Nome: {user.name} {user.surname}
                </div>
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
              </div>
              <div className="border-bege validation-item">
                <h4 className="color-dark">Lista de artigos no carrinho</h4>
                {props.productsInBasket.map((product) => (
                  <div key={product._id}>
                    {product.model} - {product.price / 100} €/unidade -{" "}
                    {product.order_quantity} unidade/s
                  </div>
                ))}
              </div>
              </div>
              <h2 className="w-100 text-right">
                Total da compra: <br /> {props.totalPriceInBasket} €
              </h2>
              <form onSubmit={createOrder} className="d-flex flex-column align-items-center justify-content-center">
                <label htmlFor="basket-confirmation">
                  <input type="checkbox" name="basket-confirmation" required />
                  Confirmo que os dados acima mencionados estão corretos.
                </label>
                <button className="standard-button">
                  Prosseguir para pagamento
                </button>
              </form>
            </div>
          ) : (
            <div className="d-flex flex-column justify-content-center align-items-center my-5">
              <h2>Ups! </h2>
              <p>
                O seu carrinho está vazio. <br />
              </p>
              <img
                src={BasketLogo}
                alt="shopping-cart"
                className="shopping-cart img-fluid m-5"
              />
              <Link to="/store" className="standard-button m-5 text-center">
                Espreite a nossa loja.
              </Link>
            </div>
          )}
        </div>
      )}

      {!user && (
        <div className="d-flex flex-column justify-content-center align-items-center">
          <h1 className="m-4 text-center color-bege ">Quase lá!</h1>

          <h2 className="text-center color-dark">
            Por favor,{" "}
            <Link onClick={handleSignInModalOpen}>inicie sessão</Link> ou{" "}
            <Link onClick={handleSignUpModalOpen}>crie uma conta para</Link>{" "}
            continuar com a sua compra.
          </h2>
        </div>
      )}

      <SignInModal
        {...props}
        modalOpen={signInModalOpen}
        handleModalOpen={handleSignInModalOpen}
        loadUserInformation={props.loadUserInformation}
      />
      <SignUpModal
        {...props}
        modalOpen={signUpModalOpen}
        handleModalOpen={handleSignUpModalOpen}
        loadUserInformation={props.loadUserInformation}
      />
    </div>
  );
}

export default BasketConfirmation;
