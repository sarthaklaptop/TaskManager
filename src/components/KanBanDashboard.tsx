"use client"

import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { DropdownMenuRadio } from './DropDownRadio';
import { UpdateDialog } from './UpdateTaskDialog';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import toast from 'react-hot-toast';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import { GrInProgress } from "react-icons/gr";
import TaskAltIcon from '@mui/icons-material/TaskAlt';

export function KanBanDashboard() {
  const { data: session, status } = useSession();
  const [todoTasks, setTodoTasks] = useState<any[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<any[]>([]);
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortCriteria, setSortCriteria] = useState<'createdAt' | 'lastUpdated'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    if (status === 'authenticated') {
      axios.get('/api/get-all-tasks')
        .then(response => {
          const tasks = response.data.tasks;
          // const sortedTasks = tasks(tasks, sortCriteria, sortOrder);
          setTasks(tasks);
          setTodoTasks(tasks.filter((task: { status: string; }) => task.status === 'ToDo'));
          setInProgressTasks(tasks.filter((task: { status: string; }) => task.status === 'InProgress'));
          setCompletedTasks(tasks.filter((task: { status: string; }) => task.status === 'Completed'));
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching tasks:', err.response || err);
          setError('Failed to load tasks');
          setLoading(false);
        });
    }
  }, [status, sortCriteria, sortOrder]);

  useEffect(() => {
    console.log("Tasks state updated: ", todoTasks, inProgressTasks, completedTasks);
  }, [todoTasks, inProgressTasks, completedTasks]);    


  const handleStatusChange = (taskId: string, newStatus: string) => {
    setTodoTasks(prevTasks => prevTasks.map(task =>
      task._id === taskId ? { ...task, status: newStatus } : task
    ));
    setInProgressTasks(prevTasks => prevTasks.map(task =>
      task._id === taskId ? { ...task, status: newStatus } : task
    ));
    setCompletedTasks(prevTasks => prevTasks.map(task =>
      task._id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  // console.log("tasks:- ", tasks);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    if (!result.source || !result.destination) {
      console.log("Drag source or destination missing");
      return;
    }

    const { source, destination } = result;

    if(!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    
    
    try {

      let updatedTodoTasks = [...todoTasks];
      let updatedInProgressTasks = [...inProgressTasks];
      let updatedCompletedTasks = [...completedTasks];

      const [movedTask] = (
        source.droppableId === 'ToDo' ? updatedTodoTasks :
        source.droppableId === 'InProgress' ? updatedInProgressTasks :
        updatedCompletedTasks
      ).splice(source.index, 1);

      if (!movedTask) {
        console.error('No task found at the source index:', source.index);
        return;
      }

      movedTask.status = destination.droppableId;

      if (destination.droppableId === 'ToDo') {
        updatedTodoTasks.splice(destination.index, 0, movedTask);
      } else if (destination.droppableId === 'InProgress') {
        updatedInProgressTasks.splice(destination.index, 0, movedTask);
      } else {
        updatedCompletedTasks.splice(destination.index, 0, movedTask);
      }

      setTodoTasks(updatedTodoTasks);
      setInProgressTasks(updatedInProgressTasks);
      setCompletedTasks(updatedCompletedTasks);

      // console.log("Updating task with ID:", movedTask._id, "to status:", movedTask.status);
      axios
        .patch(`/api/change-status/${movedTask._id}`, {newStatus: movedTask.status})
        .then((response) => {
          console.log("Task Updated", response.data);
          toast.success("Task Status Updated");
        })
        .catch((error) => {
          console.error("Error updating task status: ", error);
        });
    } catch (error) {
      console.error("Error Updating Task Status: ", error);
    }

  };

  // const getColumnTasks = (status: string) => tasks.filter(task => task.status === status);

  const getColumnTasks = (status: string) => {
    const filteredTasks = tasks.filter(task => task.status === status);
    return filteredTasks;
  };

  if (typeof window === "undefined") {
    return null;
  }

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        
        <div className='grid md:grid-cols-3  text-center border-2 w-4/5 mx-auto gap-2 m-2'>
          {/* ToDo Tasks */}
          <Droppable droppableId="ToDo">
            {(provided, snapshot) => (
              <div className='m-2 bg-[#dde8fe]' ref={provided.innerRef} {...provided.droppableProps}>
                <h2 className='mb-2 w-fit flex text-left mx-auto p-2 rounded-sm text-blue-600 font-semibold '> <span><CropSquareIcon/></span> ToDo Tasks</h2>
                  {/* <ScrollArea className="h-72 w-48 rounded-md border"> */}
                    <div className='bg-white m-2 p-2' {...provided.droppableProps} ref={provided.innerRef}>
                    {todoTasks.map((task, index) => (
                      <Draggable key={task._id.toString()} draggableId={task._id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div
                            className='flex bg-white border-gray-600 flex-col min-h-36 p-4 rounded-lg mb-2'
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className='flex items-center justify-between'>
                              <p className='font-bold text-left'>{task.title}</p>
                              <button><UpdateDialog currTitle={task.title} taskId={task._id} currDesc={task.description} currStatus={task.status} currPriority={task.priority} logo={true}/></button>
                            </div>
                            <p className='font-medium text-gray-500 text-left'>{task.description || "No Description"}</p>
                            <p className='font-bold'>Priority: {task.priority}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>

                  {/* </ScrollArea> */}
              </div>
              
            )}
          </Droppable>


          {/* In Progress Tasks */}
          <Droppable droppableId="InProgress">
            {(provided, snapshot) => (
              <div className='m-2 bg-[#faecd7]'>
                <h2 className=' mb-2 w-fit flex text-left mx-auto items-center text-amber-600 font-semibold p-2 rounded-sm'> <span><GrInProgress/></span> InProgress Tasks</h2>
                <div className='bg-white m-2 p-2' {...provided.droppableProps} ref={provided.innerRef}>
                  {inProgressTasks.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <div
                          className='flex bg-white border-gray-600 flex-col min-h-36 p-4 rounded-lg mb-2'
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className='flex items-center justify-between'>
                              <p className='font-bold text-left'>{task.title}</p>
                              <button><UpdateDialog currTitle={task.title} taskId={task._id} currDesc={task.description} currStatus={task.status} currPriority={task.priority} logo={true} /></button>
                            </div>
                          <p className='font-medium text-gray-500 text-left'>{task.description || "No Description"}</p>
                          {/* <DropdownMenuRadio
                            taskId={task._id}
                            currentState={task.status}
                            secondState="ToDo"
                            thirdState="Completed"
                            onStatusChange={(newStatus) => handleStatusChange(task._id, newStatus)}
                          /> */}
                          <p className='font-bold'>Priority: {task.priority}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>

          {/* Completed Tasks */}
          <Droppable droppableId="Completed">
            {(provided, snapshot) => (
              <div className='m-2 bg-[#fdf1ed]'>
                <h2 className='mb-2 w-fit text-red-400 font-semibold text-center mx-auto p-2 rounded-sm'> <span><TaskAltIcon/></span>Completed Tasks</h2>
                <div className='bg-white m-2 p-2' {...provided.droppableProps} ref={provided.innerRef}>
                  {completedTasks.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <div
                          className='flex bg-white flex-col min-h-36 p-4 rounded-lg mb-2'
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <p className='font-bold text-left'>{task.title}</p>
                          <p className='font-medium text-gray-500 text-left'>{task.description || "No Description"}</p>
                          <p className='font-bold'>Priority: {task.priority}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>

        </div>
      </DragDropContext>
    </div>
  );
}

export default KanBanDashboard;
