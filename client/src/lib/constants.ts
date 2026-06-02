// ============================================================
// Application Constants
// ============================================================

/** API base URL */
export const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

/** Cloudinary config */
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

/** Razorpay config */
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

/** Pagination defaults */
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 50;

/** Map defaults (India center) */
export const DEFAULT_MAP_CENTER: [number, number] = [20.5937, 78.9629];
export const DEFAULT_MAP_ZOOM = 5;

/** File upload limits */
export const MAX_FILE_SIZE_MB = 5;
export const MAX_IMAGES_PER_SPOT = 10;

/** Date format */
export const DATE_FORMAT = 'dd MMM yyyy';
export const TIME_FORMAT = 'hh:mm a';
export const DATETIME_FORMAT = 'dd MMM yyyy, hh:mm a';
