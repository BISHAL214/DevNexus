"use client";

import { Button } from "@/components/ui/button";
import { useUserDetails } from "@/hooks/use-user_details";
import { useFirebaseStore } from "@/store/firebase_firestore";
import { useSocketStore } from "@/store/socket_socketstore";
import { IconMailFast, IconUserCheck, IconUserCode } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader } from "../app_loader/__loader";
const UserProfilePageMain = () => {
  const params = useParams();
  const profileSlug = params?.profileSlug;
  const [connectionSendInitiated, setConnectionSendInitiated] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [connectButtonChanged, setConnectButtonChanged] = useState(false);

  const { user, user_loading } = useFirebaseStore();
  const { socket } = useSocketStore();
  const { fetchUserDetails, user_details, user_details_loading } =
    useUserDetails();

  const isSameUser = user?.slug === profileSlug;

  useEffect(() => {
    if (profileSlug && typeof profileSlug === "string")
      fetchUserDetails(profileSlug);
  }, [profileSlug, fetchUserDetails]);

  const handleConnect = useCallback(() => {
    // TODO: had to fix this for remove the request
    if (!socket || !user || !user_details?.success) return;

    if (connectionSendInitiated) {
      setShowDeleteDialog(true);
      return;
    }

    socket.emit("send_connection_request", {
      senderId: user.id,
      recieverId: user_details?.userDetails?.id,
    });

    setConnectionSendInitiated(true);
    toast.success("Connection request sent successfully");
  }, [socket, user, user_details?.userDetails, connectionSendInitiated]);

  if (user_loading || user_details_loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="text-white" />
      </div>
    );
  }

  const receiverConnections = user_details?.userDetails?.sentConnections?.some(
    (conn: any) => conn.receiverId === user?.id && conn.status === "PENDING"
  );

  const senderConnections =
    user_details?.userDetails?.receivedConnections?.some(
      (conn: any) => conn.senderId === user?.id && conn.status === "PENDING"
    );

  console.log(user);

  const handleUserConnectionUi = () => {
    if (isSameUser) {
      return null;
    }

    if (receiverConnections) {
      return (
        <div className="flex gap-2">
          <Button className="bg-gray-900 hover:bg-gray-950 shadow-2xl text-gray-500 px-4 py-2 rounded-3xl flex gap-1">
            <Check className="text-gray-500 w-5" /> Approve
          </Button>
          <Button className="bg-gray-900 hover:bg-gray-950 shadow-2xl text-gray-500 px-4 py-2 rounded-3xl flex gap-1">
            <X className="text-gray-500 w-5" /> Decline
          </Button>
        </div>
      );
    }

    if (senderConnections) {
      return (
        <Button className="bg-gray-500 px-4 py-2 rounded-3xl flex gap-1">
          <IconUserCheck className="text-white w-5" />
        </Button>
      );
    }

    if (connectButtonChanged) {
      return null;
    }

    return (
      <button
        onClick={handleConnect}
        className={`${
          connectionSendInitiated
            ? "bg-white/10 hover:bg-white/20"
            : "bg-blue-600 hover:bg-blue-700"
        } shadow-2xl text-neutral-200 px-4 py-2 rounded-3xl flex gap-1`}
      >
        {connectionSendInitiated ? (
          <IconUserCheck className="text-white w-5" />
        ) : (
          <IconUserCode className="text-white w-5" />
        )}
        Connect
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-transparent py-16">
      <div className="max-w-5xl mx-auto p-1 md:p-6">
        {user_details && (
          <div className="bg-white/10 text-white backdrop-blur-md rounded-lg overflow-hidden">
            <div className="relative">
              <Image
                src={
                  user_details?.userDetails?.cover_image || "/placeholder.svg"
                }
                alt="user_cover_image"
                width={1000}
                height={300}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30" />
            </div>
            <div className="relative px-4 pb-6 pt-16 md:pb-8 md:px-6">
              <Image
                src={user_details?.userDetails?.avatar || "/placeholder.svg"}
                alt="user_avatar"
                width={112}
                height={112}
                className="w-28 h-28 rounded-full border-4 border-white/10 absolute -top-14 left-4"
              />
              <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-3">
                  <h1 className="text-2xl font-bold">
                    {user_details?.userDetails?.name}
                  </h1>
                  <p className="text-sm">
                    {user_details?.userDetails?.headline}
                  </p>
                  <p className="text-xs text-gray-300 mt-2">
                    {user_details?.userDetails?.location?.city},{" "}
                    {user_details?.userDetails?.location?.state},{" "}
                    {user_details?.userDetails?.location?.country}
                  </p>
                  <div className="mt-4 flex gap-2">
                    {handleUserConnectionUi()}
                    <Button className="bg-gray-900 hover:bg-gray-950 shadow-2xl text-gray-500 px-4 py-2 rounded-3xl flex gap-1">
                      <IconMailFast className="text-gray-500 w-5" /> message
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex backdrop-blur-sm items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
            className="bg-white/10 p-4 rounded-lg backdrop-blur-md shadow-2xl"
          >
            <p className="text-white">Delete the connection request?</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="bg-gray-800 text-gray-400 px-4 py-2 rounded-3xl hover:bg-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setConnectionSendInitiated(false);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-3xl hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePageMain;

// interface Profile {
//   avatar_url: string | null;
//   name: string | null;
//   login: string | null;
//   bio: string | null;
//   location: string | null;
//   public_repos: number | null;
//   followers: number | null;
//   following: number | null;
//   blog: string | null;
// }

//   useEffect(() => {
//     // Fetch GitHub Profile Data
//     fetch(`https://api.github.com/users/BISHAL214`)
//       .then((res) => res.json())
//       .then((data) => setProfile(data));

//     // Fetch GitHub Repositories
//     fetch(
//       `https://api.github.com/users/BISHAL214/repos?sort=updated&per_page=5`
//     )
//       .then((res) => res.json())
//       .then((data) => setRepos(data));
//   }, []);

//   const [profile, setProfile] = useState<Profile | null>(null);

{
  /* GitHub Stats */
}
{
  /* <div className="mt-6">
          <h2 className="text-xl font-semibold">🔥 GitHub Insights</h2>
          <p className="text-gray-600">
            Public Repos: {profile?.public_repos} | Followers:{" "}
            {profile?.followers} | Following: {profile?.following}
          </p>
        </div> */
}

{
  /* Tech Stack */
}
{
  /* <div className="mt-6">
          <h2 className="text-xl font-semibold">🛠 Tech Stack</h2>
          <div className="flex gap-2 mt-2">
            {profile?.blog && (
              <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded">
                Portfolio
              </span>
            )}
            <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded">
              React
            </span>
            <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded">
              Node.js
            </span>
            <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded">
              MongoDB
            </span>
          </div>
        </div> */
}

{
  /* Repositories */
}
{
  /* <div className="mt-6">
          <h2 className="text-xl font-semibold">📂 Top Repositories</h2>
          <ul className="mt-2">
            {repos.map((repo: any) => (
              <li key={repo.id} className="border-b py-2">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 font-semibold"
                >
                  {repo.name}
                </a>
                <p className="text-sm text-gray-600">
                  {repo.description || "No description available."}
                </p>
              </li>
            ))}
          </ul>
        </div> */
}
