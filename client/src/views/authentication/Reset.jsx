import React, { Component } from "react";
import { resetPassword as resetService } from "./../../services/authentication";
import { updatePasswordViaEmail as updatePasswordViaEmailService } from "./../../services/authentication";
import Popup from "reactjs-popup";
import ForgotPassword from "./../../components/ForgotPassword";
import { Link } from "react-router-dom";

export class Reset extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      update: false,
      isLoading: true,
      error: false,
      passwordsDontMatch: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }

  async componentDidMount() {
    const resetPasswordToken = this.props.match.params.token;
    await resetService(resetPasswordToken)
      .then((response) => {
        if (response.data.message === "Password Reset Link ok") {
          this.setState({
            email: response.data.email,
            update: false,
            isLoading: false,
            error: false,
          });
        } else {
          this.setState({
            update: false,
            isLoading: false,
            error: true,
          });
        }
      })
      .catch((error) => {
        console.log("There was an error", error, error.data);
      });
  }

  handleChange(event) {
    const nameOfState = event.target.name;
    const valueOfInput = event.target.value;
    this.setState({
      [nameOfState]: valueOfInput,
    });
  }

  async updatePassword(event) {
    event.preventDefault();
    const password = this.state.password;
    const confirmPassword = this.state.confirmPassword;
    const resetPasswordToken = this.props.match.params.token;
    if (password === confirmPassword) {
      await updatePasswordViaEmailService({
        email: this.state.email,
        password: this.state.password,
        resetPasswordToken,
      })
        .then((response) => {
          if (response.data.message === "Password updated") {
            this.setState({
              update: true,
              error: false,
              passwordsDontMatch: false,
            });
          } else {
            this.setState({
              update: false,
              error: true,
            });
          }
        })
        .catch((error) => {
          console.log("Couldnt update password due to ", error);
        });
    } else {
      this.setState({
        passwordsDontMatch: true,
      });
    }
  }

  render() {
    const {
      email,
      password,
      confirmPassword,
      error,
      isLoading,
      update,
      passwordsDontMatch,
    } = this.state;
    if (error) {
      return (
        <div className="main-container center-container d-flex flex-column">
         <h2 className="color-bege text-center mb-3">
              Ups!
            </h2>
          <div className="text-center">
            Surgiu um problema no reset da password. <br/> O link fornecido poderá ter
            passado do prazo. <br /> Por favor, clique no seguinte botão para que reenviemos um novo link.
          </div>
          <Popup
            trigger={<button className="standard-button">Enviar novo Link</button>}
            position="center"
            contentStyle={{
              padding: "5px",
              border: "5px solid white",
              width: "50%",
            }}
            closeOnDocumentClick
          >
            <div>
              <ForgotPassword />
            </div>
          </Popup>
        </div>
      );
    } else if (isLoading) {
      return <div>Loading... </div>;
    } else {
      return (
        <div>
          <form
            className="d-flex flex-column justify-content-center align-items-center main-container m-4"
            onSubmit={this.updatePassword}
          >
            <h3 className="color-bege text-center mb-3">
              Alteração de Password
            </h3>
            <label htmlFor="email">O seu e-mail</label>
            <input
              type="email"
              name="email"
              onChange={this.handleChange}
              value={email}
              className="form-control mb-3"
            />
            <label htmlFor="password">Nova password</label>
            <input
              type="password"
              name="password"
              onChange={this.handleChange}
              value={password}
              className="form-control mb-3"
            />
            <label htmlFor="confirmPassword">Confirmação da password</label>
            <input
              type="password"
              name="confirmPassword"
              onChange={this.handleChange}
              value={confirmPassword}
              className="form-control mb-3"
            />
            <button className="standard-button w-50">Alterar password</button>
            {passwordsDontMatch && (
              <div className="text-danger">As passwords não coincidem.</div>
            )}
            {update && (
              <div className="text-success text-center">
                A sua password foi atualizada com sucesso.
                <br />
                Por favor, realize o seu log in.
              </div>
            )}
          </form>
        </div>
      );
    }
  }
}

export default Reset;
