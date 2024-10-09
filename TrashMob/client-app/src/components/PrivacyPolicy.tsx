import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import logo from './assets/logo.svg';
import { HeroSection } from './Customization/HeroSection';

export const CurrentPrivacyPolicyVersion: PrivacyPolicyVersion = {
    versionId: '0.3',
    versionDate: new Date(2021, 5, 14, 0, 0, 0, 0),
};

export class PrivacyPolicyVersion {
    versionId: string = '0.3';

    versionDate: Date = new Date(2021, 5, 14, 0, 0, 0, 0);
}

// Note: this policy was generated by https://www.privacypolicygenerator.info/download.php?lang=en&token=IAx2sl4Q8Mslvuhn4tk2KRTSLHKa8LdG#
export const PrivacyPolicy: React.FC = () => {
    React.useEffect(() => {
        window.scrollTo(0, 0);
    });

    return (
        <>
            <HeroSection Title='Privacy policy' Description='Making your privacy a priority.' />
            <div className='container my-5'>
                <h2 className='fw-500 font-size-xl'>Privacy Policy for TrashMob</h2>

                <p className='p-18'>
                    At TrashMob, accessible from www.trashmob.eco, one of our main priorities is the privacy of our
                    visitors. This Privacy Policy document contains types of information that is collected and recorded
                    by TrashMob and how we use it.
                </p>

                <p className='p-18'>
                    If you have additional questions or require more information about our Privacy Policy, do not
                    hesitate to contact us.
                </p>

                <p className='p-18'>
                    This Privacy Policy applies only to our online activities and is valid for visitors to our website
                    with regards to the information that they shared and/or collect in TrashMob. This policy is not
                    applicable to any information collected offline or via channels other than this website. Our Privacy
                    Policy was created with the help of the{' '}
                    <a href='https://www.privacypolicygenerator.org/'>Free Privacy Policy Generator</a>.
                </p>

                <h2 className='fw-500 font-size-xl'>Consent</h2>

                <p className='p-18'>
                    By using our website, you hereby consent to our Privacy Policy and agree to its terms.
                </p>

                <h2 className='fw-500 font-size-xl'>Information we collect</h2>

                <p className='p-18'>
                    The personal information that you are asked to provide, and the reasons why you are asked to provide
                    it, will be made clear to you at the point we ask you to provide your personal information.
                </p>
                <p className='p-18'>
                    If you contact us directly, we may receive additional information about you such as your name, email
                    address, phone number, the contents of the message and/or attachments you may send us, and any other
                    information you may choose to provide.
                </p>
                <p className='p-18'>
                    We may collect precise location information from your device when you use the App. This may include GPS coordinates and other location-based data.
                </p>
                <p className='p-18'>
                    When you register for an Account, we may ask for your contact information, including items such as
                    name, company name, address, email address, and telephone number.
                </p>

                <h2 className='fw-500 font-size-xl'>How we use your information</h2>

                <p className='p-18'>We use the information we collect in various ways, including to:</p>

                <ul>
                    <li>Provide, operate, and maintain our website and mobile app</li>
                    <li>Provide anonymized reports of what areas have been cleaned up, and where bagged garbage has been left for pickup</li>
                    <li>Improve, personalize, and expand our website and mobile app</li>
                    <li>Understand and analyze how you use our website and mobile app</li>
                    <li>Develop new products, services, features, and functionality</li>
                    <li>
                        Communicate with you, either directly or through one of our partners, including for customer
                        service, to provide you with updates and other information relating to the website, and for
                        marketing and promotional purposes
                    </li>
                    <li>Send you emails</li>
                    <li>Find and prevent fraud</li>
                </ul>

                <h2 className='fw-500 font-size-xl'>Log Files</h2>

                <p className='p-18'>
                    TrashMob follows a standard procedure of using log files. These files log visitors when they visit
                    websites. All hosting companies do this and a part of hosting services' analytics. The information
                    collected by log files include internet protocol (IP) addresses, browser type, Internet Service
                    Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These
                    are not linked to any information that is personally identifiable. The purpose of the information is
                    for analyzing trends, administering the site, tracking users' movement on the website, and gathering
                    demographic information.
                </p>

                <h2 className='fw-500 font-size-xl'>Advertising Partners Privacy Policies</h2>

                <p className='p-18'>
                    You may consult this list to find the Privacy Policy for each of the advertising partners of
                    TrashMob.
                </p>

                <p className='p-18'>
                    Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons
                    that are used in their respective advertisements and links that appear on TrashMob, which are sent
                    directly to users' browser. They automatically receive your IP address when this occurs. These
                    technologies are used to measure the effectiveness of their advertising campaigns and/or to
                    personalize the advertising content that you see on websites that you visit.
                </p>

                <p className='p-18'>
                    Note that TrashMob has no access to or control over these cookies that are used by third-party
                    advertisers.
                </p>

                <h2 className='fw-500 font-size-xl'>Third Party Privacy Policies</h2>

                <p className='p-18'>
                    TrashMob's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you
                    to consult the respective Privacy Policies of these third-party ad servers for more detailed
                    information. It may include their practices and instructions about how to opt-out of certain
                    options.{' '}
                </p>

                <p className='p-18'>
                    You can choose to disable cookies through your individual browser options. To know more detailed
                    information about cookie management with specific web browsers, it can be found at the browsers'
                    respective websites.
                </p>

                <h2 className='fw-500 font-size-xl'>CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>

                <p className='p-18'>Under the CCPA, among other rights, California consumers have the right to:</p>
                <p className='p-18'>
                    Request that a business that collects a consumer's personal data disclose the categories and
                    specific pieces of personal data that a business has collected about consumers.
                </p>
                <p className='p-18'>
                    Request that a business delete any personal data about the consumer that a business has collected.
                </p>
                <p className='p-18'>
                    Request that a business that sells a consumer's personal data, not sell the consumer's personal
                    data.
                </p>
                <p className='p-18'>
                    If you make a request, we have one month to respond to you. If you would like to exercise any of
                    these rights, please contact us.
                </p>

                <h2 className='fw-500 font-size-xl'>GDPR Data Protection Rights</h2>

                <p className='p-18'>
                    We would like to make sure you are fully aware of all of your data protection rights. Every user is
                    entitled to the following:
                </p>
                <p className='p-18'>
                    The right to access – You have the right to request copies of your personal data. We may charge you
                    a small fee for this service.
                </p>
                <p className='p-18'>
                    The right to rectification – You have the right to request that we correct any information you
                    believe is inaccurate. You also have the right to request that we complete the information you
                    believe is incomplete.
                </p>
                <p className='p-18'>
                    The right to erasure – You have the right to request that we erase your personal data, under certain
                    conditions.
                </p>
                <p className='p-18'>
                    The right to restrict processing – You have the right to request that we restrict the processing of
                    your personal data, under certain conditions.
                </p>
                <p className='p-18'>
                    The right to object to processing – You have the right to object to our processing of your personal
                    data, under certain conditions.
                </p>
                <p className='p-18'>
                    The right to data portability – You have the right to request that we transfer the data that we have
                    collected to another organization, or directly to you, under certain conditions.
                </p>
                <p className='p-18'>
                    If you make a request, we have one month to respond to you. If you would like to exercise any of
                    these rights, please contact us.
                </p>

                <h2 className='fw-500 font-size-xl'>Children's Information</h2>

                <p className='p-18'>
                    Another part of our priority is adding protection for children while using the internet. We
                    encourage parents and guardians to observe, participate in, and/or monitor and guide their online
                    activity.
                </p>

                <p className='p-18'>
                    TrashMob does not knowingly collect any Personal Identifiable Information from children under the
                    age of 13. If you think that your child provided this kind of information on our website, we
                    strongly encourage you to contact us immediately and we will do our best efforts to promptly remove
                    such information from our records.
                </p>
                <br />
                <p className='p-18'>The team at TrashMob.eco.</p>
                <Row className='mb-5'>
                    <Col lg={3} sm={6} md={4} xs={6} className='p-0'>
                        <img src={logo} className='p-0 m-0 pl-2 mb-5' alt='TrashMob Logo' id='logo' />
                    </Col>
                </Row>
            </div>
        </>
    );
};
