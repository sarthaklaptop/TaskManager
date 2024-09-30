"use client";

import {
  Dialog as UIDialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { DatePickerDemo } from "@/components/DatePicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export function Dialogg() {
  // Form States
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [taskStatus, setTaskStatus] = useState<string>("ToDo");
  const [priority, setPriority] = useState<string>("Low");
  const [dueDate, setDueDate] = useState<Date>();

  // Dialog open/close state
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const newTask = {
    title,
    description,
    status: taskStatus,
    priority,
    dueDate,
  };

  const handleSaveChanges = () => {
    // POST request to create a new task
    axios
      .post("/api/create-task", newTask)
      .then((response) => {
        console.log("Task saved:", response.data);
        setIsOpen(false);
        toast.success("Task Added successfully!");
      })
      .catch((err) => {
        console.error("Error saving task:", err);
      });
  };

  return (
    <div>
      <UIDialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setIsOpen(true)}>
            Add Task
          </Button>
        </DialogTrigger>
        <DialogContent className="w-2/3">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 w-full">
            <div className="w-full">
              <div className="grid items-center gap-4 w-full">
                {/* <Label htmlFor="title">Title</Label> */}
                <Input
                  placeholder="Title"
                  required
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="col-span-3 border-none font-bold w-full"
                />
              </div>
              <div className="grid items-center gap-4">
                {/* <Label htmlFor="description">Description</Label> */}
                <Input
                  placeholder="Description"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3 border-none font-light"
                />
              </div>
            </div>
            <div className=" flex gap-2 ">
              <div className="grid items-center gap-4">
                {/* <Label htmlFor="status">Status</Label> */}
                <Select value={taskStatus} onValueChange={setTaskStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Status">
                    {/* {taskStatus || ( <span className="text-muted-foreground">Status</span> )} */}
                    <span>Status</span>
                  </SelectValue>
                </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="ToDo">ToDo</SelectItem>
                    <SelectItem value="InProgress">InProgress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid items-center gap-4">
                {/* <Label htmlFor="priority">Priority</Label> */}
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="priority">
                    {/* <SelectValue placeholder="Select" /> */}
                    <span>Priority</span>
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid items-center gap-4">
                {/* <Label htmlFor="dueDate">Due Date</Label> */}
                {/* @ts-ignore */}
                <DatePickerDemo value={dueDate} onChange={setDueDate}/>
              </div>
            </div>
          </div>
          <DialogFooter>
            {/* <Button className="border-2" onClick={handleSaveChanges}>
              Save Task
            </Button> */}
            <button onClick={handleSaveChanges} className="px-8 py-2 rounded-md bg-black text-white font-bold transition duration-200 hover:bg-white hover:text-black border-2 border-transparent hover:border-red-400">
              Save Task
            </button>
          </DialogFooter>
        </DialogContent>
      </UIDialog>
    </div>
  );
}
