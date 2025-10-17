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
      <div style={{ 
        marginBottom: "15px", 
        padding: "10px", 
        backgroundColor: "#e3f2fd", 
        borderRadius: "4px",
        fontSize: "12px",
        color: "#1976d2"
      }}>
        <strong>📋 Order Workflow:</strong> New → Assign Master → In Progress → Complete (requires ADL evidence)
      </div>
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
            <tr 
              key={order.id}
              style={{ 
                cursor: "pointer",
                transition: "background-color 0.2s ease"
              }}
              onClick={() => onViewOrder(order.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f8f9fa";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "";
              }}
              title="Click to view order details"
            >
              <td>{order.id}</td>
              <td>{order.title}</td>
              <td>
                <span 
                  className={`status-badge status-${order.status}`}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    backgroundColor: 
                      order.status === "new" ? "#e3f2fd" :
                      order.status === "assigned" ? "#fff3e0" :
                      order.status === "inprogress" ? "#f3e5f5" :
                      order.status === "completed" ? "#e8f5e8" :
                      order.status === "rejected" ? "#ffebee" : "#f5f5f5",
                    color: 
                      order.status === "new" ? "#1976d2" :
                      order.status === "assigned" ? "#f57c00" :
                      order.status === "inprogress" ? "#7b1fa2" :
                      order.status === "completed" ? "#388e3c" :
                      order.status === "rejected" ? "#d32f2f" : "#666"
                  }}
                >
                  {order.status === "new" && "🆕 New"}
                  {order.status === "assigned" && "👷 Assigned"}
                  {order.status === "inprogress" && "🔄 In Progress"}
                  {order.status === "completed" && "✅ Completed"}
                  {order.status === "rejected" && "❌ Rejected"}
                </span>
              </td>
              <td>{order.customerName || "N/A"}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {order.status === "new" && (
                    <button
                      className="btn btn-warning"
                      style={{ 
                        fontSize: "12px", 
                        padding: "8px 12px",
                        borderRadius: "4px",
                        border: "1px solid #ffc107",
                        backgroundColor: "#ffc107",
                        color: "#212529",
                        cursor: "pointer"
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAssignMaster(order.id);
                      }}
                      disabled={loading}
                      title="Assign an available master to this order"
                    >
                      👷 Assign Master
                    </button>
                  )}
                  {(order.status === "assigned" ||
                    order.status === "inprogress") && (
                    <button
                      className="btn btn-success"
                      style={{ 
                        fontSize: "12px", 
                        padding: "8px 12px",
                        borderRadius: "4px",
                        border: "1px solid #28a745",
                        backgroundColor: "#28a745",
                        color: "white",
                        cursor: "pointer"
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onCompleteOrder(order.id);
                      }}
                      disabled={loading}
                      title="Complete this order (requires ADL evidence)"
                    >
                      ✅ Complete Order
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
