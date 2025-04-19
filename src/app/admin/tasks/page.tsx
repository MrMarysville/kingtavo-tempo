import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Calendar, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function TasksPage() {
  const supabase = await createClient();
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select(
      "*, companies(name), users!tasks_assigned_to_fkey(full_name, avatar_url), orders(id)",
    )
    .order("created_at", { ascending: false });

  // Group tasks by status
  const tasksByStatus = {
    "to-do": [],
    "in-progress": [],
    review: [],
    done: [],
  };

  tasks?.forEach((task) => {
    const status = task.status?.toLowerCase().replace(" ", "-") || "to-do";
    if (tasksByStatus[status]) {
      tasksByStatus[status].push(task);
    } else {
      tasksByStatus["to-do"].push(task);
    }
  });

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Tasks
          </h1>
          <p className="text-muted-foreground">Manage your production tasks</p>
        </div>
        <div className="flex gap-2">
          <Tabs defaultValue="kanban" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2 bg-