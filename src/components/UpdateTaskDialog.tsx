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
import { FaRegEdit } from "react-icons/fa";

interface UpdateDialogInterface {
    currTitle: string,
    currDesc: string,
    currStatus: string,
    currPriority: string,
    taskId: string
}

export function UpdateDialog({currTitle, taskId, currDesc, currStatus, currPriority}:UpdateDialogInterface) {
  // Form States
  const [title, setTitle] = useState<string>(currTitle);
  const [description, setDescription] = useState<string>(currDesc);
  const [taskStatus, setTaskStatus] = useState<string>(currStatus);
  const [priority, setPriority] = useState<string>(currPriority);
  const [dueDate, setDueDate] = useState<Date>();
//   const [taskId, setTaskId] = useState<string>(taskId);

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
      .patch(`/api/update-task/${taskId}`, newTask)
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
            <FaRegEdit />
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
                defaultValue={currTitle}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                defaultValue={currDesc}
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
              Update Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </UIDialog>
    </div>
  );
}
