import Overlay from "./Overlay";
import ContextMenuContentMain from "./ContextMenu";
import Footer from "./Footer";
import { BentoGrid, BentoItem } from "@/components/ui/bento";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";

export default function Index() {
    return (
      <BentoGrid cols={4} className='py-10 w-full flex justify-center'>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <BentoItem colSpan={4} className='relative mx-auto w-3/4 h-[calc(100dvh-65px-40px-40px)] md:h-[calc(100dvh-130px-40px-40px)] flex justify-center items-center md:px-40 overflow-clip'>
              <Overlay />
              <Footer />
            </BentoItem>
          </ContextMenuTrigger>
          <ContextMenuContentMain />
        </ContextMenu>
      </BentoGrid>
    )
}