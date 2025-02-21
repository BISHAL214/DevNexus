"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion, useAnimation } from "framer-motion";
import {
  CalendarIcon,
  GitBranch,
  GitCommit,
  GitPullRequest,
} from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { TechTrends } from "./__tech_trends";

function useAnimateInView() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return { ref, controls };
}

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function AnimatedCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, controls } = useAnimateInView();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={fadeInUpVariants}
      className={className}
    >
      <Card className="bg-black">{children}</Card>
    </motion.div>
  );
}

export default function DashboardPage() {
  return (
    <div className="w-full bg-transparent mt-14">
      <div className="flex flex-col pb-20">
        <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatedCard className="col-span-full md:col-span-1">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </AnimatedCard>
            <AnimatedCard className="col-span-full md:col-span-1">
              <CardHeader>
                <CardTitle className="text-white">
                  Collaboration Requests
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Pending invitations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CollaborationRequests />
              </CardContent>
            </AnimatedCard>
            <AnimatedCard className="col-span-full md:col-span-1">
              <CardHeader>
                <CardTitle className="text-white">
                  Popular Tech Trends
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Stay updated with the latest in tech
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TechTrends />
              </CardContent>
            </AnimatedCard>
            <AnimatedCard className="col-span-full md:col-span-1">
              <CardHeader>
                <CardTitle className="text-white">Project Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectUpdates />
              </CardContent>
            </AnimatedCard>
            <AnimatedCard className="col-span-full md:col-span-1">
              <CardHeader>
                <CardTitle className="text-white">
                  Community Contributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CommunityContributions />
              </CardContent>
            </AnimatedCard>
            <AnimatedCard className="col-span-full md:col-span-1">
              <CardHeader>
                <CardTitle className="text-white">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <UpcomingDeadlines />
              </CardContent>
            </AnimatedCard>
            <AnimatedCard className="col-span-full">
              <CardHeader>
                <CardTitle className="text-white">GitHub Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <GitHubStats />
              </CardContent>
            </AnimatedCard>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecentActivity() {
  const activities = [
    {
      user: "You",
      action: "pushed to main branch",
      project: "awesome-project",
      time: "2 hours ago",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      user: "Alice Johnson",
      action: "opened a pull request",
      project: "team-collab",
      time: "5 hours ago",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      user: "Bob Smith",
      action: "commented on your issue",
      project: "bug-tracker",
      time: "1 day ago",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ];

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center space-x-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.avatar} alt={activity.user} />
            <AvatarFallback>{activity.user[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm text-white">
              <span className="font-medium">{activity.user}</span>{" "}
              {activity.action} in {activity.project}
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CollaborationRequests() {
  const requests = [
    {
      name: "David Lee",
      project: "E-commerce Platform",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Emma Garcia",
      project: "AI Chatbot",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Frank Chen",
      project: "Mobile Game",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ];

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div
          key={request.name}
          className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={request.avatar} alt={request.name} />
            <AvatarFallback>{request.name[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-grow">
            <p className="text-sm text-white font-medium leading-none">
              {request.name}
            </p>
            <p className="text-sm text-muted-foreground">{request.project}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Decline
            </Button>
            <Button size="sm">Accept</Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectUpdates() {
  const updates = [
    { project: "E-commerce Platform", status: "In Progress", progress: 65 },
    { project: "AI Chatbot", status: "Code Review", progress: 90 },
    { project: "Mobile Game", status: "Planning", progress: 20 },
  ];

  return (
    <div className="space-y-4">
      {updates.map((update, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between">
            <p className="text-sm font-medium text-white">{update.project}</p>
            <Badge variant="outline">{update.status}</Badge>
          </div>
          <Progress value={update.progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            {update.progress}% Complete
          </p>
        </div>
      ))}
    </div>
  );
}

function CommunityContributions() {
  const contributions = [
    {
      type: "Pull Request",
      project: "open-source-project-a",
      status: "Merged",
    },
    { type: "Issue", project: "community-framework", status: "Opened" },
    { type: "Code Review", project: "popular-library", status: "Completed" },
  ];

  return (
    <div className="space-y-4">
      {contributions.map((contribution, index) => (
        <div key={index} className="flex items-center space-x-4">
          {contribution.type === "Pull Request" && (
            <GitPullRequest className="h-5 w-5 text-green-500" />
          )}
          {contribution.type === "Issue" && (
            <GitCommit className="h-5 w-5 text-yellow-500" />
          )}
          {contribution.type === "Code Review" && (
            <GitBranch className="h-5 w-5 text-blue-500" />
          )}
          <div className="flex-grow">
            <p className="text-sm font-medium text-white">
              {contribution.type}
            </p>
            <p className="text-xs text-muted-foreground">
              {contribution.project}
            </p>
          </div>
          <Badge variant="outline">{contribution.status}</Badge>
        </div>
      ))}
    </div>
  );
}

function UpcomingDeadlines() {
  const deadlines = [
    {
      task: "Project Milestone",
      project: "E-commerce Platform",
      date: "2023-08-15",
    },
    { task: "Code Freeze", project: "AI Chatbot", date: "2023-08-20" },
    { task: "Release v1.0", project: "Mobile Game", date: "2023-09-01" },
  ];

  return (
    <div className="space-y-4">
      {deadlines.map((deadline, index) => (
        <div key={index} className="flex items-center space-x-4">
          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          <div className="flex-grow">
            <p className="text-sm font-medium text-white">{deadline.task}</p>
            <p className="text-xs text-muted-foreground">{deadline.project}</p>
          </div>
          <p className="text-sm text-muted-foreground">{deadline.date}</p>
        </div>
      ))}
    </div>
  );
}

function GitHubStats() {
  const data = [
    { day: "Mon", commits: 5 },
    { day: "Tue", commits: 8 },
    { day: "Wed", commits: 3 },
    { day: "Thu", commits: 7 },
    { day: "Fri", commits: 10 },
    { day: "Sat", commits: 2 },
    { day: "Sun", commits: 4 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-white">
            Total Commits (Last 7 Days)
          </p>
          <p className="text-2xl font-bold text-white">
            {data.reduce((sum, day) => sum + day.commits, 0)}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-white">Longest Streak</p>
          <p className="text-2xl font-bold text-white">12 days</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis
            dataKey="day"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Bar dataKey="commits" fill="#adfa1d" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
