import { FaLocationArrow, FaRegCalendarAlt, FaSignInAlt, FaUserAlt } from 'react-icons/fa';
import { getOrganizationImage, Organization } from '@/components/LazyImage';
import { getOrganizationInfo, IOrgData } from '@/sections/home/SigData';
import moment from 'moment-timezone';
import { EventDetail } from '../Card/EventCard';

function formatDateAsISOString(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  
export interface CalendarEventDetailProps {
    title?: string;
    location?: string;
    locationLink?: string;
    paidEventId?: string;
    start?: Date;
    end?: Date;
    host?: Organization;
    description: string;
}
function CalendarEventDetail({
    title,
    location,
    locationLink,
    paidEventId,
    description,
    host,
    start,
    end
}: CalendarEventDetailProps) {
    let info : IOrgData | undefined;
    if (host) {
        info = getOrganizationInfo(host);
    }
    if (title === undefined) {
        return (
            <p className='text-center mt-2'>Click on an event to see more details!</p>
        )
    } else {
        moment.tz.guess()
        const paidEventHref = paidEventId ? (paidEventId.startsWith("merch:") ? "/merch?id=" + paidEventId.slice(6) :"/event?id=" + paidEventId) : undefined;
        const startObject = start ? moment(moment.tz(formatDateAsISOString(start), "America/Chicago").format()) : undefined;
        const endObject = end ? moment(moment.tz(formatDateAsISOString(end), "America/Chicago").format()) : undefined;
        const timezoneAbbr = moment().tz(moment.tz.guess()).format('z');

        const calendar = (startObject && endObject && start !== end) 
            ? `${startObject.format('h:mm A')} - ${endObject.format('h:mm A z')} ${timezoneAbbr}` 
            : startObject && `${startObject.format('h:mm A z')} ${timezoneAbbr}`;
        return (
                <div className='bg-surface-000 break-words border-2 border-acmdark border-opacity-10 mt-2 border-t-transparent border rounded-2xl'>
                    <div className='text-xl w-full text-surface-000 text-center bg-acmdark rounded-t-2xl pb-2 pt-2 font-semibold'>Event Information</div>
                    <div className='p-5'>
                        <h4 className='flex justify-between'>{title} {host && getOrganizationImage(host, 'w-auto h-8')} </h4>
                        <div className='flex flex-row items-center gap-2 mt-2'>
                            <FaLocationArrow className="shrink-0"/> 
                            <EventDetail href={locationLink}>{location}</EventDetail>
                        </div> 
                        <div className='flex flex-row items-center gap-2'>
                            <FaRegCalendarAlt className="shrink-0"/> {calendar}
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
                        <p>{description}</p>
                        {paidEventId && (
                            <a
                            className="inline-flex flex-row grow-0 items-center gap-2 px-4 py-2 text-white rounded-md bg-primary hover:bg-secondary transition-all"
                            href={paidEventHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            >
                            <FaSignInAlt className="shrink-0" />
                            <span>Register</span>
                            </a>
                        )}
                    </div>      
                </div>
        )
    }
}
export default CalendarEventDetail