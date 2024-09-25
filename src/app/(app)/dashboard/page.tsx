'use client'
import { Dialogg } from "@/components/Dialog"
// import { Button } from "@/components/ui/button"
import {
  Card
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { TaskCard } from "@/components/TaskCard"
import KanBanDashboard from "@/components/KanBanDashboard"

interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'ToDo' | 'InProgress' | 'Completed';
    priority: 'Low' | 'Medium' | 'High';
    dueDate: string;
  }

export default function TabsDemo() {

    const { data: session, status } = useSession();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    // const [selectedTask, setSelectedTask] = useState<any>(null);


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

    // const handleSaveTask = (task: any) => {
    //     if (task._id) {
    //         // Update existing task
    //         axios.put(`/api/update-task/${task._id}`, task)
    //             .then(response => {
    //                 setTasks(tasks.map(t => (t._id === task._id ? response.data.task : t)));
    //             })
    //             .catch(err => {
    //                 console.error('Error updating task:', err);
    //             });
    //     } else {
    //         // Create a new task
    //         axios.post('/api/create-task', task)
    //             .then(response => {
    //                 setTasks([...tasks, response.data.task]);
    //             })
    //             .catch(err => {
    //                 console.error('Error creating task:', err);
    //             });
    //     }
    //     // setIsDialogOpen(false);
    // };



    if (status === 'loading') {
        return <div className="w-full h-full">
            <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
                <svg className="text-gray-300 animate-spin" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24">
                    <path
                    d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                    stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path
                    d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                    stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" className="text-gray-900">
                    </path>
                </svg>
            </div>
        </div>
    }

  return (
    <div className=" flex w-full flex-col g-2 mx-auto items-center justify-center p-4">
        <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="alltasks">All Tasks</TabsTrigger>
                <TabsTrigger value="kanbandashboard">Kanban Dashboard</TabsTrigger>
            </TabsList>
            <TabsContent className="flex items-center w-full justify-center mx-auto" value="alltasks">
                <div className="w-full">
                    <Card className="w-1/6 flex items-center justify-center mx-auto">
                        <Dialogg/>
                    </Card>
                    <div>
                        <TaskCard/>
                    </div>
                </div>
                <div>

                </div>
            </TabsContent>
            <TabsContent value="kanbandashboard">
                <div className="w-full ">
                    <Card className="w-1/6 flex items-center justify-center mx-auto">
                        <Dialogg/>
                    </Card>
                    <div>
                        <KanBanDashboard/>
                    </div>
                </div>
            </TabsContent>
        </Tabs>

    </div>
  )
}
