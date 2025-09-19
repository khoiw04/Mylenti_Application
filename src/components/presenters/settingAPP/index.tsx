import { LucideInbox, LucideKeyRound } from "lucide-react"

import { useEffect, useState } from "react"
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { motion } from "motion/react";
import { useStore } from "@tanstack/react-store";
import type { Update } from '@tauri-apps/plugin-updater';
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ThemeSwitcher } from "@/components/ui/kibo-ui/theme-switcher";
import { ThemeStore } from "@/store";

const items = [
  {
    title: "API Key",
    url: "#API_KEY",
    icon: LucideKeyRound,
  },
  {
    title: "Cập Nhật",
    url: "#UPDATE",
    icon: LucideInbox,
  }
] 

export default function SettingApp() {
    const [open, setOpen] = useState(false)
    const { theme, setTheme } = useStore(ThemeStore)
    const [updateData, setUpdateData] = useState<{
        data: Update | null,
        allowUpdate: boolean,
        tracking: string,
        percent: number
    }>({
        data: null,
        allowUpdate: false,
        tracking: '',
        percent: 0
    })

    useEffect(() => {
        (async () => {
            const update = await check()
            if (update) {
                setUpdateData((prev) => ({ ...prev, data: update }))
            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            if (updateData.allowUpdate && updateData.data) {
                let downloaded = 0;
                let contentLength = 0;

                await updateData.data.downloadAndInstall((event) => {
                    switch (event.event) {
                        case 'Started':
                            contentLength = event.data.contentLength!;
                            break;
                        case 'Progress': {
                            downloaded += event.data.chunkLength;
                            const percent = ((downloaded / contentLength) * 100);
                            setUpdateData((prev) => ({
                                ...prev,
                                tracking: `${downloaded} / ${contentLength} bytes`,
                                percent: percent
                            }))
                            break;
                        }
                    }
                });

                await relaunch()
                return () => updateData.data?.close()
            }
        })()
    }, [updateData.allowUpdate, updateData.data])

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
                    <div className="flex flex-row gap-2 items-center mt-4 ml-4">
                        <ThemeSwitcher onChange={setTheme} value={theme ?? 'light'} defaultValue={theme ?? 'light'} />
                        <SidebarTrigger className="px-3 py-2 bg-gray-100 dark:bg-gray-900 rounded">
                            Mở menu
                        </SidebarTrigger>
                    </div>
                    <main className="relative flex flex-col pt-5 px-4 gap-12">
                        <form className="flex flex-col gap-4 pt-4">
                            <div id="API_KEY" className="flex flex-row gap-2 ml-1.5">
                                <LucideKeyRound size={16} />
                                <Label id={items[0].url} className="font-medium">
                                    {items[0].title}
                                </Label>
                            </div>
                            <Input disabled placeholder="Cập nhật sau..." className="w-40" />
                        </form>
                        <div className="flex flex-col gap-3.75 pt-4 max-w-78">
                            <div id="UPDATE" className="flex flex-row gap-2 ml-0.5">
                                <LucideInbox size={16} />
                                <Label id={items[1].url} className="font-medium">
                                    {items[1].title}
                                </Label>
                            </div>
                            <ul className="flex flex-col gap-y-1.5 text-neutral-400 text-sm">
                                <li>Phiên bản: 0.1.0</li>
                                <li>Ngày cập nhật: 18/09/2025</li>
                            </ul>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        disabled={updateData.allowUpdate || !updateData.data}
                                        type="button" 
                                        className="w-40 mt-10 overflow-clip relative"
                                        onClick={() => {
                                            setUpdateData(prev => ({
                                                ...prev,
                                                allowUpdate: true
                                            }))
                                        }}
                                    >
                                        Cập Nhật
                                        {updateData.allowUpdate &&
                                        <motion.span
                                            style={{
                                                width: `${updateData.percent}%`
                                            }}
                                            className="
                                                absolute 
                                                bottom-0 left-0 
                                                origin-bottom-left 
                                                h-[2px] 
                                                bg-muted-foreground
                                            "
                                        />
                                        }
                                    </Button>
                                    </TooltipTrigger>
                                    {!updateData.allowUpdate &&
                                    <TooltipContent side="bottom" align="start" className="px-1 py-0.5 text-xs">
                                        {updateData.tracking}
                                        <kbd className="bg-background text-muted-foreground/70 ms-2 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                                            {updateData.percent.toFixed(2)}
                                        </kbd>
                                    </TooltipContent>
                                    }
                                    {!updateData.allowUpdate && 
                                    <TooltipContent side="bottom" align="start" className="py-3">
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                            <h2 className="font-semibold">
                                                Bản cập nhật mới
                                            </h2>
                                            <p className="text-muted-foreground text-sm">
                                                {updateData.data?.body}
                                            </p>
                                            </div>
                                            <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                            <span>1 phút đọc</span>
                                            <span>·</span>
                                            <span>
                                                Đã cập nhật:
                                                {updateData.data?.date}
                                            </span>
                                            </div>
                                        </div>
                                    </TooltipContent>
                                    }
                            </Tooltip>
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