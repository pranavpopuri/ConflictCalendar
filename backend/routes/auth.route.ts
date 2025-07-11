import express from "express";
import {
    register,
    login,
    getMe,
    registerValidation,
    loginValidation,
    requestPasswordReset,
    resetPassword,
    passwordResetRequestValidation,
    passwordResetValidation,
    testEmail
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.post("/register", registerValidation, register);

router.post("/login", loginValidation, login);

router.get("/me", authenticate, getMe);

router.post("/request-password-reset", passwordResetRequestValidation, requestPasswordReset);

router.post("/reset-password", passwordResetValidation, resetPassword);

router.post("/test-email", testEmail);

export default router;
