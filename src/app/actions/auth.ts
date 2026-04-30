"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendOTPEmail, sendPasswordResetEmail } from "@/lib/mail";
import { redirect } from "next/navigation";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function signUp(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    if (!existingUser.emailVerified) {
      // Re-trigger verification flow
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      
      await prisma.user.update({
        where: { email },
        data: { otp, otpExpiry }
      });

      await sendOTPEmail(email, otp);
      redirect(`/auth/verify?email=${encodeURIComponent(email)}&resent=true`);
    }
    return { error: "User already exists" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        otp,
        otpExpiry,
      },
    });

    await sendOTPEmail(email, otp);
    
    // We don't use redirect() inside try-catch easily with state, 
    // but for simple flows it works.
  } catch (error: any) {
    console.error("Signup error:", error);
    return { error: error.message || "Something went wrong" };
  }

  redirect(`/auth/verify?email=${encodeURIComponent(email)}`);
}

export async function verifyOTP(formData: FormData) {
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;

  if (!email || !otp) {
    return { error: "OTP is required" };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.otp !== otp) {
    return { error: "Invalid OTP" };
  }

  if (user.otpExpiry && user.otpExpiry < new Date()) {
    return { error: "OTP has expired" };
  }

  await prisma.user.update({
    where: { email },
    data: {
      emailVerified: new Date(),
      otp: null,
      otpExpiry: null,
    },
  });

  redirect("/auth/signin?verified=true");
}

export async function resendOTP(email: string) {
  if (!email) return { error: "Email is required" };

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  try {
    await prisma.user.update({
      where: { email },
      data: { otp, otpExpiry },
    });

    await sendOTPEmail(email, otp);
    return { success: "OTP resent successfully" };
  } catch (error) {
    return { error: "Failed to resend OTP" };
  }
}

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) return { error: "Email is required" };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // For security, don't reveal if user exists or not
    return { success: "If an account exists, a reset code has been sent." };
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: {
      resetToken: otp,
      resetTokenExpiry: otpExpiry,
    },
  });

  await sendPasswordResetEmail(email, otp);
  
  redirect(`/auth/reset-password?email=${encodeURIComponent(email)}`);
}

export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;
  const newPassword = formData.get("password") as string;

  if (!email || !otp || !newPassword) {
    return { error: "All fields are required" };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.resetToken !== otp) {
    return { error: "Invalid OTP" };
  }

  if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
    return { error: "OTP has expired" };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  redirect("/auth/signin?reset=true");
}
