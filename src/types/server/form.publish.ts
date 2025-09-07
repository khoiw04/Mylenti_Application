export type publishImageProps = { 
    from: string, 
    files: Array<File>; 
    onSuccess: (imageUrls: Array<string>) => void 
}

export type uploadFilesToBucketProps = { files: Array<File>; from: string }