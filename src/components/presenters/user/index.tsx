import { CircleUser } from "lucide-react";
import type { AvatarProps } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export function AvatarProfile({ url }: AvatarProps) {
  return (
    <Avatar className="size-12 sm:size-[6vmin] lg:size-[8vmin] relative mx-auto">
        {url?.trim() ?
        <>
          <AvatarImage src={url} />
          <AvatarFallback>
            <Skeleton className="size-full" />
          </AvatarFallback>
        </> :
          <>
          <CircleUser className="absolute_center size-1/2 max-w-8 max-h-8 stroke-1 text-neutral-600" />
          <AvatarFallback>
            <div className="size-full bg-neutral-100" />
          </AvatarFallback>
          </>
        }
    </Avatar>
  )
}