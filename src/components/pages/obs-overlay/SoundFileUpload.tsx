import {
  AlertCircleIcon,
  LucideAudioWaveform,
  Trash2Icon,
  XIcon,
} from "lucide-react"
import { useFileUpload } from "@/hooks/use-link-direct-upload"

import { Button } from "@/components/ui/button"
import { formatBytes } from "@/lib/utils";
import { OBSOverlayTauriSettingsProps, loadSounds, saveSounds } from "@/store";
import { fallbackSound } from "@/data/fallback";
import { Input } from "@/components/ui/input";

export default function SoundFileUpload() {
  const maxFiles = 4

  const [
    { files, errors },
    {
      getInputProps,
      handleDelete,
      clearFiles,
      addFromUrl
    },
  ] = useFileUpload({
    maxFiles,
    accept: 'audio/*',
    onFilesLoad: loadSounds,
    onFilesChange: async (filesChange) => {
      const soundData = filesChange.length > 0 ? filesChange : fallbackSound
      OBSOverlayTauriSettingsProps.setState((prev) => ({
        ...prev,
        DonateProps: {
          ...prev.DonateProps,
          soundURL: soundData
        },
      }))
      await saveSounds(filesChange)
    },
  })

  return (
    <div className="flex flex-col gap-2">
      <div
        data-files={files.length > 0 || undefined}
        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Chỉ cho phép đăng âm thanh"
        />
        {files.length > 0 ? (
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-medium">
                Âm thanh ({files.length})
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearFiles}>
                  <Trash2Icon
                    className="-ms-0.5 size-3.5 opacity-60"
                    aria-hidden="true"
                  />
                  Xóa âm thanh
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {files.map(file => (
                <div
                  key={file.path}
                  className="bg-background relative flex flex-col rounded-md border"
                >
                  <div className="bg-accent flex aspect-square items-center relative justify-center overflow-hidden rounded-t-[inherit]">
                      <LucideAudioWaveform />
                  </div>
                  <Button
                    onClick={() => handleDelete(file.path)}
                    size="icon"
                    className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                    aria-label="Remove sound"
                  >
                    <XIcon className="size-3.5" />
                  </Button>
                  <div className="flex min-w-0 flex-col gap-0.5 border-t p-3">
                    <p className="truncate text-[13px] font-medium">
                      {file.name}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div
              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <LucideAudioWaveform className="size-4 opacity-60" />
            </div>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      <div className="space-y-2">
        <div className="bg-background gap-2 rounded-lg border p-2 pe-3">
          <Input
            className="truncate text-[13px] font-medium w-full text-center"
            placeholder="Dán link Âm thanh và nhấn Enter"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const url = (e.target as HTMLInputElement).value.trim();
                if (url) {
                  e.preventDefault();
                  addFromUrl(url);
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
          />
        </div>
      </div>

    </div>
  )
}
