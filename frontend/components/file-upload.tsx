"use client"

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button"
import { Upload, Music, X, FileAudio } from "lucide-react"

interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  error?: string
}

export function FileUpload({ onFileSelect, error }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        setSelectedFile(file)
        onFileSelect(file)
      }
    },
    [onFileSelect],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".flac", ".aac", ".ogg", ".m4a"],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  const removeFile = () => {
    setSelectedFile(null)
    onFileSelect(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (selectedFile) {
    return (
      <div className="border-2 border-gray-600 border-dashed rounded-lg p-6 bg-[#2a2a2a]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#1DB954]/20 rounded-lg flex items-center justify-center">
              <FileAudio className="w-6 h-6 text-[#1DB954]" />
            </div>
            <div>
              <p className="font-medium text-white truncate max-w-xs">{selectedFile.name}</p>
              <p className="text-sm text-gray-400">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
          <Button
            type="button"
            onClick={removeFile}
            
            className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
        isDragActive
          ? "border-[#1DB954] bg-[#1DB954]/10"
          : error
            ? "border-red-500 bg-red-500/10"
            : "border-gray-600 bg-[#2a2a2a] hover:border-[#1DB954] hover:bg-[#1DB954]/5"
      }`}
    >
      <input {...getInputProps()} />
      <div className="space-y-4">
        <div className="w-16 h-16 bg-[#1DB954]/20 rounded-full flex items-center justify-center mx-auto">
          {isDragActive ? <Upload className="w-8 h-8 text-[#1DB954]" /> : <Music className="w-8 h-8 text-[#1DB954]" />}
        </div>
        <div>
          <p className="text-lg font-medium text-white mb-2">
            {isDragActive ? "Drop your audio file here" : "Upload your track"}
          </p>
          <p className="text-gray-400 text-sm mb-4">
            Drag and drop your audio file, or <span className="text-[#1DB954] font-medium">browse files</span>
          </p>
          <p className="text-xs text-gray-500">Supported formats: MP3, WAV, FLAC, AAC, OGG, M4A (Max 50MB)</p>
        </div>
      </div>
    </div>
  )
}
