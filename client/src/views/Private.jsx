import React, { Component } from "react";
import { editUser as editUserService } from "./../services/authentication";
import { updatePassword as updatePasswordService } from "./../services/authentication";
import { deleteUser as deleteUserService } from "./../services/authentication";
import Popup from "reactjs-popup";
import "./Private.css";

export default class Private extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.user,
      password: "",
      new_password: "",
      confirm_password: "",
      passwordsDontMatch: false,
      passwordIsWrong: false,
      sessionTerminated: false,
      passwordUpdated: false,
    };
    this.hideTaxAddress = this.hideTaxAddress.bind(this);
    this.handleSubmission = this.handleSubmission.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleTaxAddressChange = this.handleTaxAddressChange.bind(this);
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.commercialAgreement = this.commercialAgreement.bind(this);
  }

  hideTaxAddress() {
    console.log("hey");
    let checkBox = document.getElementById("taxAddressCheck");
    var text = document.getElementById("taxAddressUpdate");
    console.log("checked", checkBox.checked);
    console.log(text);
    if (checkBox.checked === true) {
      text.style.display = "none";
      checkBox.value = "checked";
      this.setState({
        taxAddress: this.state.address,
      });
    } else {
      text.style.display = "block";
      checkBox.value = "notChecked";
    }
  }

  async handleSubmission(event) {
    event.preventDefault();
    try {
      await editUserService(this.state)
        .then(() => {
          this.props.loadUserInformation();
          this.props.history.push(`/basket-confirmation`);
        })
        .catch((err) => {
          throw err;
        });
    } catch (error) {
      console.log(error);
    }
  }

  handleInputChange(event) {
    const nameOfState = event.target.name;
    const valueOfInput = event.target.value;
    this.setState({
      [nameOfState]: valueOfInput,
    });
  }

  handleAddressChange(event) {
    const nameOfState = event.target.name;
    const valueOfInput = event.target.value;
    this.setState({
      address: { ...this.state.address, [nameOfState]: valueOfInput },
    });
  }

  handleTaxAddressChange(event) {
    let nameOfState = event.target.name.replace("taxAddress.", "");
    const valueOfInput = event.target.value;
    this.setState({
      taxAddress: { ...this.state.taxAddress, [nameOfState]: valueOfInput },
    });
  }

  async handlePasswordSubmit(event) {
    event.preventDefault();
    const { password, confirm_password, new_password } = this.state;
    if (new_password === confirm_password) {
      const response = await updatePasswordService({
        password: password,
        new_password: new_password,
      });
      if (response.data === "Wrong Password.") {
        this.setState({
          passwordsDontMatch: false,
          passwordIsWrong: true,
          sessionTerminated: false,
          passwordUpdated: false,
        });
      } else if (response.data === "No user logged in.") {
        this.setState({
          passwordsDontMatch: false,
          passwordIsWrong: false,
          sessionTerminated: true,
          passwordUpdated: false,
        });
      } else {
        this.setState({
          passwordsDontMatch: false,
          passwordIsWrong: false,
          sessionTerminated: false,
          passwordUpdated: true,
        });
      }
    } else {
      console.log("as passwords não sa as mesmas");
      this.setState({
        passwordsDontMatch: true,
        passwordIsWrong: false,
        sessionTerminated: false,
        passwwordUpdated: false,
      });
    }
  }

  async deleteUser() {
    const user_id = this.state._id;
    try {
      await deleteUserService(user_id);
      this.props.loadUserInformation();
      this.props.history.push("/");
    } catch (err) {
      console.log(err);
    }
  }

  commercialAgreement(e) {
    this.setState({
      commercial_agreement: e.target.checked,
    });
  }

  render() {
    const {
      passwordsDontMatch,
      passwordIsWrong,
      passwordUpdated,
      sessionTerminated,
    } = this.state;
    return (
      <div className="main-container d-flex flex-column justify-content-center align-items-center m-3">
        <div className="w-100 m-3 border-bege p-2">
          <h2 className="color-bege">Minha conta</h2>
          <form
            onSubmit={this.handleSubmission}
            className=""
          >
          <div className="d-flex flex-row flex-wrap justify-content-around align-items-center">
            <div className="d-flex flex-column w-100 background-shadow">
              <h5 className="color-dark">Dados Pessoais</h5>
              <div className="w-100 d-flex flex-row flex-wrap justify-content-around">
                <label htmlFor="name">
                  Nome{" "}
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={this.state.name}
                    onChange={this.handleInputChange}
                  />
                </label>

                <label htmlFor="surname">
                  Apelidos{" "}
                  <input
                    type="text"
                    name="surname"
                    className="form-control"
                    value={this.state.surname}
                    onChange={this.handleInputChange}
                  />
                </label>

                <label htmlFor="email">
                  Email{" "}
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleInputChange}
                  />
                </label>

                <label htmlFor="phoneNumber">
                  Contacto telefónico{" "}
                  <input
                    type="text"
                    className="form-control"
                    name="phoneNumber"
                    value={this.state.phoneNumber || ""}
                    onChange={this.handleInputChange}
                  />
                </label>

                <label htmlFor="taxNumber">
                  Número Fiscal{" "}
                  <input
                    type="number"
                    name="taxNumber"
                    className="form-control"
                    value={this.state.taxNumber || ""}
                    onChange={this.handleInputChange}
                  />
                </label>
              </div>
              <div>
                <label htmlFor="confirm_comercial">
                  <input
                    type="checkbox"
                    id="confirm_comercial"
                    name="confirm_comercial"
                    defaultChecked={this.state.commercial_agreement}
                    onChange={this.commercialAgreement}
                  />{" "}
                  Concordo em receber promoções e comunicações comerciais
                  Tabacaria Rossio.
                </label>
              </div>
            </div>
            
            <div className="d-flex flex-column background-shadow">
              <h5 className="color-dark">Morada de entrega</h5>
              <label htmlFor="line1">
                Linha 1{" "}
                <input
                  className="form-control"
                  type="text"
                  name="line1"
                  value={this.state.address.line1 || ""}
                  onChange={this.handleAddressChange}
                />
              </label>

              <label htmlFor="line2">
                Linha 2{" "}
                <input
                  type="text"
                  className="form-control"
                  name="line2"
                  value={this.state.address.line2 || ""}
                  onChange={this.handleAddressChange}
                />
              </label>

              <label htmlFor="zipcode">
                Código Postal{" "}
                <input
                  type="text"
                  className="form-control"
                  name="zipcode"
                  value={this.state.address.zipcode || ""}
                  onChange={this.handleAddressChange}
                />
              </label>

              <label htmlFor="city">
                Cidade{" "}
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  value={this.state.address.city || ""}
                  onChange={this.handleAddressChange}
                />
              </label>

              <label htmlFor="country">
                País{" "}
                <input
                  type="text"
                  className="form-control"
                  name="country"
                  value={this.state.address.country}
                  onChange={this.handleAddressChange}
                />
              </label>

              <span className="font-italic">
                *De momento envios são realidados apenas para Portugal.
              </span>
            </div>
            
            <div className="d-flex flex-column background-shadow">
              <h5 className="color-dark">Morada de faturação</h5>
              <label htmlFor="same-address">
                {" "}
                <input
                  type="checkbox"
                  name="same-address"
                  id="taxAddressCheck"
                  defaultValue="notChecked"
                  onClick={this.hideTaxAddress}
                />
                A morada de faturação é a mesma que a morada de entrega.
              </label>
              <div id="taxAddressUpdate" >
                <label htmlFor="taxAddress.line1">
                  Linha 1
                  <input
                    className="form-control"
                    type="text"
                    name="taxAddress.line1"
                    value={this.state.taxAddress.line1 || ""}
                    onChange={this.handleTaxAddressChange}
                  />
                </label>

                <label htmlFor="taxAddress.line2">
                  Linha 2{" "}
                  <input
                    className="form-control"
                    type="text"
                    name="taxAddress.line2"
                    value={this.state.taxAddress.line2 || ""}
                    onChange={this.handleTaxAddressChange}
                  />
                </label>

                <label htmlFor="taxAddress.zipcode">
                  Código Postal{" "}
                  <input
                    className="form-control"
                    type="text"
                    name="taxAddress.zipcode"
                    value={this.state.taxAddress.zipcode || ""}
                    onChange={this.handleTaxAddressChange}
                  />
                </label>

                <label htmlFor="taxAddress.city">
                  Cidade{" "}
                  <input
                    className="form-control"
                    type="text"
                    name="taxAddress.city"
                    value={this.state.taxAddress.city || ""}
                    onChange={this.handleTaxAddressChange}
                  />
                </label>

                <label htmlFor="taxAddress.country">
                  País
                  <input
                    className="form-control"
                    type="text"
                    name="taxAddress.country"
                    value={this.state.taxAddress.country}
                    onChange={this.handleTaxAddressChange}
                  />
                </label>
              </div>
            </div>
            
            </div>
            <div className="w-100 text-center">
            <button className="standard-button decrease-button-size-large-screen ">
              Atualizar
            </button>
            </div>
          </form>
        </div>

        <div className="w-100 d-flex flex-column flex-wrap align-items-center align-content-center mt-5 ">
          <div className="password-account-change text-center border-bege">
            <form
              onSubmit={this.handlePasswordSubmit}
              className="d-flex flex-column align-items-center"
            >
              <h3 className="color-bege">Atualizar a password</h3>
              <label htmlFor="password">
                Password atual{" "}
                <input
                  type="password"
                  name="password"
                  className="input"
                  onChange={this.handleInputChange}
                />
              </label>

              <label htmlFor="new_ password">
                Nova Password{" "}
                <input
                  type="password"
                  name="new_password"
                  onChange={this.handleInputChange}
                  className="input"
                />
              </label>

              <label htmlFor="confirm_password">
                Confirmação de Password{" "}
                <input
                  type="password"
                  name="confirm_password"
                  className="input"
                  onChange={this.handleInputChange}
                />
              </label>

              {passwordsDontMatch && (
                <span className="text-danger">
                  A nova password não coincide com a confirmação.
                </span>
              )}
              {passwordIsWrong && (
                <span className="text-danger">
                  A sua password está incorreta. Tente novamente.
                </span>
              )}
              {sessionTerminated && (
                <span className="text-danger">
                  A sua sessão expirou. Por favor, realize novamente o log-in.
                </span>
              )}
              {passwordUpdated && (
                <span className="text-success">
                  A sua password foi atualizada.
                </span>
              )}
              <button className="standard-button decrease-button-size-large-screen">
                Atualizar
              </button>
            </form>
          </div>

          <div className="password-account-change text-center">
            <Popup
              trigger={
                <button type="button" className="btn account-delete color-dark">
                  Gostaria de eliminar a minha conta de forma permanente
                </button>
              }
              modal
              contentStyle={{ padding: "1em", border: "5px solid white", borderRadius: "5px !important", width: "90%"}}
              className="delete-account-popup"
            >
              <div>
                <div>
                  <h3>Tem a certeza?</h3>
                  <p>
                    Ao clicar em "Eliminar conta" todos os seus dados, assim
                    como encomendas prévias, serão removidos da nossa base de
                    dados permanentemente.
                  </p>
                </div>
                <button className="standard-button" onClick={this.deleteUser}>
                  Eliminar conta
                </button>
              </div>
            </Popup>
          </div>
        </div>

      </div>
    );
  }
}
