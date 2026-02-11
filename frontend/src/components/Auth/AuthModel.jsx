import { useContext, useState } from "react"
import Login from "./Login"
import MemberSignup from "./MemberSignup"
import { UserContext } from "../../context/userContext"
import Modal from "../Modal"

const AuthModel = () => {
    const { openAuthForm, setOpenAuthForm } = useContext(UserContext)
    const [currentPage, setCurrentPage] = useState("login")

    return (
        <>
            <Modal
                isOpen={openAuthForm}
                onClose={() => {
                    setOpenAuthForm(false)
                    setCurrentPage("login")
                }}
                hideHeader
            >
                <div className=''>
                    {currentPage === "login" && (
                        <Login setCurrentPage={setCurrentPage} />
                    )}
                    {currentPage === "signup" && (
                        <MemberSignup setCurrentPage={setCurrentPage} />
                    )}
                </div>
            </Modal>
        </>
    )
}

export default AuthModel