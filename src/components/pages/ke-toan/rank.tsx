import { useStore } from "@tanstack/react-store";
import { CircleUser } from "lucide-react";
import { NumericFormat } from "react-number-format";
import type { ComponentProps } from "react";
import type { DonateDataType } from "@/types/hooks/returnType";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { donatePropsStore } from "@/store/donate-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Main() {
    const data = useStore(donatePropsStore, (state) => state.donateData)
    const virtualizers = useStore(donatePropsStore, (state) => state.virtualizers)
        
    return (
        <TabsContent asChild value="Xếp hạng">
          <ScrollArea ref={virtualizers.rankRef} className="!flex-none relative h-[65vmin] w-4/5 mx-auto pt-20">
            <Table>
              <TableCaption>Xếp hạng người dùng gần đây.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Người Dùng</TableHead>
                  <TableHead className="text-right">Tổng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {virtualizers.virtualizeRank.getVirtualItems().map((virtualRow) => (
                  <TabRank
                    {...data.rankDonates[virtualRow.index]}
                    key={`tab_rank!${virtualRow.index}`}
                    style={{
                      transform: `translateY(${
                        virtualRow.index * virtualRow.size
                      }px)`
                    }}
                  />
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </TabsContent>
    )
}

function TabRank(props: DonateDataType & ComponentProps<'tr'>) {
  const { display_avatar: user_avatar, display_name: user_name, user_name: prefix_user, transfer_amount, ...trProps } = props
  return (
    <TableRow {...trProps}>
      <TableCell className="font-medium flex flex-row items-center gap-4">
        <Avatar className='ml-1 size-2/8'>
          {user_avatar ? (
            <>
              <AvatarImage src={user_avatar} />
              <AvatarFallback>
                <Skeleton className="size-full" />
              </AvatarFallback>
            </>
          ) : (
            <>
              <CircleUser className="absolute_center size-1/2 stroke-1 text-neutral-600" />
              <AvatarFallback>
                <div className="size-full bg-neutral-100" />
              </AvatarFallback>
            </>
          )}
        </Avatar>
        <span>
          {user_name}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <NumericFormat
          value={transfer_amount}
          displayType="text"       
          thousandSeparator="."     
          decimalSeparator=","      
          suffix="đ"
        />
      </TableCell>
    </TableRow>
  )
}