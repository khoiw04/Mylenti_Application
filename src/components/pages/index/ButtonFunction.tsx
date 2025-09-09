import type { ButtonFunctionType } from "@/types/pages";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function Main({ icon, title, description, align = 'center', src = "https://originui.com/dialog-content.png", onClick }: ButtonFunctionType) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className="popup_button_animation"
                    onClick={onClick}
                >
                    {icon}
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