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
        <DialogContent className="sm:max-w-[425px] bg-gray-500 text-white">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title">Title</Label>
              <Input
                required
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status">Status</Label>
              <Select value={taskStatus} onValueChange={setTaskStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="ToDo">ToDo</SelectItem>
                  <SelectItem value="InProgress">InProgress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate">Due Date</Label>
              {/* @ts-ignore */}
              <DatePickerDemo value={dueDate} onChange={setDueDate} />
            </div>
          </div>
          <DialogFooter>
            <Button className="border-2" onClick={handleSaveChanges}>
              Save Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </UIDialog>
    </div>
  );
}
