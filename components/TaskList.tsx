"use client";
import {
  useChangeStatusMutation,
  useDeleteTaskMutation,
  useGetArchiveTasksQuery,
  useGetTodayTaskQuery,
  useGetUpcomingTasksQuery,
} from "@/services/queries/othersApi";
import React, { useEffect, useState } from "react";
import { TaskPayload } from "@/services/types";
import { toast } from "react-toastify";
import Loading from "./Loading";
import { useRouter } from "next/navigation";

export default function TaskList() {
  const [taskFilter, setTaskFilter] = useState(1);
  const [searchParam, setSearchParam] = useState("");
  const [tasks, setTasks] = useState<TaskPayload[]>([]);
  const [progress, setProgress] = useState(0);

  const router = useRouter();

  const [deleteTask, { isLoading: deleting }] = useDeleteTaskMutation();
  const [changeStatus, { isLoading: changing }] = useChangeStatusMutation();

  const { data: archivedTasks, isLoading: atLoading } = useGetArchiveTasksQuery(
    "",
    { skip: taskFilter !== 0 }
  );

  const { data: todayTasks, isLoading: ttLoading } = useGetTodayTaskQuery("", {
    skip: taskFilter !== 1,
  });

  const { data: upcomingTasks, isLoading: uTasksLoading } =
    useGetUpcomingTasksQuery("", {
      skip: taskFilter !== 2,
    });

  useEffect(() => {
    let sourceTasks: TaskPayload[] = [];

    if (searchParam) {
      const filtered = (tasks || []).filter((task) =>
        task.title.toLowerCase().includes(searchParam.toLowerCase())
      );
      sourceTasks = filtered;
    } else if (taskFilter === 2 && upcomingTasks) {
      sourceTasks = upcomingTasks as TaskPayload[];
    } else if (taskFilter === 1 && todayTasks) {
      sourceTasks = todayTasks as TaskPayload[];
    } else if (taskFilter === 0 && archivedTasks) {
      sourceTasks = archivedTasks as TaskPayload[];
    }

    setTasks(sourceTasks);

    const total = sourceTasks.length;
    const completed = sourceTasks.filter((t) => t.complete).length;
    const percent = total > 0 ? (completed / total) * 100 : 0;
    setProgress(Math.round(percent));
  }, [searchParam, taskFilter, todayTasks, upcomingTasks, archivedTasks]);

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id).unwrap();

      toast.success("Task delete successfully");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const handleChangeStatus = async (id: string) => {
    try {
      await changeStatus(id).unwrap();

      toast.success("Task status changed successfully");
    } catch (error) {
      toast.error("Failed to update task status");
    }
  };
  const loading = ttLoading || uTasksLoading || atLoading

  // console.log("progress", progress);
  return (
    <div className="w-full flex flex-col items-center px-4 space-y-10">
      <div className="flex flex-col md:flex-row items-center justify-between w-full md:w-2/3 lg:w-2/5 mt-16 space-y-4 md:space-y-0">
        <div className="relative w-full h-12 md:w-[70%]">
          <input
            onChange={(e) => setSearchParam(e.target.value)}
            type="text"
            name="title"
            placeholder="Search"
            className="w-full h-full rounded-lg bg-[#F7F7F7] border border-[#BCBCBC] pl-10 pr-4 outline-0 text-black placeholder-gray-500"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="gray"
            className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>

        <select
          className="w-full md:w-[28%] h-12 bg-[#F7F7F7] border border-[#BCBCBC] rounded-lg text-black px-3 outline-0 cursor-pointer"
          defaultValue={1}
          onChange={(e) => setTaskFilter(Number(e.target.value))}
        >
          <option value={1}>Today</option>
          <option value={2}>Upcoming</option>
          <option value={0}>Previous</option>
        </select>
      </div>

      {loading ? (
        <Loading></Loading>
      ) : (
        <>
          <div className="w-full md:w-2/3 lg:w-2/5 bg-white rounded-md shadow-md py-4 px-3 md:px-5">
            {tasks?.length === 0 ? (
              <p className="text-center text-gray-500">No tasks found</p>
            ) : (
              tasks.map((task: TaskPayload) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between bg-[#F7F7F7] rounded-md px-3 py-2 mb-2"
                >
                  <div className="flex items-start space-x-3">
                    <div
                      aria-disabled={changing}
                      onClick={() => handleChangeStatus(task._id)}
                      className={`w-4 h-4 mt-1 rounded-sm cursor-pointer ${
                        task.complete ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                    <div>
                      <p
                        className={`text-md text-black capitalize ${
                          task.complete ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {task?.time} • {taskFilter === 1 ? "Today" : task?.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => router.push(`/edit/${task?._id}`)}
                      className="mr-5 text-gray-600 text-lg hover:text-gray-800 transition cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleDelete(task?._id)}
                      disabled={deleting}
                      className="text-red-500 text-lg font-semibold hover:text-red-600 transition cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {searchParam ? (
            <div></div>
          ) : (
            <div className="w-full md:w-2/3 lg:w-2/5 bg-white rounded-md shadow-sm p-4">
              <h2 className="text-lg font-medium text-black mb-3">Progress</h2>
              <div className="flex justify-center items-center">
                <div className="w-full h-3 bg-[#385682] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1200"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: "#3B82F6",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
