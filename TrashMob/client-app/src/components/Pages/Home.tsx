import { FC, useEffect, useState } from 'react'
import { MainEvents } from '../MainEvents';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import EventData from '../Models/EventData';
import EventTypeData from '../Models/EventTypeData';
import { getApiConfig, getDefaultHeaders, msalClient, validateToken } from '../../store/AuthStore';
import { data } from 'azure-maps-control';
import * as MapStore from '../../store/MapStore';
import { AzureMapsProvider, IAzureMapOptions } from 'react-azure-maps';
import MapControllerPointCollection from '../MapControllerPointCollection';
import UserData from '../Models/UserData';
import { Button } from 'reactstrap';
import { Col, Container, Image, Row } from 'react-bootstrap';
import Drawings from '../assets/home/Drawings.png';
import Globe2 from '../assets/globe2.png';
import Logo from '../assets/logo.svg';
import Calendar from '../assets/home/Calendar.svg';
import Trashbag from '../assets/home/Trashbag.svg';
import Person from '../assets/home/Person.svg';
import Clock from '../assets/home/Clock.svg';
import { GettingStartedSection } from '../GettingStartedSection';
import StatsData from '../Models/StatsData';
import { Share } from 'react-bootstrap-icons';
import { SocialsModal } from '../EventManagement/ShareToSocialsModal';

export interface HomeProps extends RouteComponentProps<any> {
    isUserLoaded: boolean;
    currentUser: UserData;
    onUserUpdated: any;
}

const Home: FC<HomeProps> = ({ isUserLoaded, currentUser, history, location, match }) => {
    const [eventList, setEventList] = useState<EventData[]>([]);
    const [eventTypeList, setEventTypeList] = useState<EventTypeData[]>([]);
    const [isEventDataLoaded, setIsEventDataLoaded] = useState(false);
    const [isMapKeyLoaded, setIsMapKeyLoaded] = useState(false);
    const [center, setCenter] = useState<data.Position>(new data.Position(MapStore.defaultLongitude, MapStore.defaultLatitude));
    const [mapOptions, setMapOptions] = useState<IAzureMapOptions>();
    const [eventView, setEventView] = useState<string>('map');
    const [whichEvents, setWhichEvents] = useState<string>('upcomingOnly');
    const [totalBags, setTotalBags] = useState<number>(0);
    const [totalHours, setTotalHours] = useState<number>(0);
    const [totalEvents, setTotalEvents] = useState<number>(0);
    const [totalParticipants, setTotalParticipants] = useState<number>(0);
    const [myAttendanceList, setMyAttendanceList] = useState<EventData[]>([]);
    const [isUserEventDataLoaded, setIsUserEventDataLoaded] = useState(false);
    const [forceReload, setForceReload] = useState(false);
    const [eventHeader, setEventHeader] = useState("Upcoming Events");
    const [showModal, setShowSocialsModal] = useState<boolean>(false);

    const invitationMsg = 'Interested in cleaning up the planet? Willing to get your hands a little dirty to make the world a better place? Check out {{TrashMob}}! ' +
        'It\'s completely free, and helps individuals and local organizations to connect with like-minded people and groups to clean up their communities. Get started today by signing up using the link!'

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
                setIsEventDataLoaded(true);
            });

        fetch('/api/stats', {
            method: 'GET',
            headers: headers
        })
            .then(response => response.json() as Promise<StatsData>)
            .then(data => {
                setTotalBags(data.totalBags);
                setTotalHours(data.totalHours);
                setTotalEvents(data.totalEvents);
                setTotalParticipants(data.totalParticipants);
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

    const handleLocationChange = (point: data.Position) => {
        // do nothing
    }

    const handleDetailsSelected = (eventId: string) => {
        history.push("eventdetails/" + eventId);
    }

    const handleEventView = (view: string) => {
        setEventView(view);
    }

    const handleShowModal = (showModal: boolean) => {
        setShowSocialsModal(showModal)
    }

    const handleWhichEvents = (events: string) => {
        setWhichEvents(events);

        if (events === 'upcomingOnly') {
            const headers = getDefaultHeaders('GET');
            fetch('/api/Events/active', {
                method: 'GET',
                headers: headers
            })
                .then(response => response.json() as Promise<EventData[]>)
                .then(data => {
                    setForceReload(false);
                    setIsEventDataLoaded(false);
                    setEventList(data);
                    setEventHeader("Upcoming Events")
                    setIsEventDataLoaded(true);
                    setForceReload(true);
                });
        }
        else {
            const headers = getDefaultHeaders('GET');
            fetch('/api/Events/notcanceled', {
                method: 'GET',
                headers: headers
            })
                .then(response => response.json() as Promise<EventData[]>)
                .then(data => {
                    setForceReload(false);
                    setIsEventDataLoaded(false);
                    setEventList(data);
                    setEventHeader("Upcoming and Completed Events")
                    setIsEventDataLoaded(true);
                    setForceReload(true);
                });
        }
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

    return (
        <>
            <Container fluid>
                <SocialsModal show={showModal} handleShow={handleShowModal} modalTitle='Invite a friend to join TrashMob.eco' eventLink='https://www.trashmob.eco' emailSubject='Join TrashMob.eco to help clean up the planet!' message={invitationMsg} />
                <Row className="shadow position-relative" >
                    <Col className="d-flex flex-column px-0 py-4 pl-lg-5" sm={6} style={{ zIndex: 1 }}>
                        <div className="ml-sm-2 ml-lg-5 pl-sm-3 pl-md-5 mt-md-5 mb-md-2">
                            <img src={Logo} alt="TrashMob.eco logo" className="banner-logo"></img>
                            <h3 className="ml-md-4 mt-4 mb-4 mb-md-5 font-weight-bold font-size-xl banner-heading pl-3">Meet up. Clean up. Feel good.</h3>
                            <Link className="btn btn-primary ml-5 py-md-3 banner-button" to="/gettingstarted">Join us today</Link>
                            <Button className="btn btn-primary ml-5 py-md-3 banner-button" onClick={() => { handleShowModal(true) }}>
                                <Share className="mr-2" />
                                Invite a friend
                            </Button>
                        </div>
                    </Col>
                    <img src={Globe2} className="position-absolute p-0 m-0 h-100 banner-globe" alt="Globe" ></img>
                </Row>
            </Container>
            <div className="bg-white pb-4"><Image src={Drawings} alt="Drawings of trash" className="w-100" /></div>
            <div className='bg-white'>
                <Container className='py-5'>
                    <Row className='py-5'>
                        <Col md={6}>
                            <h1 className="mt-0 font-weight-bold">What is a TrashMob?</h1>
                            <h4 className='my-5'>A TrashMob is a group of citizens who are willing to take an hour or two out of their lives to get together and clean up their communities. Start your impact today.</h4>
                            <Link className="mt-5 btn btn-primary btn-128" to="/aboutus" role="button">Learn more</Link>
                        </Col>
                        <Col md={6}>
                            <iframe width="560" height="315" src="https://www.youtube.com/embed/ylOBeVHRtuM" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Container className="d-flex justify-content-around my-5 py-5 flex-column flex-md-row">
                <div className="d-flex flex-column justify-content-center text-center">
                    <img src={Calendar} alt="Calendar icon" className="w-auto mx-auto mb-3" />
                    <span className="font-weight-bold font-size-lg">{totalEvents}</span>
                    <span className="font-weight-bold">Events Hosted</span>
                </div>
                <div className="d-flex flex-column justify-content-center text-center">
                    <img src={Trashbag} alt="Trashbag icon" className="w-auto mx-auto mb-3" />
                    <span className="font-weight-bold font-size-lg">{totalBags}</span>
                    <span className="font-weight-bold">Bags Collected</span>
                </div>
                <div className="d-flex flex-column justify-content-center text-center">
                    <img src={Person} alt="Person icon" className="w-auto mx-auto mb-3" />
                    <span className="font-weight-bold font-size-lg">{totalParticipants}</span>
                    <span className="font-weight-bold">Participants</span>
                </div>
                <div className="d-flex flex-column justify-content-center text-center">
                    <img src={Clock} alt="Clock icon" className="w-auto mx-auto mb-3" />
                    <span className="font-weight-bold font-size-lg">{totalHours}</span>
                    <span className="font-weight-bold">Hours Spent</span>
                </div>
            </Container>
            <Container fluid className="bg-white p-md-5">
                <div className="max-width-container mx-auto">
                    <div className="d-flex align-items-center mt-4">
                        <label className="mb-0">
                            <input type="radio" className="mb-0 radio" name="Which events" value="upcomingOnly" onChange={e => handleWhichEvents(e.target.value)} checked={whichEvents === "upcomingOnly"}></input>
                            <span className="px-2">Upcoming Events Only</span>
                        </label>
                        <label className="pr-3 mb-0">
                            <input type="radio" className="mb-0 radio" name="Which events" value="upcomingAndCompleted" onChange={e => handleWhichEvents(e.target.value)} checked={whichEvents === "upcomingAndCompleted"}></input>
                            <span className="px-2">Upcoming and Completed Events</span>
                        </label>
                    </div>
                    <div className="d-flex justify-content-between mb-4 flex-wrap flex-md-nowrap">
                        <h3 id="events" className="font-weight-bold flex-grow-1">{eventHeader}</h3>
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
                                        <MapControllerPointCollection forceReload={forceReload} center={center} multipleEvents={eventList} myAttendanceList={myAttendanceList} isUserEventDataLoaded={isUserEventDataLoaded} isEventDataLoaded={isEventDataLoaded} mapOptions={mapOptions} isMapKeyLoaded={isMapKeyLoaded} eventName={""} latitude={0} longitude={0} onLocationChange={handleLocationChange} currentUser={currentUser} isUserLoaded={isUserLoaded} onAttendanceChanged={handleAttendanceChanged} onDetailsSelected={handleDetailsSelected} history={history} location={location} match={match} />
                                    </>
                                </AzureMapsProvider>
                            </div>
                        </>
                    ) : (
                        <>
                            <Button color='primary' className='mb-2' onClick={() => history.push("/manageeventdashboard")}>Create a New Event</Button>
                            <div className="container-lg">
                                <MainEvents eventList={eventList} eventTypeList={eventTypeList} myAttendanceList={myAttendanceList} isEventDataLoaded={isEventDataLoaded} isUserEventDataLoaded={isUserEventDataLoaded} isUserLoaded={isUserLoaded} currentUser={currentUser} onAttendanceChanged={handleAttendanceChanged} history={history} location={location} match={match} />
                            </div>
                        </>
                    )}
                </div>
            </Container>
            <GettingStartedSection />
        </>
    );
}

export default withRouter(Home);
