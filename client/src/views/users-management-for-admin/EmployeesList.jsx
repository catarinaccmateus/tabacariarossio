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
      <div className="main-container d-flex flex-column m-5">
       
          <h3 className="color-bege mb-3">Lista de atuais empregados</h3>
          <div className="d-flex flex-column align-items-center">
          {users.length > 0 ? (
            <ul className="w-100">
              {users.map((user) => (
                <li key={user._id} className="m-2">
                  {user.name} {user.surname} {user.email}
                  <br/>
                  <button
                    className="btn btn-danger m-1"
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
          <Popup
          trigger={<button className="standard-button w-50"> Adicionar novo empregado</button>}
          modal
          closeOnDocumentClick
          contentStyle={{borderRadius: "15px", width: "80%"}}
        >
          <AddEmployee updateUsers={this.showUsers} />
        </Popup>
        </div>
      </div>
    );
  }
}
