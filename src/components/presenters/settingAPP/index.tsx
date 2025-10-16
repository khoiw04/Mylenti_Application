import { LucideInbox, LucideLink2, LucideWebhook } from "lucide-react"

import React, { useEffect, useState } from "react"
import { motion } from "motion/react";
import { useStore } from "@tanstack/react-store";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { toast } from "sonner";
import type { Update } from '@tauri-apps/plugin-updater';
import type { SettingItemsType } from "@/types";
import type { TunnelStatus } from "@/class/CloudflareController";
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
import { DialogClose } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ThemeSwitcher } from "@/components/ui/kibo-ui/theme-switcher";
import { ThemeStore } from "@/store";
import useSQLiteDiscordInfo from "@/hooks/useSQLiteDiscordInfo";
import { APPCONFIG } from "@/data/config";
import { items, links } from "@/data/setting-app";
import { CloudflareController } from "@/class/CloudflareController";
import { AutoUpdateTauriManager } from "@/class/AutoUpdateTauriManager";

export default function SettingApp() {
    const { theme, setTheme } = useStore(ThemeStore)
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "14rem",
                    "--sidebar-width-mobile": "20rem",
                } as React.CSSProperties
            }
            defaultOpen={false}
        >
            <Sidebar collapsible="icon" className="overflow-y-auto sm:max-h-[700px]">
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent className="pt-4">
                            <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <a href={'#'+item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
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
                        <SidebarTrigger className="px-3 py-2 bg-gray-100 dark:bg-neutral-900 rounded">
                            Mở menu
                        </SidebarTrigger>
                    </div>
                    <main className="relative flex flex-col pt-5 px-4 gap-12">
                        <SettingItems
                            icon={<LucideLink2 size={16} />}
                            child={<SettingLinks />}
                            label={{
                                id: items[0].url,
                                title: items[0].title
                            }}
                        />
                        <SettingItems
                            icon={<LucideInbox size={16} />}
                            child={<SettingUpdates />}
                            label={{
                                id: items[1].url,
                                title: items[1].title
                            }}
                        />
                        <SettingItems
                            icon={<LucideWebhook size={16} />}
                            child={<SettingTunnel />}
                            label={{
                                id: items[2].url,
                                title: items[2].title
                            }}
                        />
                    </main>
                    <footer className="flex flex-row gap-2 fixed bottom-4 right-4">
                        <DialogClose asChild>
                            <Button type="button">
                                Áp dụng
                            </Button>
                        </DialogClose>
                    </footer>
            </SidebarInset>
            <SidebarRail />
        </SidebarProvider>
    )
}

function SettingItems({ label, child, icon }: SettingItemsType) {
    return (
        <div id={label.id} className="flex flex-col gap-4 pt-4">
            <div className="flex flex-row gap-2">
                {icon}
                <Label id={label.id} className="font-medium">
                    {label.title}
                </Label>
            </div>
            <ul className="flex flex-col gap-y-1.5 text-neutral-400 text-sm">
                {child}
            </ul>
        </div>
    )
}

function SettingLinks() {
    const { data: { user_name } } = useSQLiteDiscordInfo()    
    return (
    <>
        {links.map((link, i) => {
            const resolvedSlag = typeof link.slag === 'function' ? link.slag(user_name) : link.slag;
            const linkURL = APPCONFIG.URL.APP_URL(user_name) + resolvedSlag
            return (
                <li 
                    key={`link_${i}`}
                    className="cursor-pointer text-neutral-400 text-sm w-fit *:hover:underline"
                    >
                    <button
                        onClick={async () => {await writeText(linkURL); toast.success(`Đã lấy được link ${link.title}!`)}}
                    >
                        {link.title}
                    </button>
                </li>
            );
        })}
    </>        
    )
}

function SettingUpdates() {
    const [progress, setProgress] = useState({ updateData: null as Update | null, tracking: '', percent: '0.00', allowUpdate: false });    

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(AutoUpdateTauriManager.getData());
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <ul className="flex flex-col gap-y-1.5 text-neutral-400 text-sm">
                <li>Phiên bản: 0.1.0</li>
                <li>Ngày cập nhật: 18/09/2025</li>
            </ul>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button" 
                        disabled={!progress.updateData || progress.allowUpdate}
                        className="w-40 mt-10 overflow-clip relative"
                        onClick={() => AutoUpdateTauriManager.setUpdate(true)}
                    >
                        Cập Nhật
                        {progress.allowUpdate &&
                        <motion.span
                            style={{
                                width: `${progress.percent}%`
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
                    {progress.allowUpdate &&
                    <TooltipContent side="bottom" align="start" className="px-1 py-0.5 text-xs">
                        {progress.tracking}
                        <kbd className="bg-background text-muted-foreground/70 ms-2 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                            {progress.percent}
                        </kbd>
                    </TooltipContent>
                    }
                    {!progress.allowUpdate && progress.updateData &&
                    <TooltipContent side="bottom" align="start" className="py-3">
                        <div className="space-y-3">
                            <div className="space-y-1">
                            <h2 className="font-semibold">
                                Bản cập nhật mới
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                {progress.updateData.body}
                            </p>
                            </div>
                            <div className="text-muted-foreground flex items-center gap-2 text-xs">
                            <span>1 phút đọc</span>
                            <span>·</span>
                            <span>
                                Đã cập nhật:
                                {progress.updateData.date}
                            </span>
                            </div>
                        </div>
                    </TooltipContent>
                    }
            </Tooltip>
        </>
    )
}

function SettingTunnel() {
    const { data: { user_name } } = useSQLiteDiscordInfo()
    const [status, setStatus] = useState<TunnelStatus>('running')

    useEffect(() => {
        const handleStatusChange = (running: TunnelStatus) => {
            setStatus(running)
        }

        CloudflareController.onStatusChange(handleStatusChange)
        return () => {
            CloudflareController.offStatusChange(handleStatusChange)
        }
    }, [])

    const toogleTunnelFn = async () => {
        if (status === 'running') {
            await CloudflareController.stop()
            toast.success('Tunnel đã Tắt!')
        } else {
            await CloudflareController.start(user_name)
            toast.success('Tunnel đã Bật!')
        }
    }

    return (
        <>
            <li>Trạng thái: {" "}
                {
                    status === 'running' ? 'Đang chạy' :
                    status === 'starting' ? 'Đang khởi động' :
                    'Đã tắt'
                }
            </li>
            <div className="w-40 gap-2 mt-10 flex flex-row justify-between">
                <Button
                    type="button"
                    className="flex-1 overflow-clip relative"
                    disabled={status === 'starting'}
                    onClick={toogleTunnelFn}
                >
                    {status === 'running' ? 'Tắt' : 'Bật'}
                </Button>
            </div>
        </>
    )
}