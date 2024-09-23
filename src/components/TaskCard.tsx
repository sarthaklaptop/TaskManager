import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from "axios"
import { useSession } from "next-auth/react"
import { Dialogg } from "./Dialog";


export function TaskCard() {
    
    
    const { data: session, status } = useSession();
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        if (status === 'authenticated') {
            axios.get('/api/get-all-tasks')
                .then(response => {
                    setTasks(response.data.tasks);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching tasks:', err.response || err);
                    setError('Failed to load tasks');
                    setLoading(false);
                });
        }
    }, [status]);
    
    console.log(tasks);

    const handleDelete = (taskId: string) => {
        axios.delete(`/api/delete-task/${taskId}`)
          .then(response => {
            console.log('Task deleted:', response.data);
            // Update the tasks state after successful deletion
            setTasks(tasks.filter(task => task._id !== taskId));
          })
          .catch(err => {
            console.error('Error deleting task:', err);
          });
    };
    
    const handleEdit = (task: any) => {
      setSelectedTask(task);
      setIsDialogOpen(true);
    };

    const handleSave = (task: any) => {
      if (task._id) {
          axios.put(`/api/update-task/${task._id}`, task)
              .then(response => {
                  console.log('Task updated:', response.data);
                  // Update the tasks state after successful update
                  setTasks(tasks.map(t => t._id === task._id ? task : t));
              })
              .catch(err => {
                  console.error('Error updating task:', err);
              });
      } else {
          // Create a new task
          axios.post('/api/create-task', task)
              .then(response => {
                  console.log('Task created:', response.data);
                  // Add the new task to the tasks state
                  setTasks([...tasks, response.data.task]);
              })
              .catch(err => {
                  console.error('Error creating task:', err);
              });
      }
  };

  return (

    <div className=" w-full flex flex-col items-center justify-center">
        {tasks.length > 0 ? (
            tasks.map((card) => (
            <Card key={card._id} className="w-2/3 my-4">
                <CardHeader>
                    <CardTitle>Title:- {card.title}</CardTitle>
                    <CardDescription>Description:- {card.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2 items-center justify-evenly w-full m-0 p-2">
                    <Button variant="outline">{card.status}</Button>
                    <Button variant="outline">{card.priority}</Button>
                    <Button 
                      variant="outline"
                      className="hover:bg-blue-400 transition-all duration-200 hover:text-white"
                      onClick={() => handleEdit(card)}
                    >
                      Edit
                    </Button>
                    <Button
                        variant="outline"
                        className="hover:bg-red-400 transition-all duration-200 hover:text-white"
                        onClick={() => handleDelete(card._id)}
                    >
                        Delete
                    </Button>
                </CardContent>
            </Card>
            ))
        ) : (
            <div>No tasks found</div>
        )}

            <Dialogg
                task={selectedTask}
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleSave}
            />

    </div>
    
  )
}
