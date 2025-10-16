import { Request, Response, NextFunction } from "express";
import { CreateOrderRequest, AttachADLRequest } from "../types";

/**
 * Validation middleware for order creation
 */
export function validateCreateOrder(req: Request, res: Response, next: NextFunction): void {
  const { title, description, geo, customerName, customerPhone } = req.body;

  const errors: string[] = [];

  // Required fields
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    errors.push("Title is required and must be a non-empty string");
  }

  if (!description || typeof description !== "string" || description.trim().length === 0) {
    errors.push("Description is required and must be a non-empty string");
  }

  // Geo validation
  if (!geo || typeof geo !== "object") {
    errors.push("Geo coordinates are required");
  } else {
    if (typeof geo.lat !== "number" || geo.lat < -90 || geo.lat > 90) {
      errors.push("Valid latitude (-90 to 90) is required");
    }
    if (typeof geo.lng !== "number" || geo.lng < -180 || geo.lng > 180) {
      errors.push("Valid longitude (-180 to 180) is required");
    }
  }

  // Optional fields validation
  if (customerName && (typeof customerName !== "string" || customerName.trim().length === 0)) {
    errors.push("Customer name must be a non-empty string if provided");
  }

  if (customerPhone && (typeof customerPhone !== "string" || customerPhone.trim().length === 0)) {
    errors.push("Customer phone must be a non-empty string if provided");
  }

  if (errors.length > 0) {
    res.status(400).json({
      error: "Validation failed",
      details: errors,
    });
    return;
  }

  // Sanitize and set validated data
  req.body = {
    title: title.trim(),
    description: description.trim(),
    geo: {
      lat: Number(geo.lat),
      lng: Number(geo.lng),
    },
    customerName: customerName?.trim() || undefined,
    customerPhone: customerPhone?.trim() || undefined,
  } as CreateOrderRequest;

  next();
}

/**
 * Validation middleware for ADL attachment
 */
export function validateAttachADL(req: Request, res: Response, next: NextFunction): void {
  const { type, url, gps, capturedAt, meta } = req.body;

  const errors: string[] = [];

  // Type validation
  if (!type || !["photo", "video"].includes(type)) {
    errors.push("Type must be either 'photo' or 'video'");
  }

  // URL validation
  if (!url || typeof url !== "string" || url.trim().length === 0) {
    errors.push("URL is required and must be a non-empty string");
  } else {
    // Basic URL validation
    try {
      new URL(url.trim());
    } catch {
      errors.push("URL must be a valid URL format");
    }
  }

  // GPS validation
  if (!gps || typeof gps !== "object") {
    errors.push("GPS coordinates are required");
  } else {
    if (typeof gps.lat !== "number" || gps.lat < -90 || gps.lat > 90) {
      errors.push("Valid latitude (-90 to 90) is required");
    }
    if (typeof gps.lng !== "number" || gps.lng < -180 || gps.lng > 180) {
      errors.push("Valid longitude (-180 to 180) is required");
    }
  }

  // Timestamp validation
  if (!capturedAt || typeof capturedAt !== "string") {
    errors.push("Captured timestamp is required");
  } else {
    const date = new Date(capturedAt);
    if (isNaN(date.getTime())) {
      errors.push("Captured timestamp must be a valid ISO date string");
    }
  }

  // Meta validation (optional)
  if (meta && (typeof meta !== "object" || Array.isArray(meta))) {
    errors.push("Meta must be an object if provided");
  }

  if (errors.length > 0) {
    res.status(400).json({
      error: "Validation failed",
      details: errors,
    });
    return;
  }

  // Sanitize and set validated data
  req.body = {
    type,
    url: url.trim(),
    gps: {
      lat: Number(gps.lat),
      lng: Number(gps.lng),
    },
    capturedAt,
    meta: meta || {},
  } as AttachADLRequest;

  next();
}

/**
 * Validation middleware for ID parameters
 */
export function validateIdParam(req: Request, res: Response, next: NextFunction): void {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0) {
    res.status(400).json({
      error: "Invalid ID parameter",
      details: "ID must be a positive integer",
    });
    return;
  }

  req.params.id = id.toString();
  next();
}
