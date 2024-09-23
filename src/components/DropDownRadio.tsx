"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from "axios";

interface dropdownInterface {
    currentState: string,
    secondState: string,
    thirdState: string,
    taskId: string,
    onStatusChange: (newStatus: string) => void;
}




export function DropdownMenuRadio({currentState, secondState, thirdState, taskId, onStatusChange}: dropdownInterface) {
  const [status, setStatus] = React.useState(currentState)
  
  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    try {
      console.log("Sending request with taskId:", taskId, "and newStatus:", newStatus);
      await axios.patch(`/api/change-status/${taskId}`, { newStatus });

      onStatusChange(newStatus);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline">{currentState}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={status} onValueChange={handleStatusChange}>
            {/* <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem> */}
            <DropdownMenuRadioItem value={secondState}>{secondState}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value={thirdState}>{thirdState}</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}
