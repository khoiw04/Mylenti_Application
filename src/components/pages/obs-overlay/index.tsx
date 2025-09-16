import ContextMenuContentMain from "./ContextMenu";
import Overlay from "./Overlay";
import Preset from "./Preset";
import { BentoGrid, BentoItem } from "@/components/ui/bento";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export default function Main() {
    return (
      <BentoGrid cols={4} className='py-10 w-full flex justify-center'>
        <ContextMenu>
          <ContextMenuTrigger className="mx-auto w-3/4 h-[calc(100dvh-65px-40px-40px)] md:h-[calc(100dvh-130px-40px-40px)] flex justify-center items-center">
            <BentoItem colSpan={4} className='relative size-full flex justify-center items-center md:px-40'>
              <Overlay />
              <footer className="absolute bottom-5">
                <Preset />
              </footer>
            </BentoItem>
          </ContextMenuTrigger>
          <ContextMenuContentMain />
        </ContextMenu>
      </BentoGrid>
    )
}