import React, { Component } from "react";
import { signUp as signUpService } from "../../services/authentication";
import { Redirect } from "react-router-dom";

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
        <div className="">
          <form onSubmit={this.handleSubmissionEvent} className="form w-100">
            <h3>Adicionar empregado</h3>
            <label htmlFor="input-name">Name</label>
            <input
              type="text"
              id="input-name"
              name="name"
              placeholder="Your Name"
              onChange={this.handleInputChange}
              value={this.state.name}
            />
            <label htmlFor="input-surname">Surname</label>
            <input
              type="text"
              id="input-surname"
              name="surname"
              placeholder="Your Surname"
              onChange={this.handleInputChange}
              value={this.state.surname}
            />
            <label htmlFor="input-email">Email</label>
            <input
              type="email"
              id="input-email"
              name="email"
              placeholder="Your Email"
              onChange={this.handleInputChange}
              value={this.state.email}
            />
            {this.state.duplicated_email && (
              <span className="text-danger">
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
            />
            <label htmlFor="confirmPassword">Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Repita a password"
              onChange={this.handleInputChange}
              value={this.state.confirmPassword}
            />
            {passwordsDontMatch && <span>As passwords têm que coincidir.</span>}
            <button>Adicionar</button>
          </form>
        </div>
      </div>
    );
  }
}

export default AddEmployee;
