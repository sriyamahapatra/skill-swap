import { React, useEffect, useState } from 'react'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import DataRow from './DataRow'
import { useUser } from '../../utils/UserProvider'
import { defaultUser } from '../../utils/defaultUser'
import { useAlert } from '../../utils/AlertProvider'
import SkillRow from './SkillRow'
import PageHeading from '../../utils/PageHeading'
import { useLoading } from '../../utils/LoadingProvider'

Axios.defaults.withCredentials = true

export default function Profile() {
    const { userData, setUserData } = useUser()
    const navigate = useNavigate()
    const fieldsNotToDisplay = ['notifications', 'matches']
    const { alert, setAlert } = useAlert()
    const { isLoading, setIsLoading} = useLoading()
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        const handleFetch = async () => {
            setIsLoading(true)
            try {
                const response = await Axios.get(`${import.meta.env.VITE_BACKEND_URL}user/profile`)
                if (response.status === 200) {
                    setUserData({
                        ...userData,
                        ...response.data
                    })
                } else if (response.status === 300) {
                    setAlert({ message: "Invalid token." })
                } else {
                    setAlert({ message: "Couldn't fetch profile." })
                }
            } catch (error) {
                setAlert({
                    message: "Fetching profile failed",
                    type: "warning"
                })
                setUserData({ ...defaultUser })
                navigate('/user/login')
            } finally {
                setIsLoading(false)
            }
        }
        handleFetch()
    }, [])

    function handleClick() {
        navigate('/user/profile-update')
    }

    return (
        <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 dark:from-gray-800 dark:to-gray-900 p-4 transition-colors duration-300">
            <div className="flex flex-col w-full max-w-2xl">
                <PageHeading>
                    <span className="bg-gradient-to-r from-purple-600 to-violet-500 bg-clip-text text-transparent">
                        Profile
                    </span>
                </PageHeading>

                <div className="w-full border border-purple-200 dark:border-violet-900 rounded-xl shadow-lg bg-white dark:bg-gray-800 overflow-hidden transition-all duration-300 hover:shadow-xl">
                    {/* Profile header with gradient */}
                    <div className="bg-gradient-to-r from-purple-600 to-violet-500 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold">
                                @{userData.username.toLowerCase()}
                            </h1>
                            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                                <span className="text-2xl">
                                    {userData.username.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Profile content */}
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            {Object.keys(userData).map((myKey, itr) => {
                                if (!fieldsNotToDisplay.includes(myKey)) {
                                    if (myKey === 'skills' || myKey === 'interests') {
                                        return <SkillRow key={itr} dataType={myKey} dataVal={userData[myKey]} />
                                    } else {
                                        return <DataRow key={itr} dataType={myKey} dataVal={userData[myKey]} />
                                    }
                                }
                            })}
                        </div>

                        <button
                            onClick={handleClick}
                            className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-300
                                ${isHovered ? 
                                    'bg-gradient-to-r from-violet-600 to-purple-700 shadow-lg transform scale-[1.02]' : 
                                    'bg-gradient-to-r from-purple-600 to-violet-500 shadow-md'
                                }`}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                Edit Profile
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}