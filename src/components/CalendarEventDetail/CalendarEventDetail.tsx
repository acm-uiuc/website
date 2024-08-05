import { FaLocationArrow, FaRegCalendarAlt, FaUserAlt } from 'react-icons/fa';
import { getOrganizationImage, Organization } from '@/components/LazyImage';
import { getOrganizationInfo, IOrgData } from '@/sections/home/SigData';
import Moment from 'moment';


export interface CalendarEventDetailProps {
    title?: string;
    location?: string;
    start?: Date;
    end?: Date;
    host?: Organization;
    description: string;
}
function CalendarEventDetail({
    title,
    location,
    description,
    host,
    start,
    end
}: CalendarEventDetailProps) {
    let info : IOrgData | undefined;
    if (host) {
        console.log({ start, end })
        info = getOrganizationInfo(host);
    }
    if (title === undefined) {
        return (
                <text className='text-center mt-2'>Click on an event to see more details!</text>
        )
    } else {
        return (
                <div className='bg-surface-000 break-words border-2 border-acmdark border-opacity-10 mt-2 border-t-transparent border rounded-2xl'>
                    <div className='text-xl w-full text-surface-000 text-center bg-acmdark rounded-t-2xl pb-2 pt-2 font-semibold'>Event Information</div>
                    <div className='p-5'>
                        <h4 className='flex justify-between'>{title} {host && getOrganizationImage(host, 'w-auto h-8')} </h4>
                        <div className='flex flex-row items-center gap-2 mt-2'>
                            <FaLocationArrow className="shrink-0"/> 
                            <span>{location || "TBD"}</span>
                        </div> 
                        <div className='flex flex-row items-center gap-2'>
                            {start && end && <FaRegCalendarAlt className="shrink-0"/>} {start && end && `${Moment(start).format('h:mm A')} - ${Moment(end).format('h:mm A')}`}
                            {start && !end && <FaRegCalendarAlt className="shrink-0"/>} {start && !end && `${Moment(start).format('h:mm A')}`}
                        </div>
                        <div className='flex flex-row justify-between'>
                        {host && (
                            <div className='flex flex-row items-center gap-2 mb-2'>
                                <FaUserAlt className="shrink-0" /> {host}
                            </div>
                        )}
                        <div className='flex flex-row'>

                        {info && info.link1 && info.linktext1  && (
                            <a
                            className="font-medium p-1 rounded-md text-primary hover:bg-surface-100 transition-all"
                            href={info.link1}
                            target="_blank"
                            rel="noopener noreferrer">
                            {info.linktext1}
                        </a>)
                        }
                        {info && info.link2 && info.linktext2  && (
                            <a
                            className="font-medium p-1 rounded-md text-primary hover:bg-surface-100 transition-all"
                            href={info.link2}
                            target="_blank"
                            rel="noopener noreferrer">
                            {info.linktext2}
                        </a>)
                        }
                        {info && info.link3 && info.linktext3  && (
                            <a
                            className="font-medium p-1 rounded-md text-primary hover:bg-surface-100 transition-all"
                            href={info.link3}
                            target="_blank"
                            rel="noopener noreferrer">
                            {info.linktext3}
                        </a>)
                        }
                        </div>
                        </div>
                        <text>{description}</text>
                    </div>      
                </div>
        )
    }
}
export default CalendarEventDetail