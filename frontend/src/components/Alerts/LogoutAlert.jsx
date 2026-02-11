import { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import { useNavigate } from 'react-router-dom'
import { LuLogOut, LuX } from 'react-icons/lu'
import Modal from '../Modal'
import toast from 'react-hot-toast'

const LogoutAlert = ({ isOpen, setIsOpen }) => {
    const { clearUser } = useContext(UserContext)
    const navigate = useNavigate()

    const handleConfirmLogout = () => {
        localStorage.clear()
        clearUser()
        toast.success('Logged out successfully')
        setIsOpen(false)
        navigate('/')
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            hideHeader
        >
            <div className='w-full max-w-sm mx-auto py-8 px-6 text-center'>
                {/* Icon */}
                <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                    <LuLogOut className='text-3xl text-red-600' />
                </div>

                {/* Title */}
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                    Sign Out?
                </h2>

                {/* Description */}
                <p className='text-gray-600 text-sm mb-8'>
                    Are you sure you want to sign out? You'll need to log in again to access your account.
                </p>

                {/* Buttons */}
                <div className='flex gap-3 sm:gap-4'>
                    <button
                        onClick={() => setIsOpen(false)}
                        className='flex-1 px-4 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmLogout}
                        className='flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-200 hover:shadow-red-300'
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default LogoutAlert
