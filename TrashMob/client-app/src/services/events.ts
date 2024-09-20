// eventtypes
// Events
// events
// eventsummaries
// EventAttendees

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import dayjs from 'dayjs';
import isBetween from "dayjs/plugin/isBetween"

import { ApiService } from ".";
import { Services } from '../config/services.config';
import { EventTimeFrame, EventTimeLine } from '../enums';

import DisplayEventSummary from "../components/Models/DisplayEventSummary";
import EventAttendeeData from "../components/Models/EventAttendeeData";
import EventData from "../components/Models/EventData";
import EventSummaryData from "../components/Models/EventSummaryData";
import EventTypeData from "../components/Models/EventTypeData";
import UserData from "../components/Models/UserData";

dayjs.extend(isBetween)

const isInTimeFrame = (event: EventData, timeFrame: EventTimeFrame) => {
  const now = dayjs()
  const eventDate = dayjs(event.eventDate)

  switch (timeFrame) {
      case EventTimeFrame.Next24Hours:
          return eventDate.isBetween(now, now.add(24, 'hours'), "hour", "[]")
      case EventTimeFrame.NextWeek:
          return eventDate.isBetween(now, now.add(7, 'days'), "day", "[]")
      case EventTimeFrame.NextMonth:
          return eventDate.isBetween(now, now.add(1, 'months'), "day", "[]")
      case EventTimeFrame.Past24Hours:
          return eventDate.isBetween(now.subtract(1, 'day'), now, "day", "[]")
      case EventTimeFrame.PastWeek:
          return eventDate.isBetween(now.subtract(7, 'day'), now, "day", "[]")
      case EventTimeFrame.PastMonth:
          return eventDate.isBetween(now.subtract(1, 'months'), now, "day", "[]")
      default:
          return true;
  }
}

export type GetEventTypes_Response = EventTypeData[];
export const GetEventTypes = () => ({
  key: ['/eventtypes'] as const,
  service: async () => ApiService('public')
    .fetchData<GetEventTypes_Response>({ url: `/eventtypes`, method: 'get' })
    .then(res => res.data as EventTypeData[])
});
export const useGetEventTypes = () => {
  return useQuery({ 
      queryKey: GetEventTypes().key,
      queryFn: GetEventTypes().service,
      initialData: () => [],
      initialDataUpdatedAt: 0,
      staleTime: Services.CACHE.DISABLE,
  })
}

export type GetAllEvents_Response = EventData[];
export const GetAllEvents = () => ({ key: ['/events'], service: async () => ApiService('protected').fetchData<GetAllEvents_Response>({ url: `/events`, method: 'get' }) });

export type GetEventsParams = {
  type: EventTimeLine
  timeFrame: EventTimeFrame
  country?: string
  state?: string
  cities?: string[]
  cleanTypes?: string[]
}

export const useGetEvents = (filterParams: GetEventsParams) => {
  return useQuery({
      queryKey: ["events", filterParams],
      queryFn: async ({ queryKey }) => {
          const params = queryKey[1] as GetEventsParams 

          const url: string = {
              [EventTimeLine.All]: '/Events/notcanceled',
              [EventTimeLine.Completed]: '/Events/completed',
              [EventTimeLine.Upcoming]: '/Events/active'
          }[params.type]

          const { data: events } = await ApiService('public').fetchData<EventData[]>({ url, method: 'get' })
          const filteredEvents = events
              .filter(event => !params.country || event.country === params.country)
              .filter(event => !params.country || !params.state || event.region === params.state)
              .filter(event => !params.country || !params.state || (params.cities || []).length === 0 || (params.cities || []).includes(event.city))
              .filter(event => (params.cleanTypes || []).length === 0 || (params.cleanTypes || []).includes(`${event.eventTypeId}`))
              .filter(event => !params.timeFrame || isInTimeFrame(event, params.timeFrame))

          return filteredEvents
      },
      initialData: () => [],
      initialDataUpdatedAt: 0,
  })
}

export type GetAllEventsBeingAttendedByUser_Params = { userId: string }
export type GetAllEventsBeingAttendedByUser_Response = EventData[];
export const GetAllEventsBeingAttendedByUser = (params: GetAllEventsBeingAttendedByUser_Params) => ({
  key: ['/events/eventsuserisattending/', params] as const,
  service: () => ApiService('protected')
    .fetchData<GetAllEventsBeingAttendedByUser_Response>({ url: `/events/eventsuserisattending/${params.userId}`, method: 'get' })
    .then(res => res.data as EventData[])
});

export const useGetAllEventsBeingAttendedByUser = (currentUser: UserData, queryOptions: Pick<UseQueryOptions, "enabled"> = { enabled: true }) => {
  return useQuery({ 
    queryKey: GetAllEventsBeingAttendedByUser({ userId: currentUser.id }).key,
    queryFn: GetAllEventsBeingAttendedByUser({ userId: currentUser.id }).service, 
    staleTime: Services.CACHE.DISABLE,
    initialData: () => [],
    initialDataUpdatedAt: 0,
    enabled: queryOptions.enabled,
  });
}

export type GetEventsSummaries_Params = { country: string; region: string; city: string; postalCode: string; }
export type GetEventsSummaries_Response = DisplayEventSummary[];
export const GetEventsSummaries = (params: GetEventsSummaries_Params) => ({ key: ['/eventsummaries', params], service: async () => ApiService('public').fetchData<GetEventsSummaries_Response>({ url: `/eventsummaries?country=${params.country}&region=${params.region}&city=${params.city}&postalCode=${params.postalCode}`, method: 'get' }) });

export type GetEventById_Params = { eventId: string; }
export type GetEventById_Response = EventData;
export const GetEventById = (params: GetEventById_Params) => ({ key: ['/Events/', params], service: async () => ApiService('public').fetchData<GetEventById_Response>({ url: `/Events/${params.eventId}`, method: 'get' }) });

export type CreateEvent_Body = EventData;
export type CreateEvent_Response = unknown;
export const CreateEvent = () => ({ key: ['/Events', 'create'], service: async (body: CreateEvent_Body) => ApiService('protected').fetchData<CreateEvent_Response, CreateEvent_Body>({ url: `/Events`, method: 'post', data: body }) });

export type UpdateEvent_Body = EventData;
export type UpdateEvent_Response = unknown;
export const UpdateEvent = () => ({ key: ['/Events', 'update'], service: async (body: UpdateEvent_Body) => ApiService('protected').fetchData<UpdateEvent_Response, UpdateEvent_Body>({ url: `/Events`, method: 'put', data: body }) });

export type DeleteEvent_Body = { eventId: string; cancellationReason: string; }
export type DeleteEvent_Response = EventData;
export const DeleteEvent = () => ({ key: ['/Events', 'delete'], service: async (body: DeleteEvent_Body) => ApiService('protected').fetchData<DeleteEvent_Response, DeleteEvent_Body>({ url: `/Events`, method: 'delete', data: body }) });

export type GetEventSummaryById_Params = { eventId: string; }
export type GetEventSummaryById_Response = EventSummaryData;
export const GetEventSummaryById = (params: GetEventSummaryById_Params) => ({ key: ['/eventsummaries/', params], service: async () => ApiService('public').fetchData<GetEventSummaryById_Response>({ url: `/eventsummaries/${params.eventId}`, method: 'get' }) });

export type CreateEventSummary_Body = EventSummaryData
export type CreateEventSummary_Response = unknown;
export const CreateEventSummary = () => ({ key: ['/eventsummaries', 'create'], service: async (body: CreateEventSummary_Body) => ApiService('protected').fetchData<CreateEventSummary_Response, CreateEventSummary_Body>({ url: `/eventsummaries`, method: 'post', data: body }) });

export type UpdateEventSummary_Body = EventSummaryData
export type UpdateEventSummary_Response = unknown;
export const UpdateEventSummary = () => ({ key: ['/eventsummaries', 'update'], service: async (body: UpdateEventSummary_Body) => ApiService('protected').fetchData<UpdateEventSummary_Response, UpdateEventSummary_Body>({ url: `/eventsummaries`, method: 'put', data: body }) });

export type GetEventAttendees_Params = { eventId: string; }
export type GetEventAttendees_Response = UserData[];
export const GetEventAttendees = (params: GetEventAttendees_Params) => ({ key: ['/eventattendees', params.eventId], service: async () => ApiService('protected').fetchData<GetEventAttendees_Response>({ url: `/eventattendees/${params.eventId}`, method: 'get' }) });

export type AddEventAttendee_Body = EventAttendeeData
export type AddEventAttendee_Response = unknown;
export const AddEventAttendee = () => ({ key: ['/EventAttendees', 'add'], service: async (body: AddEventAttendee_Body) => ApiService('protected').fetchData<AddEventAttendee_Response, AddEventAttendee_Body>({ url: `/EventAttendees`, method: 'post', data: body }) });

export type DeleteEventAttendee_Params = { eventId: string; userId: string; }
export type DeleteEventAttendee_Response = unknown;
export const DeleteEventAttendee = () => ({ key: ['/EventAttendees/', 'delete'], service: async (params: DeleteEventAttendee_Params) => ApiService('protected').fetchData<DeleteEventAttendee_Response>({ url: `/EventAttendees/${params.eventId}/${params.userId}`, method: 'delete' }) });

export type GetUserEvents_Params = { userId: string; }
export type GetUserEvents_Response = EventData[];
export const GetUserEvents = (params: GetUserEvents_Params) => ({ key: ['/events/userevents/', params, '/false'], service: async () => ApiService('protected').fetchData<GetUserEvents_Response>({ url: `/events/userevents/${params.userId}/false`, method: 'get' }) });
