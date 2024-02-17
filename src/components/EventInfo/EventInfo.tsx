import { FaLocationArrow, FaUser, FaRegCalendarAlt } from 'react-icons/fa';
import { EventIntroProps } from '../../app/(main)/calendar/page';
/*
const EventContainer = styled.div`
    width: 27%;
    background-color: #fafafa;
    border: 2px solid rgba(62, 72, 111, 0.1);
    border-top: 2rem solid ${(props) => props.theme.colors.acmDark};
    border-radius: 18px;
    border-top: 0px;
    
    overflow-wrap: break-word;
    filter: grayscale(35%);
    background-color: ${(props) => props.theme.colors.white};
    @media (max-width: 600px) {
        width: 100%;
        margin-top: 15px;
    }

    
    &:hover {
        filter: grayscale(0%) drop-shadow(0 4px 12px rgb(104 112 118 / 0.08)) drop-shadow(0 20px 8px rgb(104 112 118 / 0.04));
        transform: translateY(-1px);
        background-color: white;
    }
`

const EventTitle = styled(Header)`
    margin-top: 10px;
    margin-bottom: 10px;
    color: ${(props) => props.theme.fontColors.default};
    
`;

const EventInfoPlusIcon = styled.div`
    margin-bottom: 0px;
    margin-top: 0px;
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.fontColors.default};
    font-family: ${(props) => props.theme.fonts.body};
    font-size: ${(props) => props.theme.fontSizes.body * 0.9}px;
`

const EventDescription = styled(Text)`
    margin-bottom: 25px;
    margin-top: 10px;
    @media (max-width: 600px) {
        width: 100%;
        margin-top: 15px;
    }
`

const EventDescriptionEmpty = styled(EventDescription)`
    width: 22%;
    text-align: center;
    @media (max-width: 600px) {
        margin-top: 10%;
        width: 100%;
        
    }
`
const EventInfoHeader = styled.div`
    background-color: ${(props) => props.theme.colors.acmDark};
    border-radius: 18px 18px 0px 0px;
    text-align: center;
    padding: 5% 0%;
    color: ${(props) => props.theme.fontColors.bodyLight};
    font-family: ${(props) => props.theme.fonts.body};
    font-size: ${(props) => props.theme.fontSizes.h4}px;
    font-weight: bold;

`

const PaddingWrapper = styled.div`
    padding: 5%;
    padding-top: 0.5%;
`

const IconImage = css`
  width: 15px;
  height: 15px;
  padding-right: 10px;
`;

const IconLocation = styled(FaLocationArrow)`
    ${IconImage}
`;

const IconCalendar = styled(FaRegCalendarAlt)`
    ${IconImage}
`;

const IconUser = styled(FaUser)`
    ${IconImage}
`;
*/


function EventInfo({
    title,
    location,
    date,
    description,
    host,}: EventIntroProps) {
    if (title === undefined) {
        return (
                <text className='text-center'>Click on an event to see more details!</text>
        )
    } else {
        return (
                <div className='bg-gray-100 break-words'>
                    <text className='w-4 text-center'>Event Information</text>
                        <h4 className='mt-2; mb-2;'>{title}</h4>
                        <div className='mb-0 mt-0 flex items-center'>
                            <FaLocationArrow classname="w-4 h-4 pr-2"/> {location || "TBD"}
                        </div> 
                        <div className='mb-0 mt-0 flex items-center'>
                            <FaRegCalendarAlt classname="w-4 h-4 pr-2"/> {date || "TBD"}
                        </div>
                        <div className='mb-0 mt-0 flex items-center'>
                            <FaUser classname="w-4 h-4 pr-2"/> {host}
                        </div> 
                        <text className='mb-6 mt-2'>{description}</text> 
                </div>
        )
    }
}
export default EventInfo