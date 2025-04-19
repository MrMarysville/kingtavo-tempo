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
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserCompanyAndRole } from "@/utils/auth";

export default async function TasksPage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if user exists
  if (!user) {
    // Redirect to sign-in page if user is not authenticated
    redirect("/sign-in");
  }

  // Get user's company and role information
  const userInfo = await getUserCompanyAndRole(user.id);

  // Fetch tasks based on user role and company
  let tasksQuery = supabase
    .from("tasks")
    .select(
      "*, companies(name), users!tasks_assigned_to_fkey(full_name, avatar_url), orders(id)",
    )
    .order("created_at", { ascending: false });

  // If not an owner, only show tasks from the user's company
  if (userInfo?.roleName !== "owner" && userInfo?.companyId) {
    tasksQuery = tasksQuery.eq("company_id", userInfo.companyId);
  }

  const { data: tasks, error } = await tasksQuery;

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

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "to do":
        return "bg-gray-100 text-gray-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      case "done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Group tasks by status for kanban view
  const tasksByStatus = {
    "To Do": [],
    "In Progress": [],
    Review: [],
    Done: [],
  };

  tasks?.forEach((task) => {
    if (task.status in tasksByStatus) {
      tasksByStatus[task.status].push(task);
    } else {
      // Default to To Do if status is not recognized
      tasksByStatus["To Do"].push(task);
    }
  });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Tasks
          </h1>
          <p className="text-muted-foreground">Manage production tasks</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/tasks/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive border border-destructive/20">
          <p>Error loading tasks: {error.message}</p>
        </div>
      )}

      <Tabs defaultValue="kanban" className="space-y-4">
        <TabsList>
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            List View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="space-y-4">
          {!tasks || tasks.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No tasks found</CardTitle>
                <CardDescription>
                  Get started by creating your first task
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
                <div key={status} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{status}</h3>
                    <span className="text-muted-foreground text-sm">
                      {statusTasks.length} tasks
                    </span>
                  </div>
                  <div className="space-y-4">
                    {statusTasks.map((task) => (
                      <Link key={task.id} href={`/admin/tasks/${task.id}`}>
                        <Card className="hover:border-primary hover:shadow-sm transition-all cursor-pointer">
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
                            <CardDescription className="text-xs">
                              {task.companies?.name}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0 space-y-2">
                            {task.users && (
                              <div className="flex items-center gap-2">
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
                                <span className="text-xs">
                                  {task.users.full_name}
                                </span>
                              </div>
                            )}
                            {task.due_date && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {new Date(task.due_date).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {!tasks || tasks.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No tasks found</CardTitle>
                <CardDescription>
                  Get started by creating your first task
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>All Tasks</CardTitle>
                <CardDescription>
                  A list of all tasks across all statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <Link key={task.id} href={`/admin/tasks/${task.id}`}>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:border-primary hover:shadow-sm transition-all cursor-pointer">
                        <div className="flex items-start gap-4">
                          <div>
                            <h3 className="font-medium">{task.task_type}</h3>
                            <p className="text-sm text-muted-foreground">
                              {task.companies?.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {task.users && (
                            <div className="flex items-center gap-2">
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
                              <span className="text-sm">
                                {task.users.full_name}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                task.status,
                              )}`}
                            >
                              {task.status}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                task.priority,
                              )}`}
                            >
                              {task.priority}
                            </span>
                          </div>
                          {task.due_date && (
                            <div className="text-sm text-muted-foreground">
                              Due:{" "}
                              {new Date(task.due_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
