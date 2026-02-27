"use client";

import { useEffect, useState, useCallback } from "react";
import {
  formatBytes,
  useFileUpload,
  type FileMetadata,
  type FileWithPreview,
} from "@/hooks/use-file-upload";
import {
  Alert,
  AlertAction,
  AlertTitle,
} from "@/components/reui/alert";
import { Badge } from "@/components/reui/badge";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ImageIcon,
  VideoIcon,
  HeadphonesIcon,
  FileTextIcon,
  FileSpreadsheetIcon,
  FileArchiveIcon,
  UploadIcon,
  XIcon,
  CircleAlertIcon,
  RefreshCwIcon,
} from "lucide-react";

interface FileUploadItem extends FileWithPreview {
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
}

interface ProgressUploadProps {
  className?: string;
  onFilesChange?: (files: FileWithPreview[]) => void;
  simulateUpload?: boolean;
}

export function ComponentCustomFileUpload({
  className,
  onFilesChange,
  simulateUpload = true,
}: ProgressUploadProps) {
  const defaultImages: FileMetadata[] = [
    {
      id: "default-3",
      name: "image-1.png",
      size: 42048,
      type: "image/png",
      url: "https://picsum.photos/1000/800?grayscale&random=10",
    },
    {
      id: "default-4",
      name: "image-2.png",
      size: 62807,
      type: "image/png",
      url: "https://picsum.photos/1000/800?grayscale&random=11",
    },
  ];

  const defaultUploadFiles: FileUploadItem[] = defaultImages.map((image) => ({
    id: image.id,
    file: {
      name: image.name,
      size: image.size,
      type: image.type,
    } as File,
    preview: image.url,
    progress: 100,
    status: "completed" as const,
  }));

  const [uploadFiles, setUploadFiles] =
    useState<FileUploadItem[]>(defaultUploadFiles);

  // ✅ FIX 1: Use useCallback with functional state update
  // This avoids the stale closure problem entirely
  const handleFilesChange = useCallback(
    (newFiles: FileWithPreview[]) => {
      setUploadFiles((prev) => {
        // Build a map of existing files by ID for O(1) lookup
        const existingMap = new Map(prev.map((f) => [f.id, f]));

        const newUploadFiles = newFiles.map((file) => {
          const existingFile = existingMap.get(file.id);

          if (existingFile) {
            // Preserve existing progress and status
            return {
              ...existingFile,
              ...file,
              progress: existingFile.progress,
              status: existingFile.status,
              error: existingFile.error,
            };
          } else {
            // New file — start uploading
            return {
              ...file,
              progress: 0,
              status: "uploading" as const,
            };
          }
        });

        return newUploadFiles;
      });
      onFilesChange?.(newFiles);
    },
    [onFilesChange],
  );

  const [
    { isDragging },
    {
      removeFile,
      clearFiles,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles: Infinity,
    maxSize: Infinity,
    accept: "*",
    multiple: true,
    initialFiles: defaultImages,
    onFilesChange: handleFilesChange, // ✅ FIX 2: Pass stable callback
  });

  // Simulate upload progress
  useEffect(() => {
    if (!simulateUpload) return;

    const interval = setInterval(() => {
      setUploadFiles((prev) => {
        const hasUploading = prev.some((f) => f.status === "uploading");
        if (!hasUploading) return prev; // ✅ FIX 3: No-op if nothing to update

        return prev.map((file) => {
          if (file.status !== "uploading") return file;

          const remaining = 100 - file.progress;
          const increment = remaining * 0.15;
          const minIncrement = 0.5;
          const actualIncrement = Math.max(increment, minIncrement);
          const newProgress = Math.min(file.progress + actualIncrement, 95);

          if (newProgress >= 94) {
            return {
              ...file,
              progress: 100,
              status: "completed" as const,
            };
          }

          return {
            ...file,
            progress: newProgress,
          };
        });
      });
    }, 200);

    return () => clearInterval(interval);
  }, [simulateUpload]);

  // ✅ FIX 4: Wrap clearFiles to also clear uploadFiles state
  const handleClearFiles = useCallback(() => {
    clearFiles();
    setUploadFiles([]);
  }, [clearFiles]);

  const retryUpload = (fileId: string) => {
    setUploadFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
              ...file,
              progress: 0,
              status: "uploading" as const,
              error: undefined,
            }
          : file,
      ),
    );
  };

  const removeUploadFile = (fileId: string) => {
    setUploadFiles((prev) => prev.filter((file) => file.id !== fileId));
    removeFile(fileId);
  };

  const getFileIcon = (file: File | FileMetadata) => {
    const type = file instanceof File ? file.type : file.type;
    if (type.startsWith("image/")) return <ImageIcon className="size-4" />;
    if (type.startsWith("video/")) return <VideoIcon className="size-4" />;
    if (type.startsWith("audio/"))
      return <HeadphonesIcon className="size-4" />;
    if (type.includes("pdf")) return <FileTextIcon className="size-4 text-red-500" />;
    if (type.includes("word") || type.includes("doc"))
      return <FileTextIcon className="size-4 text-blue-500" />;
    if (type.includes("excel") || type.includes("sheet"))
      return <FileSpreadsheetIcon className="size-4 text-emerald-500" />;
    if (type.includes("zip") || type.includes("rar"))
      return <FileArchiveIcon className="size-4" />;
    return <FileTextIcon className="size-4" />;
  };

  const completedCount = uploadFiles.filter(
    (f) => f.status === "completed",
  ).length;
  const errorCount = uploadFiles.filter((f) => f.status === "error").length;
  const uploadingCount = uploadFiles.filter(
    (f) => f.status === "uploading",
  ).length;

  return (
    <div className={cn("w-full", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "rounded-lg relative border border-dashed p-8 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input {...getInputProps()} className="sr-only" />

        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full",
              isDragging ? "bg-primary/10" : "bg-muted",
            )}
          >
            <UploadIcon
              className={cn(
                "h-6",
                isDragging ? "text-primary" : "text-muted-foreground",
              )}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Upload your files</h3>
            <p className="text-muted-foreground text-sm">
              Drag and drop files here or click to browse
            </p>
            <p className="text-muted-foreground text-xs">
              Support for all file types with no size limit
            </p>
          </div>

          <Button onClick={openFileDialog}>
            <UploadIcon className="h-4 w-4" />
            Select files
          </Button>
        </div>
      </div>

      {/* Upload Stats */}
      {uploadFiles.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium">Upload Progress</h4>
            <div className="flex items-center gap-2">
              {completedCount > 0 && (
                <Badge size="sm" variant="success-light">
                  Completed: {completedCount}
                </Badge>
              )}
              {errorCount > 0 && (
                <Badge size="sm" variant="destructive">
                  Failed: {errorCount}
                </Badge>
              )}
              {uploadingCount > 0 && (
                <Badge size="sm" variant="secondary">
                  Uploading: {uploadingCount}
                </Badge>
              )}
            </div>
          </div>

          <Button onClick={handleClearFiles} variant="outline" size="sm">
            Clear all
          </Button>
        </div>
      )}

      {/* File List */}
      {uploadFiles.length > 0 && (
        <div className="mt-4 space-y-3">
          {uploadFiles.map((fileItem: FileUploadItem) => (
            <div
              key={fileItem.id}
              className="border-border bg-card rounded-lg border p-2.5"
            >
              <div className="flex items-start gap-2.5">
                <div className="shrink-0">
                  {fileItem.preview &&
                  fileItem.file.type.startsWith("image/") ? (
                    <img
                      src={fileItem.preview}
                      alt={fileItem.file.name}
                      className="rounded-lg h-12 w-12 border object-cover"
                    />
                  ) : (
                    <div className="border-border text-muted-foreground rounded-lg flex h-12 w-12 items-center justify-center border">
                      {getFileIcon(fileItem.file)}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mt-0.75 flex items-center justify-between">
                    <p className="inline-flex flex-col justify-center gap-1 truncate font-medium">
                      <span className="text-sm">{fileItem.file.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {formatBytes(fileItem.file.size)}
                      </span>
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => removeUploadFile(fileItem.id)}
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground size-6 hover:bg-transparent hover:opacity-100"
                      >
                        <XIcon className="size-4" />
                      </Button>
                    </div>
                  </div>

                  {fileItem.status === "uploading" && (
                    <div className="mt-2">
                      <Progress value={fileItem.progress} className="h-1" />
                    </div>
                  )}

                  {fileItem.status === "error" && fileItem.error && (
                    <Alert variant="destructive" className="mt-2 px-2 py-1">
                      <CircleAlertIcon className="size-4" />
                      <AlertTitle className="text-xs">
                        {fileItem.error}
                      </AlertTitle>
                      <AlertAction>
                        <Button
                          onClick={() => retryUpload(fileItem.id)}
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground size-6 hover:bg-transparent hover:opacity-100"
                        >
                          <RefreshCwIcon className="size-3.5" />
                        </Button>
                      </AlertAction>
                    </Alert>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}