import React, { useState } from "react";

interface OrderFormProps {
  onSubmit: (orderData: {
    title: string;
    description: string;
    customerName: string;
    customerPhone: string;
    lat: string;
    lng: string;
  }) => Promise<void>;
  loading: boolean;
}

export const OrderForm: React.FC<OrderFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    customerName: "",
    customerPhone: "",
    lat: "",
    lng: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    // Reset form after successful submission
    setFormData({
      title: "",
      description: "",
      customerName: "",
      customerPhone: "",
      lat: "",
      lng: "",
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="card">
      <h2>Create New Order</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Customer Name</label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => handleChange("customerName", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Customer Phone</label>
            <input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => handleChange("customerPhone", e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Latitude *</label>
            <input
              type="number"
              step="any"
              value={formData.lat}
              onChange={(e) => handleChange("lat", e.target.value)}
              placeholder="40.7128"
              required
            />
          </div>
          <div className="form-group">
            <label>Longitude *</label>
            <input
              type="number"
              step="any"
              value={formData.lng}
              onChange={(e) => handleChange("lng", e.target.value)}
              placeholder="-74.0060"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          Create Order
        </button>
      </form>
    </div>
  );
};
