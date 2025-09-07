import Comment from './comment'
import Rank from './rank'
import { BentoGrid, BentoItem } from '@/components/ui/bento'
import { TurnoverContent, TurnoverHeader } from '@/components/pages/ke-toan/turnover'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Main() {
    return (
      <div className='max-w-[1580px] px-4 sm:px-10 mx-auto'>
        <BentoGrid rows={1} cols={3} className='py-10'>
          <BentoItem colSpan={3}>
            <TurnoverHeader />
            <TurnoverContent />
          </BentoItem>
          <BentoItem colSpan={3} lgColSpan={1} xlColSpan={1} className='!py-0 relative'>
            <Tabs defaultValue="Bình luận">
              <TabsList className='absolute top-6 z-50 left-1/2 -translate-x-1/2'>
                <TabsTrigger value="Bình luận">Bình luận</TabsTrigger>
                <TabsTrigger value="Xếp hạng">Xếp hạng</TabsTrigger>
              </TabsList>
              <Comment />
              <Rank />
            </Tabs>
          </BentoItem>
        </BentoGrid>
      </div>
    )
}