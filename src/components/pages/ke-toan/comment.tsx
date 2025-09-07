import { useStore } from "@tanstack/react-store";
import { CircleUser } from "lucide-react";
import { NumericFormat } from "react-number-format";
import type { ComponentProps } from "react";
import type { DonateDataType } from "@/types/hooks/returnType";
import { TabsContent } from "@/components/ui/tabs";
import { donatePropsStore } from "@/store/donate-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { timeAgo } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Main() {
    const data = useStore(donatePropsStore, (state) => state.donateData)
    const virtualizers = useStore(donatePropsStore, (state) => state.virtualizers)

    return (
      <TabsContent asChild value="Bình luận">
        <ScrollArea ref={virtualizers.commentRef} className='!flex-none h-[65vmin]'>
            <div
              style={{
                height: virtualizers.virtualizeComment.getTotalSize(),
                width: '100%',
                position: 'relative',
              }}
            >
              <ul
                className='pt-20 *:py-6 divide-y *:w-3/4 *:mx-auto'
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualizers.virtualizeComment.getVirtualItems()[0]?.start ?? 0}px)`,
                }}
              >
                {virtualizers.virtualizeComment.getVirtualItems().map((virtualRow) => (
                    <TabCommentUI
                      key={`donates_${virtualRow.key}`}
                      ref={virtualizers.virtualizeComment.measureElement}
                      data-index={virtualRow.index}
                      {...data.donateList[virtualRow.index]}
                    />
                  )
                )}
              </ul>
            </div>
            <p className='text-muted-foreground text-sm text-center mt-24 mb-16'>
              Những người bình luận gần đây.
            </p>
        </ScrollArea>
      </TabsContent>
    )
}

function TabCommentUI(props: DonateDataType & ComponentProps<'li'>) {
  const { display_avatar: user_avatar, code, user_name: prefix_user, created_at, message, transfer_amount, ...liProps } = props
  return (
    <li {...liProps} className="flex justify-start gap-4">
      <Avatar>
        {user_avatar ?
        <>
          <AvatarImage src={user_avatar} />
          <AvatarFallback>
            <Skeleton className="size-full" />
          </AvatarFallback> 
        </>
        :
        <>
          <CircleUser className="absolute_center size-1/2 stroke-1 text-neutral-600" />
          <AvatarFallback>
            <div className="size-full bg-neutral-100" />
          </AvatarFallback>
        </>}
      </Avatar>
      <div className="space-y-1 max-w-full">
        <div className="text-sm font-semibold flex flex-row gap-1 items-center">
          <h4 id={code}>
            <span>
              {prefix_user}
            </span>
          </h4>
          <span>•</span>
          <span className='text-xs'>
            {timeAgo(created_at)}
          </span>
        </div>
        <p className="text-sm break-words whitespace-normal">{message}</p>
        <div className="text-muted-foreground text-xs">
          <span className='mr-[0.5ch]'>Gửi:</span>
          <NumericFormat
            value={transfer_amount}
            displayType="text"       
            thousandSeparator="."     
            decimalSeparator=","      
            suffix="đ"
            className='text-muted-foreground text-xs'
          />
        </div>
      </div>
    </li>
  )
}