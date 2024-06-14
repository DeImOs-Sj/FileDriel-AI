"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";



const ModeToggle = () => {
      const { setTheme } = useTheme();

  return (
      <div>
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-0 dark:scale-100" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      
    </div>
  )
}

export default ModeToggle
