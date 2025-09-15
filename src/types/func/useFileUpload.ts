export interface FileWithPreview {
  name: string;
  path: string;
  preview: string;
  size: number;
  type: string;
  binary: Uint8Array<ArrayBuffer>
}

export interface FileUploadState {
  files: Array<FileWithPreview>;
  errors: Array<string>;
}

export interface FileUploadOptions {
  maxFiles?: number;
  accept?: 'audio/*' | 'image/*';
  onFilesChange?: (files: Array<FileWithPreview>) => void;
  onFilesLoad: () => Promise<Array<FileWithPreview>>
}

export interface FileUploadActions {
  handleUpload: () => void;
  handleDrop: (e: React.DragEvent<HTMLElement>) => void;
  clearFiles: () => void;
  openFileDialog: () => void;
  getInputProps: () => React.InputHTMLAttributes<HTMLInputElement>;
  handleDelete: (id: string) => void;
}