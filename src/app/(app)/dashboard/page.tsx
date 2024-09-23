'use client'
import { Dialogg } from "@/components/Dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { DatePickerDemo } from "@/components/DatePicker"
import { TaskCard } from "@/components/TaskCard"
import KanBanDashboard from "@/components/KanBanDashboard"

export default function TabsDemo() {

    const { data: session, status } = useSession();
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);


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
    }, [status, setIsDialogOpen]);

    console.log(tasks);

    const handleSaveTask = (task: any) => {
        if (task._id) {
            // Update existing task
            axios.put(`/api/update-task/${task._id}`, task)
                .then(response => {
                    setTasks(tasks.map(t => (t._id === task._id ? response.data.task : t)));
                })
                .catch(err => {
                    console.error('Error updating task:', err);
                });
        } else {
            // Create a new task
            axios.post('/api/create-task', task)
                .then(response => {
                    setTasks([...tasks, response.data.task]);
                })
                .catch(err => {
                    console.error('Error creating task:', err);
                });
        }
        setIsDialogOpen(false);
    };



    if (status === 'loading') {
        return <div>Loading...</div>; 
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
