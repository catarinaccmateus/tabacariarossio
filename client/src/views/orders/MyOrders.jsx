import React, { Component } from "react";
import { Link } from "react-router-dom";
import {getAllOrdersPerUser as getAllOrdersPerUserService} from "./../../services/orders";

export class MyOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
    };
  }

  async componentDidMount() {
    const user = this.props.user;
    try {
      const orders = await getAllOrdersPerUserService(user._id);
      this.setState({
        orders: orders
      })
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const orders = this.state.orders;
    const isThereOrders = orders.length;
    return (
      <div className="main-container">
        <h2> As minhas encomendas</h2>
        {isThereOrders > 0 ? (
          <div> 
          <p>Tenho {isThereOrders} encomenda/s. </p>
          <table className="table table-striped">
            <thead>
              <th>Código de encomenda</th>
              <th>Data</th>
              <th>Total</th>
              <th>Estado</th>
            </thead>
            <tbody>
              {orders.map(order => <tr>
                <td><Link to={`/order-confirmed/${order._id}`}>{order._id}</Link></td>
                <td>{order.creationDate}</td>
                <td>{order.total}</td>
                <td>{order.status}</td>
              </tr>)}
            </tbody>
          </table>
          </div>
        ) : (
          <div>
            Ainda não realizou encomendas. Veja a nossa{" "}
            <Link to={"/store"}>loja</Link>
          </div>
        )}
      </div>
    );
  }
}

export default MyOrders;
