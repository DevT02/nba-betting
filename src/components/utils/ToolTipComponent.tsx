"use client"

import * as React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

const InfoTooltip = ({ text, className }: { text: React.ReactNode, className?: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Info 
        className={`h-3.5 w-3.5 inline-flex items-center -mt-0.5 flex-shrink-0 ml-1 ${className || "text-muted-foreground hover:text-foreground"}`}
        onClick={(e) => e.stopPropagation()}
      />
    </TooltipTrigger>
    <TooltipContent 
      className="max-w-[250px] text-sm bg-card text-card-foreground border border-border shadow-md"
      sideOffset={5}
    >
      {typeof text === 'string' ? (
        <p className="leading-relaxed font-medium py-1">{text}</p>
      ) : text}
    </TooltipContent>
  </Tooltip>
)

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, InfoTooltip }