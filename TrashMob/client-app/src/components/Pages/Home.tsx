import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import UserData from '../Models/UserData';
import Globe2 from '../assets/globe2.png';
import Logo from '../assets/logo.svg';
import Calendar from '../assets/home/Calendar.svg';
import Trashbag from '../assets/home/Trashbag.svg';
import Person from '../assets/home/Person.svg';
import Clock from '../assets/home/Clock.svg';
import { GettingStartedSection } from '../GettingStartedSection';
import EventsSection from '../EventsSection';
import { GetStats } from '../../services/stats';
import { Services } from '../../config/services.config';
import StatsData from '../Models/StatsData';
import { Share } from 'react-bootstrap-icons';
import { ShareToSocialsDialog } from '../EventManagement/ShareToSocialsDialog';
import * as SharingMessages from '../../store/SharingMessages';

export interface HomeProps {
    isUserLoaded: boolean;
    currentUser: UserData;
    onUserUpdated: any;
}

const useGetHomeStats = () =>
    useQuery<StatsData>({
        queryKey: GetStats().key,
        queryFn: GetStats().service,
        initialData: () => ({
            totalBags: 0,
            totalEvents: 0,
            totalHours: 0,
            totalParticipants: 0,
        }),
        initialDataUpdatedAt: 0,
        staleTime: Services.CACHE.DISABLE,
    });

const Home: FC<HomeProps> = ({ isUserLoaded, currentUser }) => {
    const [showModal, setShowSocialsModal] = useState<boolean>(false);
    const handleShowModal = (showModal: boolean) => setShowSocialsModal(showModal);

    const { data: stats } = useGetHomeStats();
    const { totalBags, totalEvents, totalHours, totalParticipants } = stats;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [isUserLoaded, currentUser]);

    return (
        <>
            <Container fluid>
                <div className='position-absolute'>
                    <ShareToSocialsDialog
                        show={showModal}
                        handleShow={handleShowModal}
                        modalTitle='Invite a friend to join TrashMob.eco'
                        eventLink='https://www.trashmob.eco'
                        emailSubject='Join TrashMob.eco to help clean up the planet!'
                        message={SharingMessages.InvitationMessage}
                    />
                </div>
                <Row className='shadow position-relative'>
                    <div className='d-flex flex-column px-0 py-0 pl-lg-5 m-auto w-100' style={{ zIndex: 10 }}>
                        <div className='d-flex flex-row-reverse align-content-center mx-0 px-0'>
                            <img
                                src={Globe2}
                                className='h-100 w-auto d-none d-sm-block mt-0'
                                alt='Globe'
                                style={{
                                    maxHeight: '300px',
                                    maxWidth: '300px',
                                }}
                            />
                            <img
                                src={Globe2}
                                className='d-block d-sm-none h-100 w-auto m-auto position-absolute'
                                alt='Globe'
                                style={{
                                    opacity: '30%',
                                    zIndex: '-1',
                                }}
                            />
                            <div className='d-flex flex-column justify-content-center w-75 m-auto z-10 pl-sm-2 px-md-5'>
                                <img
                                    src={Logo}
                                    className='w-100 mx-auto mt-4 ml-sm-3'
                                    alt='Trashmob.eco logo'
                                    style={{ maxWidth: '550px' }}
                                />
                                <h4 className='text-center text-sm-left mb-4 ml-sm-5 font-weight-bold banner-heading ml-sm-4'>
                                    Meet up. Clean up. Feel good.
                                </h4>
                                <div className='d-flex ml-sm-4 flex-wrap' style={{ gap: '8px' }}>
                                    <Link className='btn btn-primary banner-button' to='/gettingstarted'>
                                        Join us today
                                    </Link>
                                    <Button
                                        className='btn btn-primary banner-button'
                                        onClick={() => handleShowModal(true)}
                                    >
                                        <Share className='mr-2' />
                                        Invite a friend
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Row>
            </Container>
            <div className='bg-white'>
                <Container className='py-5'>
                    <Row className='py-4 px-2'>
                        <Col lg={6} className='order-2 order-lg-1 d-flex flex-column text-center'>
                            <h1 className='d-md-none d-lg-block text-md-left mt-4 font-weight-bold'>
                                What is a TrashMob?
                            </h1>
                            <h4 className='text-md-left'>
                                A TrashMob is a group of citizens who are willing to take an hour or two out of their
                                lives to get together and clean up their communities. Start your impact today.
                            </h4>
                            <div className='d-flex flex-column flex-md-row'>
                                <Link
                                    className='mx-auto mr-md-2 ml-md-0 my-2 btn btn-primary btn-128 h-auto w-auto'
                                    to='/aboutus'
                                    role='button'
                                >
                                    Learn more
                                </Link>
                                <a
                                    className='mx-auto ml-md-0 my-2 btn btn-primary btn-128 w-auto'
                                    role='button'
                                    href='/#events'
                                >
                                    View Upcoming Events
                                </a>
                            </div>
                        </Col>
                        <Col lg={6} className='order-1 order-lg-2 align-content-center'>
                            <h1 className='d-none d-md-block d-lg-none my-4 font-weight-bold'>What is a TrashMob?</h1>
                            <div className='embed-responsive embed-responsive-16by9'>
                                <iframe
                                    className='embed-responsive-item'
                                    width='560'
                                    height='315'
                                    src='https://www.youtube.com/embed/ylOBeVHRtuM'
                                    title='YouTube video player'
                                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                                    allowFullScreen
                                />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className='d-flex justify-content-center m-4'>
                <div className='row row-cols-2 row-cols-md-5 justify-content-center'>
                    {[
                        {
                            id: 0,
                            title: 'Events Hosted',
                            value: totalEvents,
                            icon: Calendar,
                            alt: 'Calendar icon',
                        },
                        {
                            id: 1,
                            title: 'Bags Collected',
                            value: totalBags,
                            icon: Trashbag,
                            alt: 'Trashbag icon',
                        },
                        {
                            id: 2,
                            title: 'Participants',
                            value: totalParticipants,
                            icon: Person,
                            alt: 'Person icon',
                        },
                        {
                            id: 3,
                            title: 'Hours Spent',
                            value: totalHours,
                            icon: Clock,
                            alt: 'Clock icon',
                        },
                    ].map((item) => (
                        <div
                            key={item.id}
                            style={{ borderRadius: '8px' }}
                            // TODO: Extract to custom class
                            className='m-2 m-sm-3 m-md-3 w-auto col-5 d-flex flex-column bg-light p-3 shadow'
                        >
                            <img src={item.icon} alt={item.alt} className='w-25 h-25 mb-3' />
                            <span className='font-weight-bold font-size-lg'>{item.value}</span>
                            <span className=' font-weight-bold'>{item.title}</span>
                        </div>
                    ))}
                </div>
            </div>
            <EventsSection currentUser={currentUser} isUserLoaded={isUserLoaded} />
            <GettingStartedSection />
        </>
    );
};

export default Home;
