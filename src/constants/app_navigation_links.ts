import {
  BellRing,
  Globe,
  MessagesSquare,
  PanelsTopLeft
} from "lucide-react";

export const app_navigation_links = [
  // {
  //   title: "Home",
  //   href: "/",
  //   icon: <House />,
  // },
  {
    title: "Dashboard",
    href: "/user/dashboard",
    icon: PanelsTopLeft,
  },
  {
    title: "Explore",
    href: "/explore",
    icon: Globe,
  },
  // {
  //   title: "Collaborations",
  //   href: "/collaborations",
  //   icon: <Handshake />,
  // },
  {
    title: "Messages",
    href: "/messages",
    icon: MessagesSquare,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: BellRing,
  },
];
