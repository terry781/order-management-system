import React from "react";
import { Order } from "../types";

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  onViewOrder: (orderId: number) => void;
  onAssignMaster: (orderId: number) => void;
  onCompleteOrder: (orderId: number) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  loading,
  onViewOrder,
  onAssignMaster,
  onCompleteOrder,
}) => {
  return (
    <div className="card">
      <h2>Orders</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Customer</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.title}</td>
              <td>
                <span className={`status-badge status-${order.status}`}>
                  {order.status}
                </span>
              </td>
              <td>{order.customerName || "N/A"}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: "12px", padding: "6px 12px" }}
                    onClick={() => onViewOrder(order.id)}
                  >
                    View
                  </button>
                  {order.status === "new" && (
                    <button
                      className="btn btn-warning"
                      style={{ fontSize: "12px", padding: "6px 12px" }}
                      onClick={() => onAssignMaster(order.id)}
                      disabled={loading}
                    >
                      Assign
                    </button>
                  )}
                  {(order.status === "assigned" ||
                    order.status === "inprogress") && (
                    <button
                      className="btn btn-success"
                      style={{ fontSize: "12px", padding: "6px 12px" }}
                      onClick={() => onCompleteOrder(order.id)}
                      disabled={loading}
                    >
                      Complete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
