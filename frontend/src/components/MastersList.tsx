import React from "react";
import { MasterWithLoad } from "../types";

interface MastersListProps {
  masters: MasterWithLoad[];
}

export const MastersList: React.FC<MastersListProps> = ({ masters }) => {
  return (
    <div className="card">
      <h2>Available Masters</h2>
      <div className="masters-grid">
        {masters.map((master) => (
          <div key={master.id} className="master-card">
            <h3>{master.name}</h3>
            <div className="master-info">
              <span className="rating">⭐ {master.rating.toFixed(1)}</span>
            </div>
            <div className="master-info">
              Status:{" "}
              <span
                className={master.isAvailable ? "available" : "unavailable"}
              >
                {master.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
            <div className="master-info">
              Active Orders: {master.activeOrders}
            </div>
            <div
              className="master-info"
              style={{ fontSize: "12px", color: "#999" }}
            >
              📍 {master.geo.lat.toFixed(4)}, {master.geo.lng.toFixed(4)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
