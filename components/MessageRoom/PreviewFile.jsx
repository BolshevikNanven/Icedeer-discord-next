"use client"

import { X, File, FileVolume, FileVideo, FileType } from 'lucide-react'
import { useEffect } from 'react'

export default function PreviewFile({ handleDelete, file }) {
    const fileType = file.type.substring(0, file.type.indexOf('/'))
    const url = fileType === 'image' ? URL.createObjectURL(file) : null

    const getFileIcon = () => {
        if (fileType === 'image') {
            return <img className="max-w-[108px]" src={url} alt={file.name} />
        }
        if (fileType === 'audio') {
            return <FileVolume className='w-6 h-6' />
        }
        if (fileType === 'video') {
            return <FileVideo className='w-6 h-6' />
        }
        if (fileType === 'text' || fileType === 'font') {
            return <FileType className='w-6 h-6' />
        }

        return <File className='w-6 h-6' />
    }

    useEffect(() => {
        return () => URL.revokeObjectURL(url)
    }, [])

    return (
        <div className="relative select-none group">
            <span onClick={handleDelete} className='absolute top-0 right-0 hidden group-hover:block rounded-full bg-red-500 text-white m-1'>
                <X className='w-4 h-4' />
            </span>
            {fileType === 'image' ? getFileIcon()
                :
                <div className='min-w-16 h-16 bg-white rounded-lg border flex flex-col justify-center items-center'>
                    {getFileIcon()}
                    <p className='text-xs px-2'>{file.name}</p>
                </div>
            }
        </div>
    )
}