"use client";

import { Loader } from "@/components/app_components/app_loader/__loader";
import LiquidBlob from "@/components/app_components/blobs/liquid-blob";
import { Button } from "@/components/ui/button";
import { loginSchema } from "@/lib/zod_schemas";
import { useFirebaseStore } from "@/store/firebase_firestore";
import {
  IconEyeClosed,
  IconBrandGoogle,
  IconBrandGithub,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { ArrowLeft, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

const SignInPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isItSignIn, setIsItSignIn] = useState(true);
  const [signingWith, setSigningWith] = useState<
    "google" | "github" | "pass" | null
  >(null);
  const { google_sign_in, github_sign_in, email_sign_in, email_sign_up } =
    useFirebaseStore();

  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    setFocus("email"); // Focus the email input on first render
  }, [setFocus]);

  const handleAuth = async (
    provider: "google" | "github" | "pass" | "sign_up",
    formData?: { email: string; password: string } | FieldValues,
  ) => {
    setLoading(true);
    try {
      let result;

      switch (provider) {
        case "google":
          setSigningWith("google");
          result = await google_sign_in();
          setSigningWith(null);
          break;
        case "github":
          setSigningWith("github");
          result = await github_sign_in();
          setSigningWith(null);
          break;
        case "pass":
          if (!formData?.email || !formData?.password) {
            toast.error("Email and Password are required");
            return;
          }
          console.log(formData);
          setSigningWith("pass");
          result = await email_sign_in(formData.email, formData.password);
          if (!result.success) {
            toast.error(result.message);
            return;
          }
          setSigningWith(null);
          reset();
          break;
        case "sign_up":
          if (!formData?.email || !formData?.password) {
            toast.error("Email and Password are required");
            return;
          }
          console.log(formData);
          setSigningWith("pass");
          result = await email_sign_up(formData.email, formData.password);
          if (!result.success) {
            toast.error(result.message);
            return;
          }
          setSigningWith(null);
          reset();
          break;
        default:
          throw new Error("Invalid provider");
      }

      router.push(result.is_onboarded ? "/user/dashboard" : "/user/onboarding");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-900 w-full overflow-hidden flex">
      <div className="absolute inset-0 flex items-center justify-center">
        <LiquidBlob />
      </div>
      <div className="min-h-screen w-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md mx-3 rounded-3xl"
        >
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/10 p-4 md:p-6 rounded-3xl shadow-2xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight font-mono text-blue-500">
                  dev
                  <span className="text-white font-playwrite font-light">
                    Nexus
                  </span>
                </h1>
                <p className="text-gray-400">
                  Welcome Back to the Developer&#39;s Hub
                </p>
                <div className="flex gap-2 justify-center">
                  <p className="text-gray-400">
                    {isItSignIn
                      ? `Doesn't have an account?`
                      : `Already have an account?`}
                  </p>
                  <p
                    className="text-blue-600 text-md cursor-pointer hover:text-blue-700"
                    onClick={() => setIsItSignIn((prev) => !prev)}
                  >
                    {isItSignIn ? "Signup" : "Signin"}
                  </p>
                </div>
              </div>
              <form
                className="space-y-4 mt-5 mb-5"
                onSubmit={handleSubmit((data) =>
                  isItSignIn
                    ? handleAuth("pass", data)
                    : handleAuth("sign_up", data),
                )}
              >
                {isItSignIn ? (
                  <>
                    <div>
                      <input
                        type="email"
                        placeholder="Email Address"
                        {...register("email")}
                        className="w-full py-3 px-4 bg-white/5 text-white rounded-2xl border border-white/10 focus:outline-none focus:border-white/20"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="relative">
                        <input
                          placeholder="Password"
                          {...register("password")}
                          type={passwordVisible ? "text" : "password"}
                          className="w-full py-3 px-4 bg-white/5 text-white rounded-2xl border border-white/10 focus:outline-none focus:border-white/20"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          {passwordVisible ? (
                            <EyeIcon
                              className="w-5 h-5 text-white cursor-pointer"
                              onClick={() => setPasswordVisible(false)}
                            />
                          ) : (
                            <IconEyeClosed
                              className="w-5 h-5 text-white cursor-pointer"
                              onClick={() => setPasswordVisible(true)}
                            />
                          )}
                        </div>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-500">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                    <div className="text-left">
                      <Button variant="link" className="text-white">
                        Forgot Password?
                      </Button>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                <Button
                  type="submit"
                  className="w-full bg-blue-500 text-md font-semibold font-sans text-white rounded-xl py-3 hover:bg-blue-600 transition-all duration-200"
                >
                  {loading && signingWith === "pass" ? (
                    <Loader className="text-white" />
                  ) : isItSignIn ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>
              {/* <!-- Separator between social media sign in and email/password sign in --> */}
              <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
                <p className="mx-4 mb-0 text-center font-semibold text-white">
                  or
                </p>
              </div>
              <div className="flex space-x-4 mt-5">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleAuth("google")}
                  className="flex items-center justify-center w-full py-3 px-4 bg-white/5 text-white rounded-2xl 
                  border border-white/10 hover:bg-white/10 transition-all duration-200 space-x-3"
                >
                  {loading ? (
                    <Loader className="text-white" />
                  ) : (
                    <IconBrandGoogle className="w-5 h-5 text-white" />
                  )}
                </motion.button>
                <motion.button
                  onClick={() => handleAuth("github")}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex items-center justify-center w-full py-3 px-4 bg-white/5 text-white rounded-2xl 
                  border border-white/10 hover:bg-white/10 transition-all duration-200 space-x-3"
                >
                  {loading ? (
                    <Loader className="text-white" />
                  ) : (
                    <IconBrandGithub className="w-5 h-5 text-white" />
                  )}
                </motion.button>
              </div>
              <div className="text-center mt-4">
                <Link href="/" className="flex items-center text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignInPage;
