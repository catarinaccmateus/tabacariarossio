import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import { signOut as signOutService } from "./../services/authentication";
import { withRouter } from "react-router-dom";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "./../public/images/logo-removebg-preview (1).png";
import ShoppingCart from "./../public/images/logos/shopping-cart.png";
import SignInModal from "./SignIn";
import SignUpModal from "./SignUp";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signInModalOpen: false,
      signUpModalOpen: false,
    };
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleSignInModalOpen = this.handleSignInModalOpen.bind(this);
    this.handleSignUpModalOpen = this.handleSignUpModalOpen.bind(this);
  }

  handleSignInModalOpen() {
    this.setState({
      signInModalOpen: !this.state.signInModalOpen,
    });
  }

  handleSignUpModalOpen() {
    this.setState({
      signUpModalOpen: !this.state.signUpModalOpen,
    });
  }
  async handleSignOut() {
    try {
      await signOutService();
      this.props.loadUserInformation();
      this.props.history.push(`/`);
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }

  render() {
    const user = this.props.user;
    return (
      <Navbar
        collapseOnSelect
        expand="lg"
        variant="dark"
        sticky="top"
        id="navbar"
      >
        <Navbar.Brand as={Link} to={"/"} id="nav-brand">
          <img
            src={Logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          id="responsive-navbar-nav"
          className="justify-content-end"
        >
          <Nav className="mr-auto">
            <Nav.Link as={Link} to={"/store"} className="nav-link text-light">
              Loja
            </Nav.Link>

            {user && (user.role === "admin" || user.role === "employee") && (
              <Nav.Link
                as={Link}
                to={"/create"}
                className="nav-link text-light"
              >
                Adicionar artigos
              </Nav.Link>
            )}
            {user && (user.role === "admin" || user.role === "employee") && (
              <Nav.Link
                as={Link}
                to={"/store/management"}
                className="nav-link text-light"
              >
                Gestão de Artigos
              </Nav.Link>
            )}
            {user && (user.role === "admin" || user.role === "employee") && (
              <Nav.Link
                as={Link}
                to={"/orders-overview"}
                className="nav-link text-light"
              >
                Gestão de Encomendas
              </Nav.Link>
            )}
            {user && user.role === "admin" && (
              <Nav.Link
                as={Link}
                to={"/user-management"}
                className="nav-link text-light"
              >
                Gestão de usuários
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            {!user && (
              <Nav.Link
                onClick={this.handleSignUpModalOpen}
                className="nav-link text-light"
              >
                Sign-up
              </Nav.Link>
            )}
            {!user && (
              <Nav.Link
                onClick={this.handleSignInModalOpen}
                className="nav-link text-light"
              >
                Sign-in
              </Nav.Link>
            )}
            <Nav.Link as={Link} to={"/basket"} className="nav-link text-light">
              <img
                src={ShoppingCart}
                width="20"
                height="20"
                className="d-inline-block align-top"
              />{" "}
              Carrinho
            </Nav.Link>
            {user && (
              <NavDropdown
                title="Conta"
                id="collasible-nav-dropdown"
                drop="left"
              >
                <NavDropdown.Item as={Link} to={"/private"}>
                  Dados pessoais
                </NavDropdown.Item>

                <NavDropdown.Item as={Link} to={"/my-orders"}>
                  As minhas encomendas
                </NavDropdown.Item>
                <NavDropdown.Divider />

                <NavDropdown.Item>
                  <button onClick={this.handleSignOut} className="btn">
                    Sign out
                  </button>
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>

        <SignInModal
          {...this.props}
          modalOpen={this.state.signInModalOpen}
          handleModalOpen={this.handleSignInModalOpen}
          loadUserInformation={this.props.loadUserInformation}
        />
        <SignUpModal
          {...this.props}
          modalOpen={this.state.signUpModalOpen}
          handleModalOpen={this.handleSignUpModalOpen}
          loadUserInformation={this.props.loadUserInformation}
        />
      </Navbar>
    );
  }
}

export default withRouter(NavBar);
