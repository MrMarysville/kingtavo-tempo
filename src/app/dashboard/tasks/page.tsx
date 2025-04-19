import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage your production tasks</p>
        </div>
        <div className="flex gap-2">
          <Tabs defaultValue="kanban" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="kanban" className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                Kanban
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendar
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Link href="/dashboard/tasks/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          <p>Error loading tasks: {error.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <Tabs defaultValue="kanban" className="w-full">
          <TabsContent value="kanban" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* To Do Column */}
              <div className="space-y-4">
                <div className="sticky top-0 z-10 bg-background pt-2">
                  <h3 className="font-semibold text-lg flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
                    To Do
                    <span className="ml-2 text-muted-foreground text-sm">
                      ({tasksByStatus["to-do"]?.length || 0})
                    </span>
                  </h3>
                  <div className="h-1 w-full bg-gray-200 rounded-full mt-2"></div>
                </div>
                <div className="space-y-3">
                  {!tasksByStatus["to-do"] ||
                  tasksByStatus["to-do"].length === 0 ? (
                    <div className="border border-dashed rounded-lg p-4 text-center text-muted-foreground">
                      No tasks
                    </div>
                  ) : (
                    tasksByStatus["to-do"].map((task) => (
                      <Link key={task.id} href={`/dashboard/tasks/${task.id}`}>
                        <Card className="hover:border-primary hover:shadow-sm transition-all">
                          <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base">
                                {task.task_type}
                              </CardTitle>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                  task.priority,
                                )}`}
                              >
                                {task.priority}
                              </span>
                            </div>
                            <CardDescription>
                              Order #{task.order_id?.substring(0, 8)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="flex justify-between items-center mt-2">
                              <div className="text-xs text-muted-foreground">
                                {task.due_date
                                  ? new Date(task.due_date).toLocaleDateString()
                                  : "No due date"}
                              </div>
                              {task.users && (
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={
                                      task.users.avatar_url ||
                                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.users.full_name}`
                                    }
                                    alt={task.users.full_name}
                                  />
                                  <AvatarFallback>
                                    {task.users.full_name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* In Progress Column */}
              <div className="space-y-4">
                <div className="sticky top-0 z-10 bg-background pt-2">
                  <h3 className="font-semibold text-lg flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    In Progress
                    <span className="ml-2 text-muted-foreground text-sm">
                      ({tasksByStatus["in-progress"]?.length || 0})
                    </span>
                  </h3>
                  <div className="h-1 w-full bg-blue-200 rounded-full mt-2"></div>
                </div>
                <div className="space-y-3">
                  {!tasksByStatus["in-progress"] ||
                  tasksByStatus["in-progress"].length === 0 ? (
                    <div className="border border-dashed rounded-lg p-4 text-center text-muted-foreground">
                      No tasks
                    </div>
                  ) : (
                    tasksByStatus["in-progress"].map((task) => (
                      <Link key={task.id} href={`/dashboard/tasks/${task.id}`}>
                        <Card className="hover:border-primary hover:shadow-sm transition-all">
                          <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base">
                                {task.task_type}
                              </CardTitle>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                  task.priority,
                                )}`}
                              >
                                {task.priority}
                              </span>
                            </div>
                            <CardDescription>
                              Order #{task.order_id?.substring(0, 8)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="flex justify-between items-center mt-2">
                              <div className="text-xs text-muted-foreground">
                                {task.due_date
                                  ? new Date(task.due_date).toLocaleDateString()
                                  : "No due date"}
                              </div>
                              {task.users && (
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={
                                      task.users.avatar_url ||
                                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.users.full_name}`
                                    }
                                    alt={task.users.full_name}
                                  />
                                  <AvatarFallback>
                                    {task.users.full_name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* Review Column */}
              <div className="space-y-4">
                <div className="sticky top-0 z-10 bg-background pt-2">
                  <h3 className="font-semibold text-lg flex items-center">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                    Review
                    <span className="ml-2 text-muted-foreground text-sm">
                      ({tasksByStatus["review"]?.length || 0})
                    </span>
                  </h3>
                  <div className="h-1 w-full bg-yellow-200 rounded-full mt-2"></div>
                </div>
                <div className="space-y-3">
                  {!tasksByStatus["review"] ||
                  tasksByStatus["review"].length === 0 ? (
                    <div className="border border-dashed rounded-lg p-4 text-center text-muted-foreground">
                      No tasks
                    </div>
                  ) : (
                    tasksByStatus["review"].map((task) => (
                      <Link key={task.id} href={`/dashboard/tasks/${task.id}`}>
                        <Card className="hover:border-primary hover:shadow-sm transition-all">
                          <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base">
                                {task.task_type}
                              </CardTitle>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                  task.priority,
                                )}`}
                              >
                                {task.priority}
                              </span>
                            </div>
                            <CardDescription>
                              Order #{task.order_id?.substring(0, 8)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="flex justify-between items-center mt-2">
                              <div className="text-xs text-muted-foreground">
                                {task.due_date
                                  ? new Date(task.due_date).toLocaleDateString()
                                  : "No due date"}
                              </div>
                              {task.users && (
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={
                                      task.users.avatar_url ||
                                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.users.full_name}`
                                    }
                                    alt={task.users.full_name}
                                  />
                                  <AvatarFallback>
                                    {task.users.full_name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* Done Column */}
              <div className="space-y-4">
                <div className="sticky top-0 z-10 bg-background pt-2">
                  <h3 className="font-semibold text-lg flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    Done
                    <span className="ml-2 text-muted-foreground text-sm">
                      ({tasksByStatus["done"]?.length || 0})
                    </span>
                  </h3>
                  <div className="h-1 w-full bg-green-200 rounded-full mt-2"></div>
                </div>
                <div className="space-y-3">
                  {!tasksByStatus["done"] ||
                  tasksByStatus["done"].length === 0 ? (
                    <div className="border border-dashed rounded-lg p-4 text-center text-muted-foreground">
                      No tasks
                    </div>
                  ) : (
                    tasksByStatus["done"].map((task) => (
                      <Link key={task.id} href={`/dashboard/tasks/${task.id}`}>
                        <Card className="hover:border-primary hover:shadow-sm transition-all">
                          <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base">
                                {task.task_type}
                              </CardTitle>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                  task.priority,
                                )}`}
                              >
                                {task.priority}
                              </span>
                            </div>
                            <CardDescription>
                              Order #{task.order_id?.substring(0, 8)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="flex justify-between items-center mt-2">
                              <div className="text-xs text-muted-foreground">
                                {task.due_date
                                  ? new Date(task.due_date).toLocaleDateString()
                                  : "No due date"}
                              </div>
                              {task.users && (
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={
                                      task.users.avatar_url ||
                                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.users.full_name}`
                                    }
                                    alt={task.users.full_name}
                                  />
                                  <AvatarFallback>
                                    {task.users.full_name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="calendar" className="mt-0">
            <div className="rounded-lg border p-6">
              <div className="flex flex-col items-center justify-center h-[400px]">
                <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Calendar View</h3>
                <p className="text-muted-foreground text-center mt-2">
                  Calendar view is coming soon. You'll be able to view and
                  manage your tasks in a calendar format.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
