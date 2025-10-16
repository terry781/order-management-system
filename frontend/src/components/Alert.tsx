import React from "react";

interface AlertProps {
  type: "success" | "error" | "info";
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  return (
    <div className={`alert alert-${type}`}>
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
            marginLeft: "10px",
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};
