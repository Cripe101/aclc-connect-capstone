import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/userContext.jsx'
import Input from '../Inputs/Input.jsx'
import { validateEmail, validatePassword } from '../../utils/helper.js'
import axiosInstance from '../../utils/axiosInstance.js'
import { API_PATHS } from '../../utils/apiPaths.js'
import ProfilePhotoSelector from '../Inputs/ProfilePhotoSelector.jsx'
import uploadImage from '../../utils/uploadImage.js'
import { toast } from 'react-hot-toast'
import { LuUser, LuMail, LuLock, LuArrowRight, LuKey } from 'react-icons/lu'


const SignUp = ({ setCurrentPage, isAdmin = false }) => {
    const [profilePic, setProfilePic] = useState(null)
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [adminAccessToken, setAdminAccessToken] = useState("")

    const [error, setError] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { updateUser, setOpenAuthForm } = useContext(UserContext)
    const navigate = useNavigate()

    // Handle SignUp Submit
    const handleSignUp = async (e) => {
        e.preventDefault()
        if (isSubmitting) return
        setIsSubmitting(true)

        let profileImageUrl = ""

        if (!fullName) {
            setError("Please enter full name.");
            setIsSubmitting(false)
            return
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            setIsSubmitting(false)
            return
        }

        if (!password) {
            setError("Please enter the password.");
            setIsSubmitting(false)
            return
        } else {
            const { valid } = validatePassword(password)
            if (!valid) {
                setError("Please use a strong password!")
                setIsSubmitting(false)
                return
            }
        }

        // Check admin token if signing up as admin
        if (isAdmin && !adminAccessToken) {
            setError("Admin invite token is required.");
            setIsSubmitting(false)
            return
        }

        setError("")

        // SignUp API call
        try {
            // Upload image if present
            if (profilePic) {
                const imgUploadRes = await uploadImage(profilePic)
                profileImageUrl = imgUploadRes.imageUrl || ""
            }

            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
                name: fullName,
                email,
                password,
                profileImageUrl,
                ...(isAdmin && { adminAccessToken }),
            })

            // On successful signup, show success toast and switch to login
            toast.success('Account created successfully. Please log in.')
            if (setCurrentPage) {
                setCurrentPage('login')
            } else {
                navigate('/admin-login')
            }
            setOpenAuthForm(false)
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message)
            } else {
                setError("Something went wrong. Please try again.")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='w-full max-w-7xl mx-auto flex flex-col md:flex-row items-stretch rounded-3xl overflow-hidden bg-white'>
            {/* Left Side - Form */}
            <div className='w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:p-16 max-h-screen md:overflow-y-auto'>
                {/* Header */}
                <div className='mb-10'>
                    <div className='inline-block p-3 bg-linear-to-br from-sky-100 to-cyan-100 rounded-2xl mb-4'>
                        <LuUser className='text-2xl text-sky-600' />
                    </div>
                    <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3'>Create Account</h1>
                    <p className='text-gray-600 text-base md:text-lg'>{isAdmin ? 'Join as an admin' : 'Join our community'} to get started</p>
                </div>

                <form onSubmit={handleSignUp} className='space-y-5'>
                    {/* Profile Photo */}
                    <div className='flex justify-center mb-4'>
                        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} onError={(msg) => setError(msg)} />
                    </div>

                    {/* Full Name */}
                    <div className='relative'>
                        <label className='block text-sm font-semibold text-gray-900 mb-2'>Full Name</label>
                        <div className='relative flex items-center'>
                            <LuUser className='absolute left-3 text-gray-400' />
                            <input
                                value={fullName}
                                onChange={({ target }) => setFullName(target.value)}
                                placeholder="Juan Dela Cruz"
                                type="text"
                                className='w-full pl-10 pr-4 py-3 md:py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-base'
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className='relative'>
                        <label className='block text-sm font-semibold text-gray-900 mb-2'>Email Address</label>
                        <div className='relative flex items-center'>
                            <LuMail className='absolute left-3 text-gray-400' />
                            <input
                                value={email}
                                onChange={({ target }) => setEmail(target.value)}
                                placeholder="you@example.com"
                                type="email"
                                className='w-full pl-10 pr-4 py-3 md:py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-base'
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className='relative'>
                        <label className='block text-sm font-semibold text-gray-900 mb-2'>Password</label>
                        <div className='relative flex items-center'>
                            <LuLock className='absolute left-3 text-gray-400' />
                            <input
                                value={password}
                                onChange={({ target }) => setPassword(target.value)}
                                placeholder="Min 8 characters"
                                type="password"
                                className='w-full pl-10 pr-4 py-3 md:py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-base'
                            />
                        </div>
                    </div>

                    {/* Admin Token - Conditional */}
                    {isAdmin && (
                        <div className='relative'>
                            <label className='block text-sm font-semibold text-gray-900 mb-2'>Admin Invite Token</label>
                            <div className='relative flex items-center'>
                                <LuKey className='absolute left-3 text-gray-400' />
                                <input
                                    value={adminAccessToken}
                                    onChange={({ target }) => setAdminAccessToken(target.value)}
                                    placeholder="Enter invite code"
                                    type="text"
                                    className='w-full pl-10 pr-4 py-3 md:py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-base'
                                />
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className='p-4 bg-red-50 border border-red-200 rounded-lg'>
                            <p className='text-red-700 text-sm font-medium'>{error}</p>
                        </div>
                    )}

                    {/* Sign Up Button */}
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className='w-full py-3 md:py-4 px-4 bg-linear-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 disabled:opacity-70 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-sky-200 hover:shadow-sky-300 mt-2'
                    >
                        {isSubmitting ? (
                            <svg className='w-5 h-5 animate-spin' viewBox='0 0 24 24'>
                                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none'></circle>
                                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'></path>
                            </svg>
                        ) : (
                            <>
                                Create Account
                                <LuArrowRight className='w-4 h-4' />
                            </>
                        )}
                    </button>

                    {/* Login Link */}
                    <p className='text-center text-sm text-gray-600 mt-8'>
                        Already have an account? {" "}
                        <button
                            type='button'
                            onClick={() => setCurrentPage("login")}
                            className='font-semibold text-sky-600 hover:text-sky-700 transition-colors'
                        >
                            Sign in
                        </button>
                    </p>
                </form>

                {/* Footer */}
                <p className='text-xs text-center text-gray-500 mt-12'>
                    {isAdmin ? 'Admin Registration - Secure access only with invite token' : 'By signing up, you agree to our terms and conditions'}
                </p>
            </div>

            {/* Right Side - Gradient Background */}
            <div className='hidden md:flex w-1/2 bg-linear-to-br from-sky-500 to-cyan-600 items-center justify-center relative overflow-hidden p-8'>
                {/* Decorative Elements */}
                <div className='absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48'></div>
                <div className='absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full -ml-40 -mb-40'></div>
                
                {/* Content */}
                <div className='relative z-10 text-white text-center max-w-md'>
                    <div className='mb-8'>
                        <h2 className='text-4xl lg:text-5xl font-bold mb-4'>Join Us Today</h2>
                        <p className='text-lg lg:text-xl text-sky-50 leading-relaxed'>
                            {isAdmin 
                                ? 'Become an admin and help manage our growing community.'
                                : 'Be part of our vibrant community and unlock amazing opportunities.'
                            }
                        </p>
                    </div>
                    
                    <div className='space-y-4 text-sm lg:text-base text-sky-50'>
                        <div className='flex items-center gap-3 justify-center'>
                            <div className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold'>1</div>
                            <span>{isAdmin ? 'Secure admin access' : 'Create your profile'}</span>
                        </div>
                        <div className='flex items-center gap-3 justify-center'>
                            <div className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold'>2</div>
                            <span>{isAdmin ? 'Manage content' : 'Explore blog posts'}</span>
                        </div>
                        <div className='flex items-center gap-3 justify-center'>
                            <div className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold'>3</div>
                            <span>{isAdmin ? 'Moderate community' : 'Connect & engage'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp