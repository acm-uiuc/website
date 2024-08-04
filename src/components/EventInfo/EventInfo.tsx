import { FaLocationArrow, FaUser, FaRegCalendarAlt } from 'react-icons/fa';
import { EventIntroProps } from '../../app/(main)/calendar/page';

function EventInfo({
    title,
    location,
    start,
    description,
    host
}: EventIntroProps) {
    if (title === undefined) {
        return (
                <text className='text-center'>Click on an event to see more details!</text>
        )
    } else {
        return (
                <div className='w-1/4 bg-surface-000 break-words border-2 border-acmdark border-opacity-10 border-t-transparent border rounded-2xl'>
                    <div className='text-xl w-full text-surface-000 text-center bg-acmdark rounded-t-2xl py-2 font-semibold	pt-3 pb-3'>Event Information</div>
                    <div className='p-5'>
                        <h4>{title}</h4>
                        <div className='flex flex-row items-center gap-2 mt-2'>
                            <FaLocationArrow className="shrink-0"/> 
                            <span>{location || "TBD"}</span>
                        </div> 
                        <div className='flex flex-row items-center gap-2'>
                            <FaRegCalendarAlt className="shrink-0"/> {start || "TBD"}
                        </div>
                        <div className='flex flex-row items-center gap-2 mb-2'>
                            <FaUser className="shrink-0"/> {host}
                        </div> 
                        <text>{description}</text>
                    </div>      
                </div>
        )
    }
}
export default EventInfo