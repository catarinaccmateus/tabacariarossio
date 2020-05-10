import React, { Component } from "react";
import { signIn as signInService } from "../services/authentication";
import Popup from "reactjs-popup";
import ForgotPassword from './ForgotPassword';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      open: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  
  handleInputChange(event) {
    const nameOfState = event.target.name;
    const valueOfInput = event.target.value;
    this.setState({
      [nameOfState]: valueOfInput
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    try {
      await signInService(this.state);
      this.props
        .loadUserInformation()
        .then(() => {
          console.log('succesfully logged in');
          this.props.handleModalOpen();
          this.props.history.push(`/basket-confirmation`);
        })
        .catch(err => {
          console.log("not possible to log in due to ", err);
        });
    } catch (error) {
      console.log('not succesfully logged in', error);
      this.setState({
        error_sign_in: true
      });
      throw error;
    }
  }

  openModal() {
    this.setState({ open: true });
  }
  
  closeModal() {
    this.setState({ open: false });
  }

  render() {
    return (
      <Modal show={this.props.modalOpen} onHide={this.props.handleModalOpen}>
              <Modal.Header closeButton>
                 <Modal.Title className="color-bege">Sign In</Modal.Title>
              </Modal.Header>
              <Modal.Body>
        <div className="">
          <form
            onSubmit={this.handleSubmit}
            className="d-flex flex-column justify-content-center align-items-center"
          >
            <label htmlFor="input-email">Email</label>
            <input
              type="email"
              id="input-email"
              name="email"
              placeholder="O seu Email"
              className="form-control"
              onChange={this.handleInputChange}
              value={this.state.email}
            />
            <label htmlFor="input-password">Password</label>
            <input
              type="password"
              name="password"
              id="input-password"
              placeholder="Password"
              className="form-control"
              onChange={this.handleInputChange}
              value={this.state.password}
            />
            {this.state.error_sign_in && (
              <span className="text-danger">E-mail ou password incorretos</span>
            )}
            <button className="standard-button">Sign In</button>
          </form>
          <button type="button" className="btn" onClick={this.openModal}> *Recuperar palavra passe</button>
          <Popup
            position="top"
            contentStyle={{ padding: "5px", border: "5px solid white", "width": "90%"}}
            open={this.state.open}
            closeOnDocumentClick
            onClose={this.closeModal}
            >
            <div>
            <ForgotPassword />
            </div>
          </Popup>
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
