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
import { UpdateDialog } from "./UpdateTaskDialog";
import toast from "react-hot-toast";


export function TaskCard() {
    
    
    const { data: session, status } = useSession();
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [sortCriteria, setSortCriteria] = useState<'createdAt' | 'lastUpdated'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        if (status === 'authenticated') {
            axios.get('/api/get-all-tasks')
                .then(response => {
                    const filteredTasks = response.data.tasks.filter(task => task.status !== 'Completed');
                    const sortedTasks = sortTasks(filteredTasks, sortCriteria, sortOrder);
                    setTasks(sortedTasks);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching tasks:', err.response || err);
                    setError('Failed to load tasks');
                    setLoading(false);
                });
        }
    }, [status, sortCriteria, sortOrder]);
    
    console.log(tasks);

    const handleDelete = (taskId: string) => {
        axios.delete(`/api/delete-task/${taskId}`)
          .then(response => {
            console.log('Task deleted:', response.data);
            // Update the tasks state after successful deletion
            setTasks(tasks.filter(task => task._id !== taskId));
            toast.success('Task deleted successfully!');
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

  const sortTasks = (tasks: any[], criteria: 'createdAt' | 'lastUpdated', order: 'asc' | 'desc') => {
    return tasks.slice().sort((a, b) => {
      const dateA = new Date(a[criteria]);
      const dateB = new Date(b[criteria]);
  
      if (order === 'asc') {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });
  };

  return (

    <div className=" w-full flex flex-col items-center justify-center">
      <div className='m-4 mx-auto flex gap-2 items-center justify-center'>
        <label htmlFor="sortCriteria" className='mr-2'>Sort By:</label>
        <select
          id="sortCriteria"
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value as 'createdAt' | 'lastUpdated')}
          // className='mr-4'
          className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-full text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
        >
          <option value="createdAt">Created At</option>
          <option value="lastUpdated">Last Updated</option>
        </select>
        <label htmlFor="sortOrder" className='mr-2'>Order:</label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-full text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
        {tasks.length > 0 ? (
            tasks.map((card) => (
            <Card key={card._id} className="md:w-2/3 my-4 flex">
                <CardHeader className="w-2/3">
                    <CardTitle className="font-bold">{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2 items-center justify-evenly w-full m-0 p-2">
                    <Button variant="outline">{card.status}</Button>
                    <Button variant="outline">{card.priority}</Button>
                    <Button 
                      variant="outline"
                      className="w-fit p-0"
                      onClick={() => handleEdit(card)}
                    >
                      <div className="w-full">
                        {/* <p className="my-auto"></p> */}
                        <UpdateDialog currTitle={card.title} taskId={card._id} currDesc={card.description} currStatus={card.status} currPriority={card.priority} logo={false}/>
                        </div>
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
                // @ts-ignore
                task={selectedTask}
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleSave}
            />

    </div>
    
  )
}
