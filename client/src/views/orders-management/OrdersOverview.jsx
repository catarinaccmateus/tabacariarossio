import React, { Component } from "react";
import { getAllOrders as getAllOrdersService } from "./../../services/orders";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

export class OrdersOverview extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      err: false,
    };
  }

  async componentDidMount() {
    this._isMounted = true;
    try {
      const orders = await getAllOrdersService();
      if (this._isMounted) {
      this.setState({
        orders: orders,
        err: false,
      });}
    } catch (err) {
      console.log(err);
      this.setState({
        err: true,
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { orders, err } = this.state;
    const columns = [
      {
        dataField: "_id",
        text: "Código",
        filter: textFilter(),
        events: {
          onClick: (e, column, columnIndex, row, rowIndex) => {
            this.props.history.push(`/orders-overview/${row._id}`);
          },
        },
      },
      {
        dataField: "creationDate",
        text: "Data",
        sort: true,
        filter: textFilter(),
      },
      {
        dataField: "user_id.name",
        text: "Nome",
        sort: true,
        filter: textFilter(),
      },
      {
        dataField: "user_id.surname",
        text: "Apelido",
        sort: true,
        filter: textFilter(),
      },
      {
        dataField: "total",
        text: "Total",
        sort: true,
        filter: textFilter(),
      },
      {
        dataField: "status",
        text: "Estado",
        sort: true,
        filter: textFilter(),
      },
      {
        dataField: "payment_method",
        text: "Método de pagamento",
        sort: true,
        filter: textFilter(),
      },
    ];
    return (
      <div className="main-container">
        <h2>Gestão de encomendas</h2>
        {orders.length > 0 ? (
          <div>
            <p>Tem {orders.length} pedidos de encomenda.</p>
            <BootstrapTable
              keyField="id"
              data={orders}
              columns={columns}
              filter={filterFactory()}
            />
          </div>
        ) : (
          <div>Não existem encomendas a reportar.</div>
        )}
        {err && (
          <div>
            Surgiu um erro no serviço. Por favor, contacte o serviço de
            manutenção informático para a sua resolução.
          </div>
        )}
      </div>
    );
  }
}

export default OrdersOverview;
