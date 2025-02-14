import { FaLocationArrow, FaRegCalendarAlt, FaSignInAlt, FaUserAlt } from 'react-icons/fa';
import { getOrganizationImage } from '@/components/LazyImage';
import { getOrganizationInfo, IOrgData, Organization } from '@/utils/organizations';
import moment from 'moment-timezone';
import { EventDetail } from '../Card/EventCard';

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
            <p className='text-center mt-2 xl:w-full xl:pt-5'>Click on an event to see more details!</p>
        )
    } else {
        moment.tz.guess()
        const paidEventHref = paidEventId ? (paidEventId.startsWith("merch:") ? "/merch?id=" + paidEventId.slice(6) :"/event?id=" + paidEventId) : undefined;
        const timezoneAbbr = moment().tz(moment.tz.guess()).format('z');

        const calendar = (start && end && start !== end) 
            ? `${moment(start).format('h:mm A')} - ${moment(end).format('h:mm A z')} ${timezoneAbbr}` 
            : start && `${moment(start).format('h:mm A z')} ${timezoneAbbr}`;
        return (
                <div className='flex flex-col flex-grow bg-surface-000 break-words border-2 border-acmdark border-opacity-10 mt-2 border-t-transparent border rounded-2xl'>
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
                        <div className='flex flex-col md:flex-row justify-between'>
                        {host && (
                            <div className='flex flex-row items-center gap-2 mb-2'>
                                <FaUserAlt className="shrink-0" /> {host}
                            </div>
                        )}
                            <div className='flex flex-row -ml-1 md:ml-0'>
                            {info?.links.map(({ link, text }) => (
                                <a
                                key={text}
                                className="font-medium px-1 rounded-md text-primary hover:bg-surface-100 transition-all"
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer">
                                {text}
                            </a>)
                            )}
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