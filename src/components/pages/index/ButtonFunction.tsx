import { LucideCheck } from "lucide-react";
import { useState } from "react";
import type { ButtonFunctionType } from "@/types";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function Main({ icon, title, description, align = 'center', src = "https://coss.com/origin/dialog-content.png", onClick }: ButtonFunctionType) {
    const [copied, setCopied] = useState(false)

    const handleClick = () => {
        onClick?.()
        setCopied(true)

        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className="popup_button_animation bg-background/45 hover:bg-background/60"
                    onClick={handleClick}
                >
                    {!copied && icon}
                    {<LucideCheck data-show={copied} className="popup_icon" />}
                </Button>
            </TooltipTrigger>
            <TooltipContent align={align} className="py-3">
                <div className="space-y-2">
                    <img
                        className="w-full rounded"
                        src={src}
                        width={382}
                        height={216}
                        alt="Content image"
                    />
                    <div className="space-y-1">
                    <p className="text-[13px] font-medium">
                        {title}
                    </p>
                    <p className="text-muted-foreground text-xs">
                        {description}
                    </p>
                    </div>
                </div>
            </TooltipContent>
        </Tooltip>
    )
}