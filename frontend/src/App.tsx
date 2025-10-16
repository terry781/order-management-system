import { useState, useEffect } from "react";
import { OrderForm } from "./components/OrderForm";
import { MastersList } from "./components/MastersList";
import { OrdersTable } from "./components/OrdersTable";
import { OrderDetails } from "./components/OrderDetails";
import { Alert } from "./components/Alert";
import { useOrders } from "./hooks/useApi";
import { useMasters } from "./hooks/useApi";

function App() {
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  // Custom hooks for API operations
  const {
    orders,
    selectedOrder,
    loading: ordersLoading,
    error: ordersError,
    loadOrders,
    loadOrderDetails,
    createOrder,
    assignMaster,
    attachADL,
    completeOrder,
    clearError: clearOrdersError,
  } = useOrders();

  const {
    masters,
    loading: mastersLoading,
    error: mastersError,
    loadMasters,
    clearError: clearMastersError,
  } = useMasters();

  // Load initial data
  useEffect(() => {
    loadOrders();
    loadMasters();
  }, [loadOrders, loadMasters]);

  // Handle errors from hooks
  useEffect(() => {
    if (ordersError) {
      setMessage({ type: "error", text: ordersError });
      clearOrdersError();
    }
  }, [ordersError, clearOrdersError]);

  useEffect(() => {
    if (mastersError) {
      setMessage({ type: "error", text: mastersError });
      clearMastersError();
    }
  }, [mastersError, clearMastersError]);

  // Event handlers
  const handleCreateOrder = async (orderData: any) => {
    const result = await createOrder({
      title: orderData.title,
      description: orderData.description,
      customerName: orderData.customerName || undefined,
      customerPhone: orderData.customerPhone || undefined,
      geo: {
        lat: parseFloat(orderData.lat),
        lng: parseFloat(orderData.lng),
      },
    });

    if (result) {
      setMessage({ type: "success", text: "Order created successfully!" });
    }
  };

  const handleAssignMaster = async (orderId: number) => {
    const result = await assignMaster(orderId);
    if (result) {
      setMessage({
        type: "success",
        text: `Master ${result.master.name} assigned!`,
      });
    }
  };

  const handleAttachADL = async (adlData: any) => {
    if (!selectedOrder) return;

    const result = await attachADL(selectedOrder.id, {
      type: adlData.type,
      url: adlData.url,
      gps: {
        lat: parseFloat(adlData.lat),
        lng: parseFloat(adlData.lng),
      },
      capturedAt: adlData.capturedAt,
    });

    if (result) {
      setMessage({ type: "success", text: "ADL media attached!" });
    }
  };

  const handleCompleteOrder = async (orderId: number) => {
    const result = await completeOrder(orderId);
    if (result) {
      setMessage({ type: "success", text: "Order completed!" });
    }
  };

  const handleViewOrder = async (orderId: number) => {
    await loadOrderDetails(orderId);
  };

  const clearMessage = () => setMessage(null);

  const loading = ordersLoading || mastersLoading;

  return (
    <div className="container">
      <div className="header">
        <h1>Order Management System</h1>
        <p>Master Assignment & ADL Enforcement</p>
      </div>

      {message && (
        <Alert
          type={message.type}
          message={message.text}
          onClose={clearMessage}
        />
      )}

      <div className="grid">
        <OrderForm onSubmit={handleCreateOrder} loading={loading} />
        <MastersList masters={masters} />
      </div>

      <OrdersTable
        orders={orders}
        loading={loading}
        onViewOrder={handleViewOrder}
        onAssignMaster={handleAssignMaster}
        onCompleteOrder={handleCompleteOrder}
      />

      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          loading={loading}
          onAttachADL={handleAttachADL}
        />
      )}
    </div>
  );
}

export default App;
