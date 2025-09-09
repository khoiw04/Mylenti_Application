import SearchCMDK from "@/components/ui/search"
import { searchGroups } from "@/data/header";

export default function Component() {
  return (
    <SearchCMDK
      commandProps={{
        label: "Tìm kiếm...",
      }}
      defaultOptions={[...searchGroups]}
      placeholder="Tìm kiếm..."
      hideClearAllButton
      hidePlaceholderWhenSelected
      emptyIndicator={<p className="text-center text-sm">Không có thông tin</p>}
    />
  )
}