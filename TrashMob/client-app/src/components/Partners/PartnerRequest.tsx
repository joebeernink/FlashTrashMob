import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Button, Col, Container, Form } from 'react-bootstrap';
import { data } from 'azure-maps-control';
import { AzureMapsProvider, IAzureMapOptions } from 'react-azure-maps';
import PhoneInput from 'react-phone-input-2';
import { useMutation } from '@tanstack/react-query';
import * as ToolTips from '../../store/ToolTips';
import PartnerRequestData from '../Models/PartnerRequestData';
import UserData from '../Models/UserData';
import * as Constants from '../Models/Constants';
import * as MapStore from '../../store/MapStore';
import MapControllerSinglePointNoEvents from '../MapControllerSinglePointNoEvent';
import { CreatePartnerRequest } from '../../services/partners';
import { AzureMapSearchAddressReverse } from '../../services/maps';

interface PartnerRequestProps extends RouteComponentProps<any> {
    mode: string;
    isUserLoaded: boolean;
    currentUser: UserData;
}

export const PartnerRequest: React.FC<PartnerRequestProps> = (props) => {
    const [name, setName] = React.useState<string>();
    const [partnerTypeId, setPartnerTypeId] = React.useState<number>(Constants.PartnerTypeGovernment);
    const [isGovernmentPartner, setIsGovernmentPartner] = React.useState<boolean>(true);
    const [email, setEmail] = React.useState<string>();
    const [website, setWebsite] = React.useState<string>();
    const [phone, setPhone] = React.useState<string>();
    const [notes, setNotes] = React.useState<string>('');
    const [nameErrors, setNameErrors] = React.useState<string>('');
    const [emailErrors, setEmailErrors] = React.useState<string>('');
    const [websiteErrors, setWebsiteErrors] = React.useState<string>('');
    const [phoneErrors, setPhoneErrors] = React.useState<string>('');
    const [latitude, setLatitude] = React.useState<number>(0);
    const [longitude, setLongitude] = React.useState<number>(0);
    const [streetAddress, setStreetAddress] = React.useState<string>();
    const [city, setCity] = React.useState<string>();
    const [country, setCountry] = React.useState<string>('');
    const [region, setRegion] = React.useState<string>();
    const [postalCode, setPostalCode] = React.useState<string>();
    const [center, setCenter] = React.useState<data.Position>(
        new data.Position(MapStore.defaultLongitude, MapStore.defaultLatitude),
    );
    const [mapOptions, setMapOptions] = React.useState<IAzureMapOptions>();
    const [isMapKeyLoaded, setIsMapKeyLoaded] = React.useState<boolean>(false);
    const [isSaveEnabled, setIsSaveEnabled] = React.useState<boolean>(false);
    const [title, setTitle] = React.useState<string>('Apply to become a partner');
    const [mode, setMode] = React.useState<string>('');

    const createPartnerRequest = useMutation({
        mutationKey: CreatePartnerRequest().key,
        mutationFn: CreatePartnerRequest().service,
    });

    const azureMapSearchAddressReverse = useMutation({
        mutationKey: AzureMapSearchAddressReverse(),
        mutationFn: AzureMapSearchAddressReverse().service
    }); 

    React.useEffect(() => {
        setIsGovernmentPartner(true);

        if (props.mode && props.mode === 'send') {
            setMode('send');
            setTitle('Send invite to join TrashMob as a partner');
        } else {
            setMode('request');
        }

        MapStore.getOption().then((opts) => {
            setMapOptions(opts);
            setIsMapKeyLoaded(true);
        });

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const point = new data.Position(position.coords.longitude, position.coords.latitude);
                setCenter(point);
            });
        } else {
            console.log('Not Available');
        }
    }, [props.currentUser, props.isUserLoaded, props.mode]);

    React.useEffect(() => {
        if (nameErrors !== '' || emailErrors !== '' || websiteErrors !== '' || phoneErrors !== '' || region === '') {
            setIsSaveEnabled(false);
        } else {
            setIsSaveEnabled(true);
        }
    }, [nameErrors, emailErrors, websiteErrors, phoneErrors, region]);

    // This will handle the submit form event.
    function handleSave(event: any) {
        event.preventDefault();

        if (!isSaveEnabled) return;
        setIsSaveEnabled(false);

        const body = new PartnerRequestData();
        body.name = name ?? '';
        body.email = email ?? '';
        body.phone = phone ?? '';
        body.website = website ?? '';
        body.partnerRequestStatusId = Constants.PartnerRequestStatusSent;
        body.notes = notes ?? '';
        body.streetAddress = streetAddress ?? '';
        body.city = city ?? '';
        body.region = region ?? '';
        body.country = country ?? '';
        body.latitude = latitude ?? 0;
        body.longitude = longitude ?? 0;
        body.createdByUserId = props.currentUser.id;
        body.partnerTypeId = partnerTypeId;
        body.isBecomeAPartnerRequest = mode !== 'send';

        createPartnerRequest.mutateAsync(body).then((res) => {
            props.history.push('/');
        });
    }

    // This will handle Cancel button click event.
    function handleCancel(event: any) {
        event.preventDefault();
        props.history.push('/partnerships');
    }

    function handleNameChanged(val: string) {
        if (name === '') {
            setNameErrors('Name cannot be blank.');
        } else {
            setNameErrors('');
            setName(val);
        }
    }

    function handleEmailChanged(val: string) {
        const pattern = new RegExp(Constants.RegexEmail);

        if (!pattern.test(val)) {
            setEmailErrors('Please enter valid email address.');
        } else {
            setEmailErrors('');
            setEmail(val);
        }
    }

    function handleWebsiteChanged(val: string) {
        const pattern = new RegExp(Constants.RegexWebsite);

        if (!pattern.test(val)) {
            setWebsiteErrors('Please enter valid website.');
        } else {
            setWebsiteErrors('');
            setWebsite(val);
        }
    }

    function handlePhoneChanged(val: string) {
        const pattern = new RegExp(Constants.RegexPhoneNumber);

        if (!pattern.test(val)) {
            setPhoneErrors('Please enter a valid phone number.');
        } else {
            setPhoneErrors('');
            setPhone(val);
        }
    }

    function handleNotesChanged(val: string) {
        setNotes(val);
    }

    function renderNameToolTip(props: any) {
        return <Tooltip {...props}>{ToolTips.PartnerRequestName}</Tooltip>;
    }

    function renderPartnerTypeToolTip(props: any) {
        return <Tooltip {...props}>{ToolTips.PartnerType}</Tooltip>;
    }

    function renderEmailToolTip(props: any) {
        if (mode === 'send') {
            return <Tooltip {...props}>{ToolTips.PartnerRequestInviteEmail}</Tooltip>;
        }
        return <Tooltip {...props}>{ToolTips.PartnerRequestEmail}</Tooltip>;
    }

    function renderWebsiteToolTip(props: any) {
        return <Tooltip {...props}>{ToolTips.PartnerRequestWebsite}</Tooltip>;
    }

    function renderPhoneToolTip(props: any) {
        if (mode === 'send') {
            return <Tooltip {...props}>{ToolTips.PartnerRequestInvitePhone}</Tooltip>;
        }
        return <Tooltip {...props}>{ToolTips.PartnerRequestPhone}</Tooltip>;
    }

    function renderNotesToolTip(props: any) {
        if (mode === 'send') {
            return <Tooltip {...props}>{ToolTips.PartnerRequestInviteNotes}</Tooltip>;
        }
        return <Tooltip {...props}>{ToolTips.PartnerRequestNotes}</Tooltip>;
    }

    function setPartnerType(val: boolean) {
        if (val) {
            setPartnerTypeId(Constants.PartnerTypeGovernment);
        } else {
            setPartnerTypeId(Constants.PartnerTypeBusiness);
        }
    }

    async function handleLocationChange(point: data.Position) {
        setLatitude(point[1]);
        setLongitude(point[0]);
        const azureKey = await MapStore.getKey();
        azureMapSearchAddressReverse.mutateAsync({ azureKey, lat: point[1], long: point[0] }).then((res) => {
            setStreetAddress(res.data.addresses[0].address.streetNameAndNumber);
            setCity(res.data.addresses[0].address.municipality);
            setCountry(res.data.addresses[0].address.country);
            setRegion(res.data.addresses[0].address.countrySubdivisionName);
            setPostalCode(res.data.addresses[0].address.postalCode);
        });
    }

    function createFormDescriptionContent() {
        let content =
            'Use this form to send an informational note to a potential TrashMob.eco partner in your community. Fill out as much detail as you can and TrashMob.eco will reach out to the email address provided with an information packet to see if they would like to become a TrashMob.eco Partner!';
        const content1 =
            "If connecting with a government partner, the department responsible for managing waste and maintaining cleanliness in a community is often a part of the public works department, environmental services division, or a similar agency. You can find contact information for these organizations by searching online or by calling the city's main government phone number and asking for the appropriate department.";

        if (mode === 'request') {
            content = `Use this form to request to become a TrashMob.eco partner. TrashMob.eco site adminsitrators will 
            review your request, and either approve it, or reach out to you for more information. If approved, you will
            be sent a Welcome email with instructions on how to complete setup of your partnership.`;
        }

        return (
            <div className='content'>
                <p>{content}</p>
                <p>{content1}</p>
            </div>
        );
    }

    // Returns the HTML Form to the render() method.
    function renderCreateForm() {
        return (
            <Container className='py-5'>
                <div className='bg-white py-2 px-5 shadow-sm rounded'>
                    <h2 className='color-primary mt-4 mb-5'>{title}</h2>
                    {createFormDescriptionContent()}
                </div>
                <div className='bg-white p-5 shadow-sm rounded'>
                    <Form onSubmit={handleSave} className='mt-0 p-4'>
                        <Form.Row className='d-block d-md-flex'>
                            <Col>
                                <Form.Group className='required'>
                                    <OverlayTrigger placement='top' overlay={renderNameToolTip}>
                                        <Form.Label className='control-label h5'>Partner Name</Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control
                                        type='text'
                                        className='border-0 bg-light h-60 para'
                                        defaultValue={name}
                                        maxLength={parseInt('64')}
                                        onChange={(val) => handleNameChanged(val.target.value)}
                                        required
                                    />
                                    <span style={{ color: 'red' }}>{nameErrors}</span>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <OverlayTrigger placement='top' overlay={renderPartnerTypeToolTip}>
                                        <Form.Label className='control-label h5' htmlFor='PartnerType'>
                                            Type
                                        </Form.Label>
                                    </OverlayTrigger>
                                    <div className='d-flex h-60'>
                                        <div className='d-flex w-100 align-items-center'>
                                            <input
                                                type='radio'
                                                className='m-0'
                                                checked={isGovernmentPartner}
                                                name='type'
                                                onChange={() => setPartnerType(true)}
                                            />
                                            <label className='control-label m-0 ml-2'>Government</label>
                                        </div>
                                        <div className='d-flex w-100 align-items-center'>
                                            <input
                                                type='radio'
                                                className='m-0'
                                                name='type'
                                                onChange={() => setPartnerType(false)}
                                            />
                                            <label className='control-label m-0 ml-2'>Business</label>
                                        </div>
                                    </div>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row className='d-block d-md-flex'>
                            <Col>
                                <Form.Group className='required'>
                                    <OverlayTrigger placement='top' overlay={renderEmailToolTip}>
                                        <Form.Label className='control-label h5'>Email</Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control
                                        type='text'
                                        className='border-0 bg-light h-60 para'
                                        defaultValue={email}
                                        maxLength={parseInt('64')}
                                        onChange={(val) => handleEmailChanged(val.target.value)}
                                        required
                                    />
                                    <span style={{ color: 'red' }}>{emailErrors}</span>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <OverlayTrigger placement='top' overlay={renderWebsiteToolTip}>
                                        <Form.Label className='control-label h5'>Website</Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control
                                        type='text'
                                        className='border-0 bg-light h-60 para'
                                        defaultValue={website}
                                        maxLength={parseInt('1024')}
                                        onChange={(val) => handleWebsiteChanged(val.target.value)}
                                    />
                                    <span style={{ color: 'red' }}>{websiteErrors}</span>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <Form.Group>
                                    <OverlayTrigger placement='top' overlay={renderPhoneToolTip}>
                                        <Form.Label className='control-label h5'>Phone</Form.Label>
                                    </OverlayTrigger>
                                    <PhoneInput
                                        country='us'
                                        value={phone}
                                        onChange={(val) => handlePhoneChanged(val)}
                                    />
                                    <span style={{ color: 'red' }}>{phoneErrors}</span>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Group>
                            <OverlayTrigger placement='top' overlay={renderNotesToolTip}>
                                <Form.Label className='control-label h5'>Notes</Form.Label>
                            </OverlayTrigger>
                            <Form.Control
                                as='textarea'
                                className='border-0 bg-light h-60 para'
                                defaultValue={notes}
                                maxLength={parseInt('2048')}
                                rows={5}
                                cols={5}
                                onChange={(val) => handleNotesChanged(val.target.value)}
                            />
                        </Form.Group>

                        <Form.Row>
                            <div>
                                <Form.Label>Choose a location!</Form.Label>
                            </div>
                        </Form.Row>
                        <Form.Row>
                            <AzureMapsProvider>
                                <>
                                    <MapControllerSinglePointNoEvents
                                        center={center}
                                        mapOptions={mapOptions}
                                        isMapKeyLoaded={isMapKeyLoaded}
                                        latitude={latitude}
                                        longitude={longitude}
                                        onLocationChange={handleLocationChange}
                                        currentUser={props?.currentUser}
                                        isUserLoaded={props?.isUserLoaded}
                                        isDraggable
                                    />
                                </>
                            </AzureMapsProvider>
                        </Form.Row>

                        <Form.Row className='mt-4'>
                            <Col>
                                <Form.Group>
                                    <Form.Label className='control-label h5' htmlFor='StreetAddress'>
                                        Street Address
                                    </Form.Label>
                                    <Form.Control
                                        type='text'
                                        className='border-0 bg-light h-60 p-18'
                                        disabled
                                        name='streetAddress'
                                        value={streetAddress}
                                    />
                                </Form.Group>
                            </Col>
                        </Form.Row>

                        <Form.Row className='d-block d-md-flex'>
                            <Col>
                                <Form.Group>
                                    <Form.Label className='control-label h5' htmlFor='City'>
                                        City
                                    </Form.Label>
                                    <Form.Control
                                        type='text'
                                        className='border-0 bg-light h-60 p-18'
                                        disabled
                                        name='city'
                                        value={city}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label className='control-label h5' htmlFor='PostalCode'>
                                        Postal Code
                                    </Form.Label>
                                    <Form.Control
                                        type='text'
                                        className='border-0 bg-light h-60 p-18'
                                        disabled
                                        name='postalCode'
                                        value={postalCode}
                                    />
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Group className='d-flex justify-content-end'>
                            <Button
                                disabled={!isSaveEnabled}
                                type='submit'
                                className='action btn-default px-3 mr-3 h-49'
                            >
                                Submit
                            </Button>
                            <Button className='action' onClick={(e) => handleCancel(e)}>
                                Cancel
                            </Button>
                        </Form.Group>
                    </Form>
                </div>
            </Container>
        );
    }

    const contents = renderCreateForm();

    return <div>{contents}</div>;
};

export default withRouter(PartnerRequest);
