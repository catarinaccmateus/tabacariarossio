import React, { Component } from "react";
import { forgotPassword as forgotPasswordService } from "../services/authentication";

class ForgotPassword extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      showError: false,
      messageFromServer: "",
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmission = this.handleSubmission.bind(this);
  }

  handleInputChange(event) {
    const nameOfState = event.target.name;
    const valueOfInput = event.target.value;
    this.setState({
      [nameOfState]: valueOfInput,
    });
  }

  async handleSubmission(event) {
    event.preventDefault();
    const user_email = this.state.email;

    await forgotPasswordService(user_email)
      .then((response) => {
        if (response.data === "No user with this email in DB.") {
          this.setState({
            showError: true,
            messageFromServer: "",
          });
        } else if (response.data === "Recovery email sent.") {
          this.setState({
            showError: false,
            messageFromServer: "recovery email sent",
          });
        }
      })
      .catch((error) => {
        if (error.response.data === "No user with this email in DB.") {
          this.setState({
            showError: true,
            messageFromServer: "",
          });
          console.log('Error',error);
        }});
  }

  render() {
    const { showError, messageFromServer } = this.state;
    return (
      <div className="center-container d-flex flex-column">
        <h3 className="color-bege mb-2">Recuperação de password</h3>
        <form onSubmit={this.handleSubmission} className="d-flex flex-column justify-content-center align-items-center">
        <label htmlFor="email">
          Insira o seu e-mail. Irá receber um e-mail com as indicações
          para a recuperação da sua password.
        </label>
          <input
            name="email"
            type="email"
            onChange={this.handleInputChange}
            required
            className="form-control"
          />
          <button className="standard-button w-50">Enviar</button>
          {messageFromServer && <div className="text-success">O e-mail foi enviado</div>}
          {showError && (
            <div className="text-danger">Este e-mail não se encontra na nossa base de dados</div>
          )}
        </form>
      </div>
    );
  }
}

export default ForgotPassword;
