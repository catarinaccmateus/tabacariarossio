import React, { Component } from "react";
import { signUp as signUpService } from "../services/authentication";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      surname: "",
      password: "",
      confirmPassword: "",
      role: "user",
      email: "",
      commercial_agreement: false,
      duplicated_email: false,
      passwordsDontMatch: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmissionEvent = this.handleSubmissionEvent.bind(this);
    this.commercialAgreement = this.commercialAgreement.bind(this);
  }

  handleInputChange(event) {
    const nameOfState = event.target.name;
    const valueOfInput = event.target.value;
    this.setState({
      [nameOfState]: valueOfInput,
    });
  }

  commercialAgreement(e) {
    this.setState({
      commercial_agreement: e.target.checked,
    });
  }

  async handleSubmissionEvent(event) {
    event.preventDefault();
    const {
      name,
      surname,
      password,
      confirmPassword,
      email,
      role,
      commercial_agreement,
    } = this.state;
    if (confirmPassword === password) {
      try {
        const response = await signUpService({
          name,
          surname,
          password,
          role,
          commercial_agreement,
          email,
        });
        console.log("response", response);
        if (response.user !== undefined) {
          this.setState({
            duplicated_email: false,
            passwordsDontMatch: false,
          });
          this.props
            .loadUserInformation()
            .then(() => {
              this.props.handleModalOpen();
              this.props.history.push(`/private`);
            })
            .catch((err) => {
              console.log("Couldnt find this user's id due to", err);
              throw err;
            });
        } else {
          console.log("There was an error signing up", response.error);
          this.setState({
            duplicated_email: true,
            passwordsDontMatch: false,
          });
        }
      } catch (error) {
        console.log("Error when signing up", error);
        throw error;
      }
    } else {
      this.setState({
        passwordsDontMatch: true,
      });
    }
  }

  render() {
    const { passwordsDontMatch } = this.state;
    return (
      <Modal show={this.props.modalOpen} onHide={this.props.handleModalOpen}>
        <Modal.Header closeButton>
          <Modal.Title className="color-bege">Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            <form
              onSubmit={this.handleSubmissionEvent}
              className="d-flex flex-column justify-content-center"
            >
              <label htmlFor="input-name">Nome</label>
              <input
                type="text"
                id="input-name"
                name="name"
                placeholder="Nome"
                onChange={this.handleInputChange}
                value={this.state.name}
                className="form-control"
              />
              <label htmlFor="input-surname">Apelidos</label>
              <input
                type="text"
                id="input-surname"
                name="surname"
                placeholder="Apelidos"
                onChange={this.handleInputChange}
                value={this.state.username}
                className="form-control"
              />
              <label htmlFor="input-email">Email</label>
              <input
                type="email"
                id="input-email"
                name="email"
                placeholder="Email"
                onChange={this.handleInputChange}
                value={this.state.email}
                className="form-control"
              />
              {this.state.duplicated_email && (
                <span className="text-danger text-center">
                  Este e-mail já se encontra registado.
                </span>
              )}
              <label htmlFor="input-password">Password</label>
              <input
                type="password"
                name="password"
                id="input-password"
                placeholder="Escreva uma password"
                onChange={this.handleInputChange}
                value={this.state.password}
                className="form-control"
              />
              <label htmlFor="confirmPassword">Confirmação de password</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Repita a password"
                onChange={this.handleInputChange}
                value={this.state.confirmPassword}
                className="form-control"
              />
              {passwordsDontMatch && (
                <span className="text-danger text-center">As passwords têm que coincidir.</span>
              )}
              <label htmlFor="confirm_terms">
                <input type="checkbox" required id="confirm_terms" />
                Li e aceito a{" "}
                <Link to={"/terms-and-conditions"}>
                  política de privacidade.
                </Link>
              </label>

              <label htmlFor="confirm_comercial">
                <input
                  type="checkbox"
                  id="confirm_comercial"
                  name="confirm_comercial"
                  onChange={this.commercialAgreement}
                />
                Concordo em receber promoções e comunicações comerciais da
                Tabacaria Rossio.
              </label>

              <button className="standard-button">Sign Up</button>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={this.props.handleModalOpen}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
