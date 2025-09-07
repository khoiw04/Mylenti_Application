import imageCompression from 'browser-image-compression';
import { useMutation } from '@tanstack/react-query';
import Cropper from 'react-easy-crop';
import { useStore } from '@tanstack/react-store';
import type { Area, Point } from 'react-easy-crop';
import getCroppedImg from '@/lib/getCroppedImg';
import { avatarStore, cropStore } from '@/store/avatar-store';
import { postCompression } from '@/data/settings';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AvatarProfile } from '@/components/presenters/user';
import { cropedStrategy } from '@/func/stragery';

export function useCroppedAvatar(
  checkImages = '',
  options = postCompression,
  strategy = cropedStrategy
) {
  const [open, previewImage] = useStore(avatarStore, s => [s.open, s.previewImage]);
  const [zoom, crop, croppedAreaPixels] = useStore(cropStore, s => [s.zoom, s.crop, s.croppedAreaPixels]);

  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    strategy.checkImage(file);
    const compressed = await imageCompression(file, options);
    strategy.updatePreview(URL.createObjectURL(compressed));
  };

  const imageCropped = useMutation({
    mutationFn: async () => {
      const cropped = await getCroppedImg(previewImage, croppedAreaPixels);
      strategy.updateResult(cropped);
    },
  });

  const CropperView = (
    <Cropper
      image={previewImage}
      aspect={1}
      crop={crop}
      zoom={zoom}
      onCropChange={(c: Point) => cropStore.setState(p => ({ ...p, crop: c }))}
      onZoomChange={(z: number) => cropStore.setState(p => ({ ...p, zoom: z }))}
      onCropComplete={(_: Area, area: Area) =>
        cropStore.setState(p => ({ ...p, croppedAreaPixels: area }))
      }
      classes={{ containerClassName: 'rounded shadow' }}
    />
  );

  const DialogCropped = (
    <Dialog open={open} onOpenChange={o => avatarStore.setState(p => ({ ...p, open: o }))}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">Cắt ảnh</DialogTitle>
        <DialogDescription>Hành động này sẽ xác định Nơi mà bạn muốn xem</DialogDescription>
        <div className="relative mx-auto rounded size-60 sm:size-80 lg:size-96 mt-4">
          {CropperView}
        </div>
        <DialogFooter className="mt-4 mx-auto">
          <DialogClose asChild>
            <Button><span>Quay lại</span></Button>
          </DialogClose>
          <DialogClose onClick={() => imageCropped.mutate()} asChild>
            <Button><span>Lưu</span></Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const UICropped = (
    <>
      <AvatarProfile url={checkImages} />
      <input
        type="file"
        className='sr-only'
        accept='image/jpeg,image/png,image/webp'
        id="avatar-upload"
        name='image'
        tabIndex={-1}
        onChange={handleOnChange}
      />
      <button
        type='button'
        className='text-neutral-600/80 cursor-pointer hover:underline'
        onClick={() => document.getElementById('avatar-upload')?.click()}
      >
          Đăng
      </button>

      {DialogCropped}
    </>
  )

  return UICropped
}
