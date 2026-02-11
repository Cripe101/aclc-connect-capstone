import React, { useRef, useState } from 'react'
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu'

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview, onError }) => {
    const inputRef = useRef(null)
    const [previewUrl, setPreviewUrl] = useState(null)

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validate file type
            if (!allowedTypes.includes(file.type)) {
                if (onError) onError('Only allowed image formats: JPG, PNG, JPEG')
                return
            }

            // Clear any previous error
            if (onError) onError('')

            // Upload the image state
            setImage(file)

            // Generate preview
            const preview = URL.createObjectURL(file)
            if (setPreview) {
                setPreview(preview)
            }
            setPreviewUrl(preview)
        }
    }

    const handleRemoveImage = () => {
        setImage(null)
        setPreviewUrl(null)

        if (setPreview) {
            setPreview(null)
        }
    }

    const onChooseFile = () => {
        inputRef.current.click()
    }

    return (
        <div className='flex justify-center mb-6'>
            <input
                type="file"
                accept='.jpg,.jpeg,.png'
                ref={inputRef}
                onChange={handleImageChange}
                className='hidden'
            />

            {!image ? (
                <div className='w-20 h-20 flex items-center justify-center bg-sky-50 rounded-full relative'>
                    <LuUser className='text-4xl text-sky-500' />
                    <button
                        type='button'
                        className='w-8 h-8 flex items-center justify-center bg-linear-to-r from-sky-500 to-cyan-400 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer'
                        onClick={onChooseFile}
                    >
                        <LuUpload />
                    </button>
                </div>
            ) : (
                <div className='relative'>
                    <img
                        src={preview || previewUrl}
                        alt=""
                        className='w-20 h-20 rounded-full object-cover'
                    />
                    <button
                        type='button'
                        className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer'
                        onClick={handleRemoveImage}
                    >
                        <LuTrash />
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProfilePhotoSelector