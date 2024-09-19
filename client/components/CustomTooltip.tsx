import TriggerProps from "@/types/types";
import React from "react";
import { TooltipContent, Tooltip, TooltipTrigger } from "./ui/tooltip";

interface CustomTooltipProps extends TriggerProps {
  message: string;
}

const CustomTooltip = ({ message, children }: CustomTooltipProps) => {
  return (
    <Tooltip defaultOpen={false} delayDuration={0}>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent>
        <span>{message}</span>
      </TooltipContent>
    </Tooltip>
  );
};

export default CustomTooltip;
