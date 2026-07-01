import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = { title: "Forgot password — Valeris CRM" };

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
