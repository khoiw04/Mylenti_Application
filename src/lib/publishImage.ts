import { toast } from "sonner";
import { LinksToFiles } from "./convertLinksToFiles";
import type { MainBlobs } from "./convertLinksToFiles";
import type { publishImageProps } from "@/types";
import { UploadStrategy } from "@/func/fn.stragery";

export const publish = async (props: Omit<publishImageProps, 'onSuccess'>) => {
  const { files, from } = props
  const { get, send, validate, check } = UploadStrategy

  const formData = get(from, files)
  const response = await send(formData)
  const result = await validate(response)
  check(response, result)

  return result.fullPaths as Array<string>;
}
type hdUploadImageProps = {
    images: MainBlobs['images']
    config: Omit<MainBlobs, 'images'>
} & Omit<publishImageProps, 'files'>

export const publishImage = async (props : hdUploadImageProps) => {
  const { from, images, config, onSuccess } = props
  const { message, files } = await LinksToFiles({
      images: images,
      ...config,
  })
  if (message) return toast.error(`Lỗi Server: ${message}`);
  toast.promise(publish({ files, from }), {
    loading: 'Đang đăng ảnh...',
    success: (imageUrls) => {
      onSuccess(imageUrls);
      return 'Đã đăng ảnh..., còn dữ liệu';
    },
    error: (errorUrls) => `Lỗi Server: ${errorUrls}`
  })
}