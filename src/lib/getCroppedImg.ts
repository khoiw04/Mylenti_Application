import type { Area } from "react-easy-crop"

export const createImage = (url: string): Promise<HTMLImageElement> => 
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })
/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function getSize(width: number, height: number) {
  const boundingBox = width + height
  return { width: boundingBox, height: boundingBox }
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area | null
): Promise<string | undefined | null> {
  if (!pixelCrop) return
  const image = await createImage(imageSrc)
  const croppedCanvas = document.createElement('canvas')
  const croppedCtx = croppedCanvas.getContext('2d')

  if (!croppedCtx) {
    return null
  }

  // Set the size of the cropped canvas
  croppedCanvas.width = pixelCrop.width
  croppedCanvas.height = pixelCrop.height

  croppedCtx.fillStyle = '#f5f5f5' // Tailwind's neutral-200 or a gray color
  croppedCtx.fillRect(0, 0, croppedCanvas.width, croppedCanvas.height)

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  // As Base64 string
  // return croppedCanvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve) => {
    croppedCanvas.toBlob((file) => {
      resolve(URL.createObjectURL(file!))
    }, 'image/jpeg')
  })
}
