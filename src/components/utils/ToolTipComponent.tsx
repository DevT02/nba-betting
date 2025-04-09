"use client"

import * as React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

export const InfoTooltip = ({
  text,
  className,
  isMobile = false
}: {
  text: React.ReactNode
  className?: string
  isMobile?: boolean
}) => {
  const [open, setOpen] = React.useState(false)
  const isMobileDevice = isMobile || false

  React.useEffect(() => {
    if (!isMobileDevice) return
    const close = () => setOpen(false)
    document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [])

  const handleClick = (e: React.MouseEvent) => {
    if (isMobileDevice) {
      e.stopPropagation()
      setOpen((prev) => !prev)
    }
  }

  return (
    <Tooltip open={isMobileDevice ? open : undefined} onOpenChange={setOpen} delayDuration={100}>
      <TooltipTrigger asChild>
        <Info
          className={`h-3.5 w-3.5 inline-flex items-center -mt-0.5 flex-shrink-0 ml-1 ${
            className || "text-muted-foreground hover:text-foreground"
          }`}
          onClick={handleClick}
        />
      </TooltipTrigger>
      <TooltipContent
        className="max-w-[250px] text-sm bg-card text-card-foreground border border-border shadow-md"
        sideOffset={5}
      >
        {typeof text === "string" ? (
          <p className="leading-relaxed font-medium py-1">{text}</p>
        ) : (
          text
        )}
      </TooltipContent>
    </Tooltip>
  )
}


export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider}