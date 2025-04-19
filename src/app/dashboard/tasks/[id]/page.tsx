import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../../supabase/server";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function TaskDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data: task, error } = await supabase
    .from("tasks")
    .select(
      "*, companies(name), users!tasks_assigned_to_fkey(full_name, avatar_url), orders(id, customers(name))",
    )
    .eq("id", params.id)
    .single();

  if (error || !task) {
    return notFound();
  }

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/tasks">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{task.task_type}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
              <CardDescription>
                Information about this production task
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Status
                  </h3>
                  <div className="mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        task.status,
                      )}`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Priority
                  </h3>
                  <div className="mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        task.priority,
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Company
                </h3>
                <p className="mt-1">
                  {task.companies?.name || "Unknown Company"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Order
                </h3>
                <p className="mt-1">
                  <Link
                    href={`/dashboard/orders/${task.order_id}`}
                    className="text-primary hover:underline"
                  >
                    Order #{task.order_id?.substring(0, 8)}
                  </Link>
                  {task.orders?.customers?.name &&
                    ` - ${task.orders.customers.name}`}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Assigned To
                </h3>
                <div className="mt-1 flex items-center gap-2">
                  {task.users ? (
                    <>
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
                      <span>{task.users.full_name}</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">Unassigned</span>
                  )}
                </div>
              </div>

              {task.due_date && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Due Date
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(task.due_date).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              {task.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Notes
                  </h3>
                  <div className="mt-1 rounded-md border p-3">
                    <p className="whitespace-pre-line">{task.notes}</p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Created
                </h3>
                <div className="mt-1 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(task.created_at).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Edit Task</Button>
              <Button variant="destructive">Delete Task</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>Recent activity for this task</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-blue-100 p-1">
                    <FileText className="h-4 w-4 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Task created</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(task.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Comment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                    alt="@user"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <textarea
                    className="w-full rounded-md border p-2 text-sm"
                    placeholder="Add a comment..."
                    rows={3}
                  ></textarea>
                  <div className="mt-2 flex justify-end">
                    <Button size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
