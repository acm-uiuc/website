import { IEvent } from "@/components/Events/events";
import moment from "moment-timezone";

export const transformApiDates = (events: IEvent[]): IEvent[] => {
    return events.map((event: IEvent) => {
      return {
        ...event,
        start: moment.tz(event.start, "America/Chicago").tz(moment.tz.guess()).format("YYYY-MM-DDTHH:mm:ss"),
        end: event.end ? moment.tz(event.end, "America/Chicago").tz(moment.tz.guess()).format("YYYY-MM-DDTHH:mm:ss") : moment.tz(event.start, "America/Chicago").tz(moment.tz.guess()).format("YYYY-MM-DDTHH:mm:ss")
        }
      });
  }