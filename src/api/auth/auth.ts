import { NextApiRequest } from "next";
import admin from "firebase-admin";
import speakeasy, { GeneratedSecret } from "speakeasy";
import qrcode from "qrcode";
import serviceAccount from "../../../firebase-admin.json";
import { NextResponse } from "next/server";

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

const db = admin.firestore();

export default async function handler(req: NextApiRequest) {
  const { method } = req;

  if (method === "POST") {
    const { action, uid, token } = req.body;

    if (!uid)
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (action === "generate-qr") {
      // Generate a TOTP secret
      const secret: GeneratedSecret = speakeasy.generateSecret({ length: 20 });

      // Store secret in Firestore
      await userRef.set(
        {
          totpSecret: secret.base32,
          twoFAEnabled: false, // User hasn't verified OTP yet
        },
        { merge: true },
      );

      // Generate QR Code URL
      const otpauthUrl = secret.otpauth_url;

      if (!otpauthUrl) {
        return NextResponse.json(
          { error: "Failed to generate OTP Auth URL" },
          { status: 500 },
        );
      }

      // Generate QR Code
      qrcode.toDataURL(otpauthUrl, (err, qrCodeData) => {
        if (err)
          return NextResponse.json(
            { error: "QR code generation failed" },
            { status: 500 },
          );
        NextResponse.json(
          { qrCodeData, secret: secret.base32 },
          { status: 200 },
        );
      });
    } else if (action === "enable-2fa") {
      if (!token)
        return NextResponse.json({ error: "OTP is required" }, { status: 400 });

      const secret = userDoc.data()?.totpSecret;
      if (!secret)
        return NextResponse.json(
          { error: "2FA not set up yet" },
          { status: 400 },
        );

      const verified = speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token,
        window: 1,
      });

      if (verified) {
        await userRef.update({ twoFAEnabled: true });
        return NextResponse.json(
          { success: true, message: "2FA enabled!" },
          { status: 200 },
        );
      } else {
        return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
      }
    } else if (action === "verify-login-otp") {
      if (!token)
        return NextResponse.json({ error: "OTP is required" }, { status: 400 });

      const secret = userDoc.data()?.totpSecret;
      if (!secret)
        return NextResponse.json(
          { error: "2FA not set up yet" },
          { status: 400 },
        );

      const verified = speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token,
        window: 1,
      });

      if (verified) {
        return NextResponse.json(
          { success: true, message: "Login successful!" },
          { status: 200 },
        );
      } else {
        return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  }

  NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
