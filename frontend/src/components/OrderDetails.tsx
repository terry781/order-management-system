import React, { useState } from "react";
import { OrderWithDetails, ADLMedia } from "../types";

interface OrderDetailsProps {
  order: OrderWithDetails;
  loading: boolean;
  onAttachADL: (adlData: {
    type: string;
    url: string;
    lat: string;
    lng: string;
    capturedAt: string;
  }) => Promise<void>;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({
  order,
  loading,
  onAttachADL,
}) => {
  const [adlForm, setAdlForm] = useState({
    type: "photo",
    url: "",
    lat: "",
    lng: "",
    capturedAt: new Date().toISOString(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAttachADL(adlForm);
    setAdlForm({
      type: "photo",
      url: "",
      lat: "",
      lng: "",
      capturedAt: new Date().toISOString(),
    });
  };

  const handleChange = (field: string, value: string) => {
    setAdlForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="card" style={{ 
      border: "2px solid #007bff",
      backgroundColor: "#f8f9ff"
    }}>
      <h2 style={{ color: "#007bff" }}>
        📋 Order Details - #{order.id}
        <span style={{ 
          fontSize: "12px", 
          fontWeight: "normal", 
          color: "#666",
          marginLeft: "10px"
        }}>
          (Click another order row to view different details)
        </span>
      </h2>

      <div className="order-details">
        <div className="detail-row">
          <div className="detail-label">Title:</div>
          <div className="detail-value">{order.title}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Description:</div>
          <div className="detail-value">{order.description}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Status:</div>
          <div className="detail-value">
            <span className={`status-badge status-${order.status}`}>
              {order.status}
            </span>
          </div>
        </div>
        {order.master && (
          <div className="detail-row">
            <div className="detail-label">Assigned Master:</div>
            <div className="detail-value">
              {order.master.name} (Rating: {order.master.rating})
            </div>
          </div>
        )}
        <div className="detail-row">
          <div className="detail-label">Location:</div>
          <div className="detail-value">
            {order.geo.lat.toFixed(4)}, {order.geo.lng.toFixed(4)}
          </div>
        </div>
      </div>

      {/* ADL Media */}
      <h3 style={{ marginTop: "20px", marginBottom: "10px", color: "#333" }}>
        📸 ADL Evidence (After Delivery Live)
      </h3>
      <p style={{ fontSize: "12px", color: "#666", marginBottom: "15px" }}>
        ADL evidence is required to complete orders. Must include GPS coordinates and timestamp.
      </p>
      {order.adlMedia && order.adlMedia.length > 0 ? (
        <div>
          {order.adlMedia.map((adl: ADLMedia) => (
            <div
              key={adl.id}
              style={{
                padding: "10px",
                background: "#f8f9fa",
                marginBottom: "10px",
                borderRadius: "4px",
              }}
            >
              <strong>{adl.type.toUpperCase()}</strong> - {adl.url}
              <br />
              GPS: {adl.gps.lat.toFixed(4)}, {adl.gps.lng.toFixed(4)}
              <br />
              Captured: {new Date(adl.capturedAt).toLocaleString()}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ 
          padding: "15px", 
          backgroundColor: "#fff3cd", 
          border: "1px solid #ffeaa7",
          borderRadius: "4px",
          color: "#856404"
        }}>
          ⚠️ <strong>No ADL evidence attached yet</strong><br/>
          <small>You must attach ADL evidence before completing this order.</small>
        </div>
      )}

      {/* Add ADL Form */}
      {order.status !== "completed" && order.status !== "rejected" && (
        <>
          <h3 style={{ marginTop: "20px", marginBottom: "10px" }}>
            Attach ADL Evidence
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Type</label>
                <select
                  value={adlForm.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                >
                  <option value="photo">Photo</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div className="form-group">
                <label>URL/Path *</label>
                <input
                  type="text"
                  value={adlForm.url}
                  onChange={(e) => handleChange("url", e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>GPS Latitude *</label>
                <input
                  type="number"
                  step="any"
                  value={adlForm.lat}
                  onChange={(e) => handleChange("lat", e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>GPS Longitude *</label>
                <input
                  type="number"
                  step="any"
                  value={adlForm.lng}
                  onChange={(e) => handleChange("lng", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Captured At (ISO) *</label>
              <input
                type="datetime-local"
                value={adlForm.capturedAt.substring(0, 16)}
                onChange={(e) =>
                  handleChange(
                    "capturedAt",
                    new Date(e.target.value).toISOString()
                  )
                }
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "bold",
                borderRadius: "6px",
                border: "1px solid #007bff",
                backgroundColor: "#007bff",
                color: "white",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1
              }}
              title="Attach After Delivery Live (ADL) evidence with GPS coordinates and timestamp"
            >
              📸 Attach ADL Evidence
            </button>
          </form>
        </>
      )}
    </div>
  );
};
