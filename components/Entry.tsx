"use client";
import { useAddTaskMutation } from "@/services/queries/othersApi";
import { AddTaskType, TaskPayload } from "@/services/types";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Entry() {
  const [addData, { isLoading: isAddingTask }] = useAddTaskMutation<any>();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const title = e.currentTarget.title.value;
    const time = e.currentTarget.time.value;
    const date = e.currentTarget.date.value;

    const payload: AddTaskType = {
      title,
      time,
      date,
    };

    for (const key in payload) {
      if (!payload[key as keyof typeof payload]) {
        return toast.error(`${key} is required`);
      }
    }
    try {
      const result: any = await addData(payload);
      if (result?.data?._id) {
        toast.success("Task added successfully");
      }
    } catch (error) {
      console.log("error", error);
      return toast.error("Failed to create a task");
    }
  };

  return (
    <div className="w-full flex justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-2/3 lg:w-2/5 bg-white mt-16 md:mt-20 rounded-xl shadow-md py-10 px-6 md:px-10"
      >
        <h2 className="text-2xl md:text-3xl py-2 text-center text-black font-semibold">
          Add a new task
        </h2>

        <div className="space-y-6 mt-6">
          <div>
            <label className="block text-black text-sm mb-2">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter task title"
              className="w-full h-12 rounded-lg bg-[#F7F7F7] border border-[#BCBCBC] px-4 outline-0 text-black"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-black text-sm mb-2">Date</label>
              <input
                type="date"
                name="date"
                className="w-full h-12 rounded-lg bg-[#F7F7F7] border border-[#BCBCBC] px-4 outline-0 text-black"
              />
            </div>
            <div>
              <label className="block text-black text-sm mb-2">Time</label>
              <input
                type="time"
                name="time"
                className="w-full h-12 rounded-lg bg-[#F7F7F7] border border-[#BCBCBC] px-4 outline-0 text-black"
              />
            </div>
          </div>

          {/* <div>
            <label className="block text-black text-sm mb-2">Description</label>
            <textarea
              name="description"
              placeholder="Write task details..."
              rows={4}
              className="w-full rounded-lg bg-[#F7F7F7] border border-[#BCBCBC] px-4 py-3 outline-0 text-black resize-none"
            ></textarea>
          </div> */}

          <button
            type="submit"
            disabled={isAddingTask}
            className="w-full h-12 bg-[#3B82F6] text-white rounded-md text-lg font-medium hover:bg-[#2563EB] transition cursor-pointer"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
}

export default Entry;
