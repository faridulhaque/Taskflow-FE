"use client";
import {
  useGetOneTaskQuery,
  useUpdateTaskMutation,
} from "@/services/queries/othersApi";
import { useParams } from "next/navigation";
import React from "react";
import Loading from "./Loading";
import {
  AddTaskType,
  TaskPayload,
  UpdateArgs,
  UTaskPayload,
} from "@/services/types";
import { toast } from "react-toastify";

function Edit() {
  const params = useParams();

  const { data, isLoading: loadingData } = useGetOneTaskQuery(params.id, {
    skip: !params?.id,
  });
  const task = data as TaskPayload;

  const [update, { isLoading: updating }] = useUpdateTaskMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!params?.id) return toast.error("Id not found");
    const title = e.currentTarget.title.value;

    if (title?.length > 40)
      return toast.error("Title should not contain more than 40 characters");
    const time = e.currentTarget.time.value;
    const date = e.currentTarget.date.value;

    const payload: UTaskPayload = {
      title,
      time,
      date,
    };

    for (const key in payload) {
      if (!payload[key as keyof typeof payload]) {
        return toast.error(`${key} is required`);
      }
    }
    const args: UpdateArgs = {
      id: params?.id as string,
      payload,
    };
    try {
      const result: any = await update(args);
      if (result?.data?._id) {
        toast.success("Task updated successfully");
      }
    } catch (error) {
      console.log("error", error);
      return toast.error("Failed to create a task");
    }
  };

  if (loadingData) return <Loading></Loading>;

  return (
    <div className="w-full flex justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-2/3 lg:w-2/5 bg-white mt-16 md:mt-20 rounded-xl shadow-md py-10 px-6 md:px-10"
      >
        <h2 className="text-2xl md:text-3xl py-2 text-center text-black font-semibold">
          Update Task
        </h2>

        <div className="space-y-6 mt-6">
          <div>
            <label className="block text-black text-sm mb-2">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter task title"
              defaultValue={task?.title}
              className="w-full h-12 rounded-lg bg-[#F7F7F7] border border-[#BCBCBC] px-4 outline-0 text-black"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-black text-sm mb-2">Date</label>
              <input
                type="date"
                name="date"
                defaultValue={task?.date}
                className="w-full h-12 rounded-lg bg-[#F7F7F7] border border-[#BCBCBC] px-4 outline-0 text-black"
              />
            </div>

            <div>
              <label className="block text-black text-sm mb-2">Time</label>
              <input
                type="time"
                name="time"
                defaultValue={task?.time}
                className="w-full h-12 rounded-lg bg-[#F7F7F7] border border-[#BCBCBC] px-4 outline-0 text-black"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full h-12 bg-[#3B82F6] text-white rounded-md text-lg font-medium hover:bg-[#2563EB] transition cursor-pointer"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}
export default Edit;
