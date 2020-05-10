import React, { Component } from "react";
import { editUser as editUserService } from "./../services/authentication";
import { updatePassword as updatePasswordService } from "./../services/authentication";
import { deleteUser as deleteUserService } from "./../services/authentication";
import Popup from "reactjs-popup";

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
    let checkBox = document.getElementById("taxAddressCheck");
    var text = document.getElementById("taxAddressUpdate");
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

  commercialAgreement(e){
    this.setState({
      commercial_agreement: e.target.checked
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
      <div className="main-container d-flex flex-column">
        <div>
          <form
            onSubmit={this.handlePasswordSubmit}
            className="d-flex flex-column"
          >
            <h3>Atualizar a password</h3>
            <label htmlFor="password">Password atual</label>
            <input
              type="password"
              name="password"
              onChange={this.handleInputChange}
            />
            <label htmlFor="new_ password">Nova Password</label>
            <input
              type="password"
              name="new_password"
              onChange={this.handleInputChange}
            />
            <label htmlFor="confirm_password">Confirmação de Password</label>
            <input
              type="password"
              name="confirm_password"
              onChange={this.handleInputChange}
            />
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
            <button className="btn btn-success w-50 my-3">Atualizar</button>
          </form>
        </div>
        <div>
          <form
            onSubmit={this.handleSubmission}
            className="d-flex flex-column flex-wrap"
          >
            <h2>Os seus dados</h2>
            <h5>Dados Pessoais</h5>
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.handleInputChange}
            />
            <label htmlFor="surname">Apelidos</label>
            <input
              type="text"
              name="surname"
              value={this.state.surname}
              onChange={this.handleInputChange}
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={this.state.email}
              onChange={this.handleInputChange}
            />
            <label htmlFor="phoneNumber">Contacto telefónico</label>
            <input
              type="text"
              name="phoneNumber"
              value={this.state.phoneNumber || ""}
              onChange={this.handleInputChange}
            />
            <label htmlFor="taxNumber">Número Fiscal</label>
            <input
              type="number"
              name="taxNumber"
              value={this.state.taxNumber || ""}
              onChange={this.handleInputChange}
            />
            <label htmlFor="confirm_comercial">
              Concordo em receber promoções e comunicações comerciais Tabacaria
              Rossio.
            </label>
            <input
              type="checkbox"
              id="confirm_comercial"
              name="confirm_comercial"
              defaultChecked={this.state.commercial_agreement}
              onChange={this.commercialAgreement}
            />
            <h5>Morada de entrega</h5>
            <label htmlFor="line1">Linha 1</label>
            <input
              type="text"
              name="line1"
              value={this.state.address.line1 || ""}
              onChange={this.handleAddressChange}
            />
            <label htmlFor="line2">Linha 2</label>
            <input
              type="text"
              name="line2"
              value={this.state.address.line2 || ""}
              onChange={this.handleAddressChange}
            />
            <label htmlFor="zipcode">Código Postal</label>
            <input
              type="text"
              name="zipcode"
              value={this.state.address.zipcode || ""}
              onChange={this.handleAddressChange}
            />
            <label htmlFor="city">Cidade</label>
            <input
              type="text"
              name="city"
              value={this.state.address.city || ""}
              onChange={this.handleAddressChange}
            />
            <label htmlFor="country">País</label>
            <input
              type="text"
              name="country"
              value={this.state.address.country}
              onChange={this.handleAddressChange}
            />
            <br />
            <span>De momento envios são realidados apenas para Portugal.</span>
            <h5>Morada de faturação</h5>
            <label htmlFor="same-address">
              A morada de faturação é a mesma que a morada de entrega.
            </label>
            <input
              type="checkbox"
              name="same-address"
              id="taxAddressCheck"
              defaultValue="notChecked"
              onClick={this.hideTaxAddress}
            />
            <div id="taxAddressUpdate">
              <label htmlFor="taxAddress.line1">Linha 1</label>
              <input
                type="text"
                name="taxAddress.line1"
                value={this.state.taxAddress.line1 || ""}
                onChange={this.handleTaxAddressChange}
              />
              <label htmlFor="taxAddress.line2">Linha 2</label>
              <input
                type="text"
                name="taxAddress.line2"
                value={this.state.taxAddress.line2 || ""}
                onChange={this.handleTaxAddressChange}
              />
              <label htmlFor="taxAddress.zipcode">Código Postal</label>
              <input
                type="text"
                name="taxAddress.zipcode"
                value={this.state.taxAddress.zipcode || ""}
                onChange={this.handleTaxAddressChange}
              />
              <label htmlFor="taxAddress.city">Cidade</label>
              <input
                type="text"
                name="taxAddress.city"
                value={this.state.taxAddress.city || ""}
                onChange={this.handleTaxAddressChange}
              />
              <label htmlFor="taxAddress.country">País</label>
              <input
                type="text"
                name="taxAddress.country"
                value={this.state.taxAddress.country}
                onChange={this.handleTaxAddressChange}
              />
            </div>
            <br />
            <button className="btn btn-success w-50">Atualizar</button>
          </form>
          <Popup
            trigger={
              <button type="button" className="btn btn-danger">
                Eliminar a minha conta
              </button>
            }
            modal
          >
            <div>
              <div>
                <h3>Tem a certeza?</h3>
                <p>
                  Ao clicar em "Eliminar conta" todos os seus dados, assim como
                  encomendas prévias, serão removidos da nossa base de dados
                  permanentemente.
                </p>
              </div>
              <button className="btn btn-danger" onClick={this.deleteUser}>
                Eliminar
              </button>
            </div>
          </Popup>
        </div>
      </div>
    );
  }
}
