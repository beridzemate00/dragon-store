"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    console.error("Unhandled error:", err);
    if (res.headersSent) {
        return;
    }
    const status = err.statusCode ?? 500;
    const message = err.message ?? "Server error";
    res.status(status).json({ message });
};
exports.errorHandler = errorHandler;
