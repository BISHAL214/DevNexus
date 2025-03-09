"use client";

import { Loader } from "@/components/app_components/app_loader/__loader";
import LiquidBlob from "@/components/app_components/blobs/liquid-blob";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useFirebaseStore } from "@/store/firebase_firestore";
import { IconEyeClosed, IconBrandGoogle } from "@tabler/icons-react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Chrome,
  EyeIcon,
  Github
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const SignInPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { google_sign_in, github_sign_in } = useFirebaseStore();

  const handle_signIn = async (provider: string) => {
    setLoading(true);
    try {
      if (provider === "google") {
        const { user, is_onboarded } = await google_sign_in();
        console.log("goole-user - ", user, is_onboarded);
        is_onboarded
          ? router.push("/user/dashboard")
          : router.push("/user/onboarding");
      } else if (provider === "github") {
        const { user, is_onboarded } = await github_sign_in();
        console.log("github-user - ", user, is_onboarded);
        is_onboarded
          ? router.push("/user/dashboard")
          : router.push("/user/onboarding");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-900 w-full overflow-hidden flex">
      {/* <GeometricBackground> */}
      <div className="absolute inset-0 flex items-center justify-center">
        <LiquidBlob />
        {/* <AnimatedBlob 
          className="w-full h-full" 
          // colors={{ 
          //   primary: isDarkMode ? '#2d1b69' : '#4f46e5', 
          //   secondary: isDarkMode ? '#1c1033' : '#7c3aed' 
          // }}
          size={7}
        /> */}
      </div>
      {loading && (
        <motion.div
          className="h-screen w-full flex items-center justify-center bg-black/5 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader className="text-white" />
        </motion.div>
      )}
      <div className="min-h-screen w-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md mx-4"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 blur-3xl" />
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight font-mono text-blue-500">
                  dev
                  <span className="text-white font-playwrite font-light">
                    Nexus
                  </span>
                </h1>
                <p className="text-gray-400">
                  Welcome Back to the Developer's Hub
                </p>
              </div>

              <div>
                <form>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label
                        htmlFor="email"
                        className="text-white text-sm font-medium"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="
                                    Enter your email address"
                        className="w-full py-3 px-4 bg-white/5 text-white rounded-2xl
                                    border border-white/10 focus:outline-none focus:border-white/20 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="password"
                        className="text-white text-sm font-medium"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={passwordVisible ? "text" : "password"}
                          id="password"
                          placeholder="Enter your password"
                          className="w-full py-3 px-4 bg-white/5 text-white rounded-2xl
                                    border border-white/10 focus:outline-none focus:border-white/20 transition-all duration-200"
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
                    </div>
                    <div className="text-right">
                      <Button variant="link" className="text-white">
                        Forgot Password?
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <Button
                        // variant="primary"
                        className="w-full"
                        onClick={() => handle_signIn("email")}
                      >
                        Sign In
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
              {/* <!-- Separator between social media sign in and email/password sign in --> */}
              <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
                <p className="mx-4 mb-0 text-center font-semibold text-white">
                  Or
                </p>
              </div>
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handle_signIn("google")}
                  className="flex items-center justify-center w-full py-3 px-4 bg-white/5 text-white rounded-2xl 
                  border border-white/10 hover:bg-white/10 transition-all duration-200 space-x-3"
                >
                  <IconBrandGoogle className="w-5 h-5 text-white" />
                </motion.button>

                <motion.button
                  onClick={() => handle_signIn("github")}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex items-center justify-center w-full py-3 px-4 bg-white/5 text-white rounded-2xl 
                  border border-white/10 hover:bg-white/10 transition-all duration-200 space-x-3"
                >
                  <Github className="w-5 h-5" />  
                </motion.button>
              </div>

              <Separator />
              <div className="text-center">
                <Button variant={"link"} className="text-white">
                  <Link href={"/"} className="flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      {/* </GeometricBackground> */}
    </div>
  );
};

export default SignInPage;
