"use client";

import GeometricBackground from "@/components/app_components/app_background_pattern/app_geometric_background";
import BackgroundPattern from "@/components/app_components/app_background_pattern/background_pattern";
import { Loader } from "@/components/app_components/app_loader/__loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useFirebaseStore } from "@/store/firebase_firestore";
import { motion } from "framer-motion";
import { ArrowLeft, Chrome, Github } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const SignInPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    <GeometricBackground>
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
                  Sign in to your account to continue
                </p>
              </div>

              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handle_signIn("google")}
                  className="flex items-center justify-center w-full py-3 px-4 bg-white/5 text-white rounded-2xl 
                  border border-white/10 hover:bg-white/10 transition-all duration-200 space-x-3"
                >
                  <Chrome className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium">
                    Continue with Google
                  </span>
                </motion.button>

                <motion.button
                  onClick={() => handle_signIn("github")}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex items-center justify-center w-full py-3 px-4 bg-white/5 text-white rounded-2xl 
                  border border-white/10 hover:bg-white/10 transition-all duration-200 space-x-3"
                >
                  <Github className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    Continue with GitHub
                  </span>
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
    </GeometricBackground>
  );
};

export default SignInPage;
