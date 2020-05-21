import React, { Component } from "react";
import { Link } from "react-router-dom";
import {getAllOrdersPerUser as getAllOrdersPerUserService} from "./../../services/orders";
import "./MyOrders.css"

export class MyOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
    };
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
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
      <div className="main-container margin-responsive">
        <h2 className="color-bege"> As minhas encomendas</h2>
        {isThereOrders > 0 ? (
          <div> 
          <p className="text-center"><b>Número de encomenda/s realizada/s:</b> {isThereOrders}</p>
          <table className="table table-striped ">
            <thead>
              <th className="align-middle text-center color-bege">Código de encomenda</th>
              <th className="align-middle text-center color-bege">Data</th>
              <th className="align-middle text-center color-bege">Total</th>
              <th className="align-middle text-center color-bege">Estado</th>
            </thead>
            <tbody>
              {orders.map(order => <tr>
                <td className="align-middle text-center"><Link to={`/order-confirmed/${order._id}` } className="reduced-text-size color-dark font-weight-bold">{order._id.slice(0,12)} {order._id.slice(12)}</Link></td>
                <td className="align-middle text-center">{order.creationDate.slice(0, 10)}, {order.creationDate.slice(11, 16)}</td>
                <td className="align-middle text-center">{order.total} €</td>
                <td className="align-middle text-center text-capitalize">{order.status}</td>
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
