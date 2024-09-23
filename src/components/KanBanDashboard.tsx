import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { DropdownMenuRadio } from './DropDownRadio';
import { FaRegEdit } from "react-icons/fa";
import { UpdateDialog } from './UpdateTaskDialog';

export function KanBanDashboard() {

  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

const handleStatusChange = (taskId: string, newStatus: string) => {
  setTasks(prevTasks => 
    prevTasks.map(task => 
      task._id === taskId ? { ...task, status: newStatus } : task
    )
  );
};

  const toDoTasks = tasks.filter(task => task.status === 'ToDo');
  const inProgressTasks = tasks.filter(task => task.status === 'InProgress');
  const completedTasks = tasks.filter(task => task.status === 'Completed');

  return (
    <div className=' grid grid-cols-3 text-center border-2 w-4/5 mx-auto gap-2 m-2'> 

        <div className=' m-2'>
            <h2 className='bg-amber-400 mb-2 w-fit text-center mx-auto p-2 rounded-sm hover:bg-amber-500'>ToDo Tasks</h2> 
            {toDoTasks.map((task) => (
              <div key={task._id} className=' flex border flex-col min-h-36 p-4 rounded-lg mb-2'>
                <div className=''>
                  <div className='flex items-center justify-between'>
                    <p className='font-bold text-left'>{task.title}</p>
                    <button><UpdateDialog currTitle={task.title} taskId = {task._id} currDesc={task.description} currStatus={task.status} currPriority={task.priority}/></button>
                  </div>
                  <p className='font-medium text-gray-500 text-left'>{task.description ? task.description :  "No Description"}</p>
                </div>
                <div className='flex gap-2 flex-col'>
                  <p>Status: 
                    <DropdownMenuRadio 
                      taskId = {task._id} 
                      currentState={task.status} 
                      secondState="InProgress" 
                      thirdState="Completed"
                      onStatusChange={(newStatus) => handleStatusChange(task._id, newStatus)}
                    />
                  </p>
                  <p>Priority: {task.priority}</p>
                </div>
              </div>
            ))}
        </div>

        <div className='m-2'>
          <h2 className='bg-blue-400 mb-2 w-fit text-center mx-auto p-2 rounded-sm hover:bg-blue-500'>Inprogress Tasks</h2> 
            {inProgressTasks.map((task) => (
              <div key={task._id} className=' flex border flex-col min-h-36 p-4 rounded-lg mb-2'>
                <div className=''>
                  <p className='font-bold text-left'>{task.title}</p>
                  <p className='font-medium text-gray-500 text-left'>{task.description ? task.description :  "No Description"}</p>
                </div>
                <div>
                  <p>Status: 
                    <DropdownMenuRadio 
                      taskId = {task._id} 
                      currentState={task.status} 
                      secondState="ToDo" 
                      thirdState="Completed"
                      onStatusChange={(newStatus) => handleStatusChange(task._id, newStatus)}
                    />
                  </p>
                  <p>Priority: {task.priority}</p>
                </div>
              </div>
            ))} 
        </div>

        <div className=' m-2'>
          <h2 className='bg-green-400 mb-2 w-fit text-center mx-auto p-2 rounded-sm hover:bg-green-500'>Completed Tasks</h2> 
            {completedTasks.map((task) => (
              <div key={task._id} className=' flex border flex-col min-h-36 p-4 rounded-lg mb-2'>
                <div className=''>
                  <p className='font-bold text-left'>{task.title}</p>
                  <p className='font-medium text-gray-500 text-left'>{task.description ? task.description :  "No Description"}</p>
                </div>
                <div>
                  <p>Status: {task.status}</p>
                  <p>Priority: {task.priority}</p>
                </div>
              </div>
            ))}
        </div>
        
    </div>
  )
}

export default KanBanDashboard