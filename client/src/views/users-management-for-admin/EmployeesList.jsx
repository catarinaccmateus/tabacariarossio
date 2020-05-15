import React, { Component } from "react";
import { AddEmployee } from "./AddEmployee";
import Popup from "reactjs-popup";
import { getEmployeeUsers as getEmployeeUsersService } from "./../../services/authentication";
import { deleteUser as deleteUserService } from "./../../services/authentication";

export default class EmployeesList extends Component {
  _isMounted = false;

  constructor() {
    super();
    this.state = {
      users: [],
    };
    this.showUsers = this.showUsers.bind(this);
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    this._isMounted = true;
    this.showUsers();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async deleteUser(e, user_id) {
    try {
      await deleteUserService(user_id);
      this.showUsers();
    } catch (err) {
      console.log(err);
    }
  }

  async showUsers() {
    const response = await getEmployeeUsersService();
    if (this._isMounted) {
      this.setState({
        users: response.data.users,
      });
    }
  }

  render() {
    const users = this.state.users;
    return (
      <div className="main-container center-container d-flex flex-column">
        <Popup
          trigger={<button> Adicionar novo empregado</button>}
          modal
          closeOnDocumentClick
        >
          <AddEmployee updateUsers={this.showUsers} />
        </Popup>
        <div>
          <h3>Lista de empregados</h3>
          {users.length > 0 ? (
            <ul>
              {users.map((user) => (
                <li key={user._id}>
                  {user.name} {user.surname} {user.email}{" "}
                  <button
                    className="btn"
                    type="button"
                    onClick={(e) => this.deleteUser(e, user._id)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div>Ainda não tem usuários</div>
          )}
        </div>
      </div>
    );
  }
}
