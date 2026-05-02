import React, { useEffect } from 'react'
import { dummyRecentMessagesData } from '../assets/assets'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { api, ensureDemoSession, normalizeMessage, normalizeUser } from '../services/api'

const RecentMassges = () => {
    const [massages, setMassages] = React.useState([])
    const [currentUserId, setCurrentUserId] = React.useState('')
    const navigate = useNavigate()
    const fetchRecentMassages = async () => {
        try {
            await ensureDemoSession()
            const me = normalizeUser(await api.users.me())
            setCurrentUserId(me._id)
            const data = await api.messages.recent()
            setMassages(data.map(normalizeMessage))
        } catch {
            setMassages(dummyRecentMessagesData)
        }
    }
    useEffect(() => {
        fetchRecentMassages()
    }, [])

  return (
    <div className='bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs
    test-slate-800'>
        <h3 className='font-semibold text-slate-8 nb-4'>Recent Messages</h3>
        <div className='flex flex-col max-h-56 overflow-y-scroll no-scrollbar'>
            {
                massages.map((massage) => {
                    const normalizedMessage = normalizeMessage(massage)
                    const sender = normalizedMessage.sender || {}
                    const receiver = normalizedMessage.receiver || {}
                    const contact = normalizedMessage.from_user_id === currentUserId ? receiver : sender
                    const displayUser = normalizeUser(contact)
                    return (
                    <div key={massage._id} className='flex items-start gap-2 py-2
                    hover:bg-slate-100 cursor-pointer' onClick={() => navigate(`/messages/${displayUser._id}`)}>
                        <img src={displayUser.profile_picture} alt="" className='w-8 h-8 rounded-full object-cover shrink-0' />
                        <div className='w-full'>
                            <div className='flex justify-between'>
                            <p className='font-medium'>{displayUser.full_name}</p>
                            <p className='rest-[10px] text-slate-400'>{moment(massage.createdAt).fromNow()}</p>
                        </div>
                        <div className='flex justify-between'>
                            <p className='text-gray-500'>
                                {massage.text || 'Media'}
                            </p>
                            {!massage.seen && <span className='bg-indigo-500
                            text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px]'>1</span>}
                        </div>
                        </div>
                        
                    </div>
                )})
            }
        </div>
    </div>
  )
}

export default RecentMassges
