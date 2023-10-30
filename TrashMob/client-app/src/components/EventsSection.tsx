import { FC, useEffect, useState, useCallback, useRef} from 'react'
import { MainEvents } from './MainEvents';
import { RouteComponentProps, } from 'react-router-dom';
import EventData from './Models/EventData';
import EventTypeData from './Models/EventTypeData';
import { getApiConfig, getDefaultHeaders, msalClient, validateToken } from './../store/AuthStore';
import { data } from 'azure-maps-control';
import * as MapStore from './../store/MapStore';
import { AzureMapsProvider, IAzureMapOptions } from 'react-azure-maps';
import MapControllerPointCollection from './MapControllerPointCollection';
import UserData from './Models/UserData';
import { Button} from 'reactstrap';
import { Container} from 'react-bootstrap';
import { getEventType } from '../store/eventTypeHelper';
import {EventFilterSection, EventTimeFrame, EventTimeLine} from './EventFilterSection';

export interface EventsSectionProps extends RouteComponentProps<any> {
    isUserLoaded: boolean;
    currentUser: UserData;
}

export const EventsSection: FC<EventsSectionProps> = ({ isUserLoaded, currentUser, history, location, match }) => {
    const [eventList, setEventList] = useState<EventData[]>([]);
    const [eventTypeList, setEventTypeList] = useState<EventTypeData[]>([]);
    const [isEventDataLoaded, setIsEventDataLoaded] = useState(false);
    const [isMapKeyLoaded, setIsMapKeyLoaded] = useState(false);
    const [center, setCenter] = useState<data.Position>(new data.Position(MapStore.defaultLongitude, MapStore.defaultLatitude));
    const [mapOptions, setMapOptions] = useState<IAzureMapOptions>();
    const [eventView, setEventView] = useState<string>('map');
    const [whichEvents, setWhichEvents] = useState<EventTimeLine>(EventTimeLine.Upcoming);
    const [myAttendanceList, setMyAttendanceList] = useState<EventData[]>([]);
    const [isUserEventDataLoaded, setIsUserEventDataLoaded] = useState(false);
    const [forceReload, setForceReload] = useState(false);
    const [eventHeader, setEventHeader] = useState("Upcoming Events");
    const [presentEventList, setPresentEventList] = useState<EventData[]>([]);
    const [locationMap, setLocationMap] = useState(new Map<string, Map<string, Set<string>>>());
    const [isResetFilters, setIsResetFilters] = useState(false);
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        setForceReload(false);
    },[presentEventList])

    useEffect(()=>{
        if(isResetFilters)
        {
            setIsResetFilters(false);
        }
    }, [isResetFilters])

    useEffect(() => {

        window.scrollTo(0, 0);

        const headers = getDefaultHeaders('GET');
        fetch('/api/eventtypes', {
            method: 'GET',
            headers: headers
        })
            .then(response => response.json() as Promise<Array<any>>)
            .then(data => {
                setEventTypeList(data);
            });

        fetch('/api/Events/active', {
            method: 'GET',
            headers: headers
        })
            .then(response => response.json() as Promise<EventData[]>)
            .then(data => {
                setEventList(data);
                updateLocationMap(data);
                setPresentEventList(data);
                setIsEventDataLoaded(true);
            });

        if (isUserLoaded && currentUser) {
            setMyAttendanceList([]);
            setIsUserEventDataLoaded(false);

            // If the user is logged in, get the events they are attending
            const accounts = msalClient.getAllAccounts();
            var apiConfig = getApiConfig();

            if (accounts !== null && accounts.length > 0) {
                const request = {
                    scopes: apiConfig.b2cScopes,
                    account: accounts[0]
                };

                msalClient.acquireTokenSilent(request).then(tokenResponse => {
                    if (!validateToken(tokenResponse.idTokenClaims)) {
                        return;
                    }

                    const headers = getDefaultHeaders('GET');
                    headers.append('Authorization', 'BEARER ' + tokenResponse.accessToken);

                    fetch('/api/events/eventsuserisattending/' + currentUser.id, {
                        method: 'GET',
                        headers: headers
                    })
                        .then(response => response.json() as Promise<EventData[]>)
                        .then(data => {
                            setMyAttendanceList(data);
                            setIsUserEventDataLoaded(true);
                        })
                });
            }
        }

        MapStore.getOption().then(opts => {
            setMapOptions(opts);
            setIsMapKeyLoaded(true);
        })

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                const point = new data.Position(position.coords.longitude, position.coords.latitude);
                setCenter(point)
            });
        } else {
            console.log("Not Available");
        }
    }, [isUserLoaded, currentUser])

    const updateLocationMap=(eventList: EventData[]) =>{
        const updatedMap = new Map<string, Map<string, Set<string>>>();

        eventList.forEach(event => {
            const {country, region, city} = event;

            if(!updatedMap.has(country))
            {
                updatedMap.set(country, new Map<string, Set<string>>());
            }

            const stateMap = updatedMap.get(country);
            if(stateMap)
            {
                if(!stateMap.has(region))
                {
                    stateMap.set(region, new Set<string>());
                }
                
                const citySet = stateMap.get(region);
                if(citySet)
                {
                    citySet.add(city);
                }
            }
        })

        setLocationMap(updatedMap);
    }

    const handleLocationChange = (point: data.Position) => {
        // do nothing
    }

    const handleDetailsSelected = (eventId: string) => {
        history.push("eventdetails/" + eventId);
    }

    const handleEventView = (view: string) => {
        setEventView(view);
    }

    const handleWhichEvents = (events: string) => {
        if (events === EventTimeLine.Upcoming) {
            setWhichEvents(EventTimeLine.Upcoming);

            const headers = getDefaultHeaders('GET');
            fetch('/api/Events/active', {
                method: 'GET',
                headers: headers
            }).then(response => response.json() as Promise<EventData[]>)
                .then(data => {
                    setForceReload(true);
                    setIsEventDataLoaded(false);
                    setEventList(data);
                    updateLocationMap(data);
                    setPresentEventList(data);
                    setEventHeader("Upcoming Events");
                    setIsEventDataLoaded(true);
                    setForceReload(false);
                });
        }
        else if(events === EventTimeLine.Completed){
            setWhichEvents(EventTimeLine.Completed);

            const headers = getDefaultHeaders('GET');
            fetch('/api/Events/completed', {
                method: 'GET',
                headers: headers
            })
            .then(response => response.json() as Promise<EventData[]>)
            .then(data => {
                setForceReload(true);
                setIsEventDataLoaded(false);
                setEventList(data);
                updateLocationMap(data);
                setPresentEventList(data);
                setEventHeader("Completed Events");
                setIsEventDataLoaded(true);
                setForceReload(false);
            });
        }
        else {
            setWhichEvents(EventTimeLine.All);
            const headers = getDefaultHeaders('GET');
            fetch('/api/Events/notcanceled', {
                method: 'GET',
                headers: headers
            })
                .then(response => response.json() as Promise<EventData[]>)
                .then(data => {
                    setForceReload(true);
                    setIsEventDataLoaded(false);
                    setEventList(data);
                    updateLocationMap(data);
                    setPresentEventList(data);
                    setEventHeader("All Events")
                    setIsEventDataLoaded(true);
                    setForceReload(false);
                });
        }

        setIsResetFilters(true);
    }

    function handleAttendanceChanged() {
        setMyAttendanceList([]);
        setIsUserEventDataLoaded(false);

        if (!isUserLoaded || !currentUser) {
            return;
        }

        // If the user is logged in, get the events they are attending
        const accounts = msalClient.getAllAccounts();
        var apiConfig = getApiConfig();

        if (accounts !== null && accounts.length > 0) {
            const request = {
                scopes: apiConfig.b2cScopes,
                account: accounts[0]
            };

            msalClient.acquireTokenSilent(request).then(tokenResponse => {
                if (!validateToken(tokenResponse.idTokenClaims)) {
                    return;
                }

                const headers = getDefaultHeaders('GET');
                headers.append('Authorization', 'BEARER ' + tokenResponse.accessToken);

                fetch('/api/events/eventsuserisattending/' + currentUser.id, {
                    method: 'GET',
                    headers: headers
                })
                    .then(response => response.json() as Promise<EventData[]>)
                    .then(data => {
                        setMyAttendanceList(data);
                        setIsUserEventDataLoaded(true);
                    })
            });
        }
    }
        
    const updateFilterEvents= useCallback((selectedCountry:string, selectedState:string, selectedCities:string[], selectedCleanTypes:string[], selectedTimeFrame:EventTimeFrame)=>{
        var filterEvents = eventList;

        if(selectedCountry !== "")
        {
            filterEvents = filterEvents.filter((event)=> event.country === selectedCountry);

            if(selectedState !== "")
            {
                filterEvents = filterEvents.filter((event)=>event.region === selectedState);
                
                if(selectedCities.length > 0)
                {
                    filterEvents = filterEvents.filter((event)=>selectedCities.includes(event.city));
                }
            }
        }

        if(selectedCleanTypes.length > 0)
        {
            filterEvents = filterEvents.filter((event) => selectedCleanTypes.includes(getEventType(eventTypeList, event.eventTypeId)));
        }

        if(selectedTimeFrame !== EventTimeFrame.AnyTime)
        {
            filterEvents = filterEvents.filter((event) => {
                var now = new Date();
                switch(selectedTimeFrame){
                    case EventTimeFrame.Next24Hours:{
                        return new Date(event.eventDate) > now && new Date(event.eventDate)< new Date(now.setDate(now.getDate()+1));
                    }
                    case EventTimeFrame.NextWeek:{
                        return new Date(event.eventDate) > now && new Date(event.eventDate) < new Date(now.setDate(now.getDate()+7));
                    }
                    case EventTimeFrame.NextMonth:{
                        return new Date(event.eventDate) > now && new Date(event.eventDate) < new Date(now.setMonth(now.getMonth()+1));
                    }
                    case EventTimeFrame.Past24Hours:{
                        return new Date(event.eventDate) < now && new Date(event.eventDate) > new Date(now.setDate(now.getDate()-1));
                    }
                    case EventTimeFrame.PastWeek:{
                        return new Date(event.eventDate) < now && new Date(event.eventDate) > new Date(now.setDate(now.getDate()-7));
                    }
                    case EventTimeFrame.PastMonth:{
                        return new Date(event.eventDate) < now && new Date(event.eventDate) > new Date(now.setMonth(now.getMonth()-1));
                    }
                    default:
                        return true;
                }
            })
        }

        setPresentEventList(filterEvents);
    },[eventList, eventTypeList])

    const updateEventsByFilters = useCallback((selectedCountry:string, selectedState:string, selectedCities:string[], selectedCleanTypes:string[], selectedTimeFrame:EventTimeFrame)=>{
        setIsEventDataLoaded(false);
        setForceReload(true);
        updateFilterEvents(selectedCountry, selectedState, selectedCities, selectedCleanTypes, selectedTimeFrame);
        setIsEventDataLoaded(true);
    },[updateFilterEvents]);

    const backToTop = () =>{
        if(divRef.current)
        {
            divRef.current.scrollIntoView();
        }
    }

    return (
        <>
            <Container fluid className="bg-white p-md-5"  id="events" ref={divRef} >
                <div className="max-width-container mx-auto">
                    <div className="d-flex align-items-center mt-4">
                        <label className="mb-0">
                            <input type="radio" className="mb-0 radio" name="Which events" value="upcoming" onChange={e => handleWhichEvents(e.target.value)} checked={whichEvents === EventTimeLine.Upcoming}></input>
                            <span className="px-2">Upcoming Events</span>
                        </label>
                        <label className="pr-3 mb-0">
                            <input type="radio" className="mb-0 radio" name="Which events" value="completed" onChange={e => handleWhichEvents(e.target.value)} checked={whichEvents === EventTimeLine.Completed}></input>
                            <span className="px-2">Completed Events</span>
                        </label>
                        <label className="pr-3 mb-0">
                            <input type="radio" className="mb-0 radio" name="Which events" value="all" onChange={e => handleWhichEvents(e.target.value)} checked={whichEvents === EventTimeLine.All}></input>
                            <span className="px-2">All Events</span>
                        </label>
                    </div>
                    <EventFilterSection updateEventsByFilters={updateEventsByFilters} locationMap={locationMap} eventTypeList={eventTypeList} isResetFilters= {isResetFilters} eventTimeLine={whichEvents} ></EventFilterSection>
                    <div className="d-flex justify-content-between mb-4 flex-wrap flex-md-nowrap">
                        <h3 className="font-weight-bold flex-grow-1">{eventHeader}</h3>
                        <div className="d-flex align-items-center mt-4">
                            <label className="pr-3 mb-0">
                                <input type="radio" className="mb-0 radio" name="Event view" value="map" onChange={e => handleEventView(e.target.value)} checked={eventView === "map"}></input>
                                <span className="px-2">Map view</span>
                            </label>
                            <label className="mb-0">
                                <input type="radio" className="mb-0 radio" name="Event view" value="list" onChange={e => handleEventView(e.target.value)} checked={eventView === "list"}></input>
                                <span className="px-2">List view</span>
                            </label>
                        </div>
                    </div>
                    {eventView === 'map' ? (
                        <>
                            <Button color='primary' className='mb-2' onClick={() => history.push("/manageeventdashboard")}>Create a New Event</Button>
                            <div className="w-100 m-0">
                                <AzureMapsProvider>
                                    <>
                                        <MapControllerPointCollection forceReload={forceReload} center={center} multipleEvents={presentEventList} myAttendanceList={myAttendanceList} isUserEventDataLoaded={isUserEventDataLoaded} isEventDataLoaded={isEventDataLoaded} mapOptions={mapOptions} isMapKeyLoaded={isMapKeyLoaded} eventName={""} latitude={0} longitude={0} onLocationChange={handleLocationChange} currentUser={currentUser} isUserLoaded={isUserLoaded} onAttendanceChanged={handleAttendanceChanged} onDetailsSelected={handleDetailsSelected} history={history} location={location} match={match} />
                                    </>
                                </AzureMapsProvider>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="container-lg">
                                <MainEvents eventList={presentEventList} eventTypeList={eventTypeList} myAttendanceList={myAttendanceList} isEventDataLoaded={isEventDataLoaded} isUserEventDataLoaded={isUserEventDataLoaded} isUserLoaded={isUserLoaded} currentUser={currentUser} onAttendanceChanged={handleAttendanceChanged} history={history} location={location} match={match} backToTop={backToTop}/>
                            </div>
                        </>
                    )}
                </div>
            </Container>
        </>
    );
}