import { FC, useEffect, useState } from 'react';
import { Link, RouteComponentProps, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getEventType } from '../store/eventTypeHelper';
import EventData from './Models/EventData';
import EventTypeData from './Models/EventTypeData';
import UserData from './Models/UserData';
import { RegisterBtn } from './Customization/RegisterBtn';
import { Pagination } from './Customization/Pagination';
import WaiverData from './Models/WaiverData';
import { GetTrashMobWaivers } from '../services/waivers';
import { Services } from '../config/services.config';
import { AddEventAttendee } from '../services/events';

export interface DisplayEvent {
    id: string;
    name: string;
    eventDate: Date;
    eventTypeId: number;
    city: string;
    region: string;
    country: string;
    isAttending: string;
    creator: string;
}

export interface MainEventsDataProps extends RouteComponentProps {
    eventList: EventData[];
    eventTypeList: EventTypeData[];
    myAttendanceList: EventData[];
    isEventDataLoaded: boolean;
    isUserEventDataLoaded: boolean;
    isUserLoaded: boolean;
    currentUser: UserData;
    backToTop: any;
}

enum SortingOrder {
    Ascending,
    Descending,
}

export const MainEvents: FC<MainEventsDataProps> = ({
    isEventDataLoaded,
    eventList,
    isUserEventDataLoaded,
    myAttendanceList,
    isUserLoaded,
    eventTypeList,
    currentUser,
    backToTop,
}) => {
    const navigate = useNavigate();
    const [displayEvents, setDisplayEvents] = useState<DisplayEvent[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentTableData, setCurrentTableData] = useState<DisplayEvent[]>([]);
    const [sortingOrder, setSortingOrder] = useState<number>(SortingOrder.Ascending);
    const [waiver, setWaiver] = useState<WaiverData>();
    const eventPerPage = 10;

    const getTrashMobWaivers = useQuery({
        queryKey: GetTrashMobWaivers().key,
        queryFn: GetTrashMobWaivers().service,
        staleTime: Services.CACHE.DISABLE,
        enabled: false,
    });

    const addEventAttendee = useMutation({
        mutationKey: AddEventAttendee().key,
        mutationFn: AddEventAttendee().service,
    });

    useEffect(() => {
        getTrashMobWaivers.refetch().then((res) => {
            setWaiver(res.data?.data);
        });
    }, []);

    useEffect(() => {
        const firstPageIndex = (currentPage - 1) * eventPerPage;
        const lastPageIndex =
            firstPageIndex + eventPerPage < displayEvents.length ? firstPageIndex + eventPerPage : displayEvents.length;
        setCurrentTableData(displayEvents.slice(firstPageIndex, lastPageIndex));
        backToTop();
    }, [currentPage, displayEvents, backToTop]);

    useEffect(() => {
        if (isEventDataLoaded && eventList) {
            const list = eventList.map((mobEvent) => {
                const dispEvent: DisplayEvent = {
                    id: mobEvent.id,
                    city: mobEvent.city,
                    region: mobEvent.region,
                    country: mobEvent.country,
                    eventDate: mobEvent.eventDate,
                    eventTypeId: mobEvent.eventTypeId,
                    name: mobEvent.name,
                    creator: mobEvent.createdByUserName,
                    isAttending: '',
                };

                if (isUserEventDataLoaded) {
                    const isAttending =
                        myAttendanceList && myAttendanceList.findIndex((e) => e.id === mobEvent.id) >= 0;
                    dispEvent.isAttending = isAttending ? 'Yes' : 'No';
                } else {
                    dispEvent.isAttending = 'Log in to see your status';
                }

                return dispEvent;
            });

            if (sortingOrder === SortingOrder.Ascending) {
                setDisplayEvents(list.sort((a, b) => (a.eventDate > b.eventDate ? 1 : -1)));
            } else {
                setDisplayEvents(list.sort((a, b) => (a.eventDate < b.eventDate ? 1 : -1)));
            }

            setCurrentPage(1);
        }
    }, [isEventDataLoaded, eventList, myAttendanceList, isUserLoaded, isUserEventDataLoaded, sortingOrder]);

    const onPageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const sortEventsByDate = () => {
        if (sortingOrder === SortingOrder.Ascending) {
            setSortingOrder(SortingOrder.Descending);
        } else {
            setSortingOrder(SortingOrder.Ascending);
        }
    };

    const renderEventsList = (events: DisplayEvent[]) => (
        <div>
            <div className='tailwind'>
                <div className='flex flex-row justify-between'>
                    <Button color='primary' className='mb-2' onClick={() => navigate('/manageeventdashboard')}>
                        Create a New Event
                    </Button>
                    <Button color='primary' className='mb-2 align-self-right' onClick={sortEventsByDate}>
                        Sort By Date{' '}
                        {sortingOrder === SortingOrder.Ascending
                            ? String.fromCharCode(8593)
                            : String.fromCharCode(8595)}
                    </Button>
                </div>
            </div>
            <ol className='px-1 px-md-5'>
                {events.map((mobEvent, i) => (
                    <li
                        className={`d-flex flex-column justify-content-center mb-2 ${i !== events.length - 1 ? 'border-bottom' : ''}`}
                        key={`event-${i}`}
                    >
                        <div className='d-flex justify-content-between align-items-start align-items-sm-end flex-column flex-sm-row'>
                            <h5 className='font-weight-bold font-size-xl'>{mobEvent.name}</h5>
                            <span className='font-grey'>Created by: {mobEvent.creator}</span>
                        </div>
                        <span className='my-2 event-list-event-type p-2 rounded'>
                            {getEventType(eventTypeList, mobEvent.eventTypeId)}
                        </span>
                        <div className='d-flex justify-content-between align-items-start align-items-sm-end mb-2 flex-column flex-sm-row'>
                            <div className='d-inline-block font-grey'>
                                <p>
                                    {new Date(mobEvent.eventDate).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                    })}
                                </p>
                                <span>
                                    {mobEvent.city},{mobEvent.region},{mobEvent.country}
                                </span>
                            </div>
                            <div className='mt-2 mt-sm-0 tailwind'>
                                <Link to={`/eventdetails/${mobEvent.id}`}>
                                    <button className='btn btn-outline mr-2 font-weight-bold btn-128'>View</button>
                                </Link>
                                <RegisterBtn
                                    eventId={mobEvent.id}
                                    isAttending={mobEvent.isAttending}
                                    isEventCompleted={new Date(mobEvent.eventDate) < new Date()}
                                    currentUser={currentUser}
                                    isUserLoaded={isUserLoaded}
                                />
                            </div>
                        </div>
                    </li>
                ))}
            </ol>
            <Pagination
                totalCount={displayEvents.length}
                currentPage={currentPage}
                pageSize={eventPerPage}
                onPageChange={onPageChange}
            />
        </div>
    );

    return (
        <>
            {!isEventDataLoaded && (
                <p>
                    <em>Loading...</em>
                </p>
            )}
            {isEventDataLoaded ? renderEventsList(currentTableData) : null}
        </>
    );
};
