"use client";

import { Loader } from "@/components/app_components/app_loader/__loader";
import { Button } from "@/components/ui/button";
import { loginSchema, signupSchema } from "@/lib/zod_schemas";
import { useFirebaseStore } from "@/store/firebase_firestore";
import {
  IconEyeClosed,
  IconBrandGoogle,
  IconBrandGithub,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { ArrowLeft, Brain, Code, EyeIcon, Library, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as z from "zod";

const SignInPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isItSignIn, setIsItSignIn] = useState(true);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [validatedSchema, setValidatedSchema] = useState<z.Schema>(loginSchema);
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
  } = useForm({
    resolver: zodResolver(validatedSchema),
  });

  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    setFocus("email"); // Focus the email input on first render
  }, [setFocus, isItSignIn]);

  useEffect(() => {
    const schema = isItSignIn ? loginSchema : signupSchema;
    setValidatedSchema(schema);
  }, [isItSignIn]);

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
          /* console.log(formData); */
          setSigningWith("pass");
          result = await email_sign_up(formData.email, formData.password);
          console.log(result);
          if (!result.success) {
            toast.error(result.message);
            return;
          }
          toast.success(result.message);
          setSigningWith(null);
          reset();
          break;
        default:
          throw new Error("Invalid provider");
      }

      if (provider === "sign_up") {
        router.push("/auth/verification/pending");
        return;
      } else
        router.push(
          result.is_onboarded ? "/user/dashboard" : "/user/onboarding",
        );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex bg-global-gradient-1">
      {/* Animated background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-[10%] right-[10%] w-96 h-96 bg-purple-500/30 rounded-full blur-[100px] animate-pulse-slow"></div>
          <div
            className="absolute bottom-[10%] left-[10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse-slow"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-[40%] left-[30%] w-72 h-72 bg-violet-500/20 rounded-full blur-[100px] animate-pulse-slow"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* Floating particles */}
        {isClient &&
          Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * 100,
                y: Math.random() * 100,
                opacity: Math.random() * 0.5 + 0.3,
              }}
              animate={{
                x: [
                  Math.random() * windowSize.width,
                  Math.random() * windowSize.width,
                  Math.random() * windowSize.width,
                ],
                y: [
                  Math.random() * windowSize.height,
                  Math.random() * windowSize.height,
                  Math.random() * windowSize.height,
                ],
              }}
              transition={{
                duration: Math.random() * 20 + 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute bg-white/10 rounded-full"
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
              }}
            />
          ))}
      </div>

      {/* Main content container */}
      <div className="w-full h-screen flex lg:flex-row items-center justify-center min-h-screen z-10 pb-20 md:pb-0">
        {/* Content section - 75% on desktop */}
        <div className="w-[65%] h-[90vh] px-0 hidden lg:flex justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative m-0 w-full"
          >
            <div className="bg-white/10 h-full backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-5"
              >
                <motion.h3
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="text-6xl gradient-text font-medium text-center lg:text-left"
                >
                  The AI-Powered Developer Hub
                </motion.h3>

                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  className="text-white/80 text-center text-3xl lg:text-left mt-10"
                >
                  Elevate your development journey with our cutting-edge
                  platform designed for the modern developer ecosystem.
                </motion.p>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="space-y-4 mt-20"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Brain className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-white text-xl font-medium">
                        AI-Powered Recommendations
                      </h4>
                      <p className="text-white/70 text-lg">
                        Intelligent teammates recommendations for your next
                        project, based on your skills, interests etc.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Users className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-xl">
                        Global Developer Network
                      </h4>
                      <p className="text-white/70 text-lg">
                        Connect with top developers worldwide for collaboration
                        and growth.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Code className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-xl">
                        Smart Collaboration Tools
                      </h4>
                      <p className="text-white/70 text-lg">
                        Streamlined workflows with integrated development
                        environments.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Library className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-xl">
                        Continuous Learning Resources
                      </h4>
                      <p className="text-white/70 text-lg">
                        Stay ahead with access to the latest tech trends and
                        tutorials.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        {/* Form section - 50% on desktop */}
        <div className="w-full lg:w-[32%] px-4 py-8 flex justify-center order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-md lg:max-w-full"
          >
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl">
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
                      className="text-purple-500 text-md cursor-pointer hover:text-purple-400 transition-colors"
                      onClick={() => setIsItSignIn((prev) => !prev)}
                    >
                      {isItSignIn ? "Signup" : "Signin"}
                    </p>
                  </div>
                </div>
                <form
                  className="space-y-4 mt-6 mb-6"
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
                          className="w-full py-3 px-4 bg-white/5 text-white rounded-2xl border border-white/10 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors?.email?.message?.toString()}
                          </p>
                        )}
                      </div>
                      <div>
                        <div className="relative">
                          <input
                            placeholder="Password"
                            {...register("password")}
                            type={passwordVisible ? "text" : "password"}
                            className="w-full py-3 px-4 bg-white/5 text-white rounded-2xl border border-white/10 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {passwordVisible ? (
                              <EyeIcon
                                className="w-5 h-5 text-white cursor-pointer hover:text-blue-400 transition-colors"
                                onClick={() => setPasswordVisible(false)}
                              />
                            ) : (
                              <IconEyeClosed
                                className="w-5 h-5 text-white cursor-pointer hover:text-blue-400 transition-colors"
                                onClick={() => setPasswordVisible(true)}
                              />
                            )}
                          </div>
                        </div>
                        {errors.password && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors?.password?.message?.toString()}
                          </p>
                        )}
                      </div>
                      <div className="text-left">
                        <Button
                          variant="link"
                          className="text-purple-400 hover:text-purple-300 p-0 h-auto"
                        >
                          Forgot Password?
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <input
                          type="email"
                          placeholder="Email Address"
                          {...register("email")}
                          className="w-full py-3 px-4 bg-white/5 text-white rounded-2xl border border-white/10 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors?.email?.message?.toString()}
                          </p>
                        )}
                      </div>
                      <div>
                        <div className="relative">
                          <input
                            placeholder="Password"
                            {...register("password")}
                            type={passwordVisible ? "text" : "password"}
                            className="w-full py-3 px-4 bg-white/5 text-white rounded-2xl border border-white/10 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {passwordVisible ? (
                              <EyeIcon
                                className="w-5 h-5 text-white cursor-pointer hover:text-blue-400 transition-colors"
                                onClick={() => setPasswordVisible(false)}
                              />
                            ) : (
                              <IconEyeClosed
                                className="w-5 h-5 text-white cursor-pointer hover:text-blue-400 transition-colors"
                                onClick={() => setPasswordVisible(true)}
                              />
                            )}
                          </div>
                        </div>
                        {errors.password && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors?.password?.message?.toString()}
                          </p>
                        )}
                      </div>
                      <div>
                        <div className="relative">
                          <input
                            placeholder="Confirm Password"
                            {...register("confirmPassword")}
                            type={confirmPasswordVisible ? "text" : "password"}
                            className="w-full py-3 px-4 bg-white/5 text-white rounded-2xl border border-white/10 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {confirmPasswordVisible ? (
                              <EyeIcon
                                className="w-5 h-5 text-white cursor-pointer hover:text-blue-400 transition-colors"
                                onClick={() => setConfirmPasswordVisible(false)}
                              />
                            ) : (
                              <IconEyeClosed
                                className="w-5 h-5 text-white cursor-pointer hover:text-blue-400 transition-colors"
                                onClick={() => setConfirmPasswordVisible(true)}
                              />
                            )}
                          </div>
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors?.confirmPassword?.message?.toString()}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 text-md font-semibold font-sans text-white rounded-xl py-6 hover:from-purple-700 hover:to-indigo-600 transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
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
                <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-white/20 after:mt-0.5 after:flex-1 after:border-t after:border-white/20">
                  <p className="mx-4 mb-0 text-center font-semibold text-white">
                    or
                  </p>
                </div>
                <div className="flex space-x-4 mt-5">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAuth("google")}
                    className="flex items-center justify-center w-full py-3 px-4 bg-white/5 text-white rounded-2xl 
                    border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 space-x-3"
                  >
                    {loading && signingWith === "google" ? (
                      <Loader className="text-white" />
                    ) : (
                      <IconBrandGoogle className="w-5 h-5 text-white" />
                    )}
                  </motion.button>
                  <motion.button
                    onClick={() => handleAuth("github")}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center w-full py-3 px-4 bg-white/5 text-white rounded-2xl 
                    border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 space-x-3"
                  >
                    {loading && signingWith === "github" ? (
                      <Loader className="text-white" />
                    ) : (
                      <IconBrandGithub className="w-5 h-5 text-white" />
                    )}
                  </motion.button>
                </div>
                <div className="text-center mt-6">
                  <Link
                    href="/"
                    className="inline-flex items-center text-white/80 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>{" "}
      </div>
    </div>
  );
};

export default SignInPage;
