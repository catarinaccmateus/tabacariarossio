import React, { Component } from "react";
import { signUp as signUpService } from "../../services/authentication";

export class AddEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      surname: "",
      password: "",
      role: "employee",
      confirmPassword: "",
      email: "",
      commercial_agreeement: "false",
      duplicated_email: false,
      passwordsDontMatch: false,
      reload: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmissionEvent = this.handleSubmissionEvent.bind(this);
  }

  handleInputChange(event) {
    const nameOfState = event.target.name;
    const valueOfInput = event.target.value;
    this.setState({
      [nameOfState]: valueOfInput,
    });
  }

  async handleSubmissionEvent(event) {
    event.preventDefault();
    const {
      name,
      surname,
      password,
      confirmPassword,
      commercial_agreeement,
      email,
      role,
    } = this.state;
    if (confirmPassword === password) {
      try {
        const response = await signUpService({
          name,
          surname,
          password,
          email,
          commercial_agreeement,
          role,
        });
        console.log(response);
        if (response.user !== undefined) {
          this.setState({
            duplicated_email: false,
            passwordsDontMatch: false,
          });
          this.setState({
            name: "",
            surname: "",
            password: "",
            confirmPassword: "",
            email: "",
          });
          this.props.updateUsers();
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
      <div className="">
        <div className="add-user-modal">
          <form onSubmit={this.handleSubmissionEvent} className="form w-100 d-flex flex-column">
            <h3 className="color-bege">Adicionar empregado</h3>
            <label htmlFor="input-name">Nome <input
              type="text"
              id="input-name"
              name="name"
              placeholder="Your Name"
              onChange={this.handleInputChange}
              value={this.state.name}
              className="form-control"
            /></label>
           
            <label htmlFor="input-surname">Apelido <input
            className="form-control"
              type="text"
              id="input-surname"
              name="surname"
              placeholder="Your Surname"
              onChange={this.handleInputChange}
              value={this.state.surname}
            /></label>
           
            <label htmlFor="input-email">Email <input
            className="form-control"
              type="email"
              id="input-email"
              name="email"
              placeholder="Your Email"
              onChange={this.handleInputChange}
              value={this.state.email}
            /></label>
           
            {this.state.duplicated_email && (
              <span className="text-danger">
                Este e-mail já se encontra registado.
              </span>
            )}
            <label htmlFor="input-password">Password  <input
            className="form-control"
              type="password"
              name="password"
              id="input-password"
              placeholder="Escreva uma password"
              onChange={this.handleInputChange}
              value={this.state.password}
            /></label>
          
            <label htmlFor="confirmPassword">Password <input
            className="form-control"
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Repita a password"
              onChange={this.handleInputChange}
              value={this.state.confirmPassword}
            /></label>
           
            {passwordsDontMatch && <span>As passwords têm que coincidir.</span>}
            <button className="standard-button">Adicionar</button>
          </form>
        </div>
      </div>
    );
  }
}

export default AddEmployee;
