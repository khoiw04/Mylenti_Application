import { LucideInbox, LucideKeyRound } from "lucide-react"

import { useState } from "react"
import { 
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { DialogClose } from "@/components/ui/dialog"

const items = [
  {
    title: "API Key",
    url: "#",
    icon: LucideKeyRound,
  },
  {
    title: "Cập Nhật",
    url: "#",
    icon: LucideInbox,
  }
] 

export default function SettingApp() {
    const [open, setOpen] = useState(false)

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "14rem",
                    "--sidebar-width-mobile": "20rem",
                } as React.CSSProperties
            }
            open={open} onOpenChange={setOpen}
        >
            <Sidebar collapsible="icon" className="overflow-y-auto sm:max-h-[700px]">
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent className="pt-4">
                            <SidebarMenu>
                            {items.map((project) => (
                                <SidebarMenuItem key={project.title}>
                                <SidebarMenuButton asChild>
                                    <a href={project.url}>
                                        <project.icon />
                                        <span>{project.title}</span>
                                    </a>
                                </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
            <SidebarInset className="relative">
                    <SidebarTrigger className="mt-4 ml-4 px-3 py-2 bg-gray-100 rounded">
                        Mở menu
                    </SidebarTrigger>
                    <main className="relative flex flex-col pt-5 px-4 gap-12">
                        <form className="flex flex-col gap-4 pt-4">
                            <div className="flex flex-row gap-2 ml-1.5">
                                <LucideKeyRound size={16} />
                                <Label id={items[0].url} className="font-medium">
                                    {items[0].title}
                                </Label>
                            </div>
                            <Input disabled placeholder="Cập nhật sau..." className="w-40" />
                        </form>
                        <div className="flex flex-col gap-3.75 pt-4 max-w-78">
                            <div className="flex flex-row gap-2 ml-0.5">
                                <LucideInbox size={16} />
                                <Label id={items[1].url} className="font-medium">
                                    {items[1].title}
                                </Label>
                            </div>
                            <ul className="flex flex-col gap-y-1.5 text-neutral-400 text-sm">
                                <li>Phiên bản: 1.0.0</li>
                                <li>Ngày cập nhật: 09/09/2025</li>
                            </ul>
                            <Button type="button" className="w-40 mt-10">
                                Cập Nhật
                            </Button>
                        </div>
                    </main>
                    <footer className="flex flex-row gap-2 fixed bottom-4 right-4">
                        <DialogClose asChild>
                            <Button variant="ghost" type="button">
                                Hủy
                            </Button>
                        </DialogClose>
                        <Button type="button">
                            Áp dụng
                        </Button>
                    </footer>
            </SidebarInset>
            <SidebarRail />
        </SidebarProvider>
    )
}