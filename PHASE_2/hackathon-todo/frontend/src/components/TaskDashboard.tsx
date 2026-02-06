"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export default function TaskDashboard() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<string | undefined>(undefined);

  const fetchTasks = async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      const fetchedTasks = await api.getTasks(filterStatus, sortOrder);
      setTasks(fetchedTasks);
    } catch (err: any) {
      setError(err.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [session, filterStatus, sortOrder]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      await api.createTask(newTaskTitle, newTaskDescription);
      setNewTaskTitle("");
      setNewTaskDescription("");
      fetchTasks(); // Refresh the task list
    } catch (err: any) {
      setError(err.message || "Failed to create task");
    }
  };

  const handleToggleComplete = async (id: number) => {
    try {
      await api.toggleCompleteTask(id);
      fetchTasks(); // Refresh the task list
    } catch (err: any) {
      setError(err.message || "Failed to toggle task status");
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await api.deleteTask(id);
      fetchTasks(); // Refresh the task list
    } catch (err: any) {
      setError(err.message || "Failed to delete task");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Task Creation Form */}
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Task
          </button>
        </form>
      </div>

      {/* Task List and Filters */}
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>

        {/* Filters and Sort */}
        <div className="flex space-x-4 mb-4">
          <div>
            <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700">
              Filter by Status
            </label>
            <select
              id="filterStatus"
              value={filterStatus || ""}
              onChange={(e) => setFilterStatus(e.target.value === "" ? undefined : e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700">
              Sort by
            </label>
            <select
              id="sortOrder"
              value={sortOrder || ""}
              onChange={(e) => setSortOrder(e.target.value === "" ? undefined : e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="">None</option>
              <option value="created">Created Date</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>

        {tasks.length === 0 ? (
          <p className="text-gray-600">No tasks found. Start by creating a new one!</p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-md shadow-sm"
              >
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${task.completed ? "line-through text-gray-500" : ""}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Created: {new Date(task.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleComplete(task.id)}
                    className={`px-3 py-1 rounded text-white text-sm ${
                      task.completed ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {task.completed ? "Mark Pending" : "Mark Complete"}
                  </button>
                  {/* For simplicity, update can be an inline edit or a modal. For now, just a placeholder. */}
                  {/* <button className="bg-purple-500 hover:bg-purple-600 text-white text-sm px-3 py-1 rounded">
                    Edit
                  </button> */}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
