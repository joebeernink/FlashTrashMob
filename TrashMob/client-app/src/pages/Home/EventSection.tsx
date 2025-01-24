import { Link } from 'react-router';
import * as MapStore from '@/store/MapStore';
import { AzureSearchLocationInput, SearchLocationOption } from '@/components/Map/AzureSearchLocationInput';
import { EventsMap } from '@/components/Map';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetGoogleMapApiKey } from '@/hooks/useGetGoogleMapApiKey';
import { APIProvider, useMap } from '@vis.gl/react-google-maps';
import { useCallback, useEffect, useState } from 'react';
import UserData from '@/components/Models/UserData';
import { useQuery } from '@tanstack/react-query';
import { GetFilteredEvents, GetFilteredEvents_Params } from '@/services/events';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItemAlt, SelectTrigger, SelectValue } from '@/components/ui/select';
import { List, Map, Plus, Pencil } from 'lucide-react';
import moment from 'moment';
import { useGetDefaultMapCenter } from '@/hooks/useGetDefaultMapCenter';
import { AzureMapSearchAddressReverse } from '@/services/maps';
import { GetAllEventsBeingAttendedByUser } from '@/services/events';

import { EventList } from '@/components/events/event-list';
import toNumber from 'lodash/toNumber';

interface EventSectionProps {
    isUserLoaded: boolean;
    currentUser: UserData;
}

enum EventStatus {
    UPCOMING = 'upcoming',
    COMPLETED = 'completed',
}

/** Event List */
const useGetFilteredEvents = (params: GetFilteredEvents_Params) => {
    return useQuery({
        queryKey: GetFilteredEvents(params).key,
        queryFn: GetFilteredEvents(params).service,
        select: (res) => res.data || [],
    });
};

export const EventSectionComponent = (props: EventSectionProps) => {
    const { isUserLoaded, currentUser } = props;
    const now = moment();
    const map = useMap();
    const defaultMapCenter = useGetDefaultMapCenter();

    const [azureSubscriptionKey, setAzureSubscriptionKey] = useState<string>('');
    useEffect(() => {
        MapStore.getOption().then((opts) => {
            setAzureSubscriptionKey(opts.subscriptionKey);
        });
    });

    /** Statuses */
    const statuses = [
        { value: EventStatus.UPCOMING, label: 'Upcoming' },
        { value: EventStatus.COMPLETED, label: 'Completed' },
    ];

    /** Filter Parameters */
    const [selectedStatuses, setSelectedStatuses] = useState<string>(EventStatus.UPCOMING);
    const [selectedTimeRange, setSelectedTimeRange] = useState<string>(
        `${now.format('YYYY-MM-DD')}|${now.clone().format('YYYY-MM-DD')}`,
    );
    const [selectedLocation, setSelectedLocation] = useState<SearchLocationOption>();
    const [view, setView] = useState<string>('map');

    /** Time Ranges */
    const timeRangeOptions =
        selectedStatuses === EventStatus.UPCOMING
            ? [
                  { value: `${now.format('YYYY-MM-DD')}|${now.format('YYYY-MM-DD')}`, label: 'Today' },
                  {
                      value: `${now.clone().add(1, 'd').format('YYYY-MM-DD')}|${now.clone().add(1, 'd').format('YYYY-MM-DD')}`,
                      label: 'Tomorrow',
                  },
                  {
                      value: `${now.clone().endOf('week').format('YYYY-MM-DD')}|${now.clone().endOf('week').add(1, 'd').format('YYYY-MM-DD')}`,
                      label: 'This weekend',
                  },
                  {
                      value: `${now.format('YYYY-MM-DD')}|${now.clone().add(10, 'y').format('YYYY-MM-DD')}`,
                      label: 'All',
                  },
              ]
            : [
                  {
                      value: `${now.clone().subtract(7, 'd').format('YYYY-MM-DD')}|${now.format('YYYY-MM-DD')}`,
                      label: 'Last 7 days',
                  },
                  {
                      value: `${now.clone().subtract(30, 'd').format('YYYY-MM-DD')}|${now.format('YYYY-MM-DD')}`,
                      label: 'Last 30 days',
                  },
                  {
                      value: `${now.clone().subtract(90, 'd').format('YYYY-MM-DD')}|${now.format('YYYY-MM-DD')}`,
                      label: 'Last 90 days',
                  },
                  {
                      value: `${now.clone().subtract(6, 'M').format('YYYY-MM-DD')}|${now.format('YYYY-MM-DD')}`,
                      label: 'Last 6 months',
                  },
                  {
                      value: `${now.clone().subtract(12, 'M').format('YYYY-MM-DD')}|${now.format('YYYY-MM-DD')}`,
                      label: 'Last 12 months',
                  },
                  {
                      value: `${now.clone().subtract(10, 'y').format('YYYY-MM-DD')}|${now.format('YYYY-MM-DD')}`,
                      label: 'All time',
                  },
              ];

    /** Event List */
    const [startDate, endDate] = selectedTimeRange.split('|');
    const { data: events } = useGetFilteredEvents({ startDate, endDate, city: selectedLocation?.address.municipality });

    // Load and add user's attendance to events
    const { data: myAttendanceList } = useQuery({
        queryKey: GetAllEventsBeingAttendedByUser({ userId: currentUser.id }).key,
        queryFn: GetAllEventsBeingAttendedByUser({ userId: currentUser.id }).service,
        select: (res) => res.data,
    });

    const eventsWithAttendance = (events || []).map((event) => {
        const isAttending: boolean = (myAttendanceList || []).some((ev) => ev.id === event.id);
        return { ...event, isAttending };
    });

    /**
     * Side Effect
     */
    // Side Effect 1: Reverse Search City from lat,lng
    useEffect(() => {
        if (!azureSubscriptionKey) return;

        AzureMapSearchAddressReverse()
            .service({
                azureKey: azureSubscriptionKey,
                lat: defaultMapCenter.lat,
                long: defaultMapCenter.lng,
            })
            .then((response) => {
                const result = response.data.addresses[0];
                const [lat, lon] = result.position.split(',').map(toNumber);
                const location = {
                    id: result.id,
                    displayAddress: result.address.freeformAddress,
                    address: result.address,
                    position: { lat, lon },
                };
                setSelectedLocation(location);
            });
    }, [defaultMapCenter, azureSubscriptionKey]);

    // Side Effect 2: When eventStatus change, set timeRangeOption accordingly
    useEffect(() => {
        const timeRange = timeRangeOptions.find((tro) => tro.value === selectedTimeRange);
        if (!timeRange) {
            setSelectedTimeRange(timeRangeOptions[0].value);
        }
    }, [timeRangeOptions, selectedStatuses]);

    /**
     * Events
     */
    const handleSelectSearchLocation = useCallback(
        async (location: SearchLocationOption) => {
            setSelectedLocation(location);
            const { lat, lon: lng } = location.position;
            if (map) map.panTo({ lat, lng });
        },
        [map],
    );

    return (
        <section id='event-section' className='bg-[#FCFBF8]'>
            <div className='container !py-20'>
                <div className='flex flex-col gap-2'>
                    <div className='flex flex-col md:flex-row items-center gap-4 relative'>
                        <h3 className='my-0 font-semibold'>Events near</h3>
                        <div className='relative z-10 h-[60px]'>
                            <AzureSearchLocationInput
                                azureKey={azureSubscriptionKey}
                                entityType={['Municipality']}
                                placeholder={selectedLocation ? selectedLocation.address.municipality : 'Location ...'}
                                className='!rounded-none !border-none !shadow-none !bg-transparent'
                                listClassName='!rounded-lg border md:min-w-[200px] relative shadow-md bg-card !mt-2'
                                renderInput={(inputProps) => (
                                    <div className='w-fit flex flex-row items-center'>
                                        <input
                                            type='text'
                                            {...inputProps}
                                            className='w-72 text-primary placeholder:text-[rgba(150,186,0,0.5)] font-semibold text-4xl mb-0 !py-2 border-b-4 border-primary bg-[#FCFBF8] outline-none'
                                        />
                                        <Pencil className='!w-8 !h-8 text-white fill-[#96BA00]' />
                                    </div>
                                )}
                                onSelectLocation={handleSelectSearchLocation}
                            />
                        </div>
                        <div className='grow flex justify-end'>
                            <Button asChild className='md:flex'>
                                <Link to='/manageeventdashboard'>
                                    <Plus /> Create Event
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div className='py-4'>
                        <Tabs
                            defaultValue={selectedStatuses}
                            onValueChange={setSelectedStatuses}
                            className='w-full rounded-none bg-transparent p-0'
                        >
                            <TabsList className='bg-transparent gap-2 w-full justify-center md:w-auto md:justify-start '>
                                {statuses.map((status) => (
                                    <TabsTrigger
                                        key={status.value}
                                        value={status.value}
                                        className={cn(
                                            'relative !px-2 h-9 rounded-[2px] border-b-2 border-b-transparent bg-transparent font-semibold text-muted-foreground shadow-none transition-none',
                                            "after:content-[''] after:w-0 after:h-0.5 after:absolute after:left-0 after:-bottom-3",
                                            'after:data-[state=active]:bg-[#005B4C] after:data-[state=active]:w-full',
                                            'data-[state=active]:!bg-[#B0CCC8] data-[state=active]:text-foreground',
                                            'transition-all duration-300 ease-in-out',
                                            'after:transition-all after:duration-300 after:ease-in-out',
                                        )}
                                    >
                                        {status.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    </div>
                    <div className='flex flex-row gap-4 mb-2'>
                        <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                            <SelectTrigger className='w-48'>
                                <SelectValue placeholder='Time' />
                            </SelectTrigger>
                            <SelectContent>
                                {timeRangeOptions.map((timeRange) => (
                                    <SelectItemAlt key={timeRange.value} value={timeRange.value}>
                                        {timeRange.label}
                                    </SelectItemAlt>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className='flex-1' />
                        <ToggleGroup value={view} onValueChange={setView} type='single' variant='outline'>
                            <ToggleGroupItem
                                value='list'
                                className='data-[state=on]:!bg-[#96BA00] data-[state=on]:text-primary-foreground'
                            >
                                <List />
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value='map'
                                className='data-[state=on]:!bg-[#96BA00] data-[state=on]:text-primary-foreground'
                            >
                                <Map />
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                    <div>
                        {(eventsWithAttendance || []).length} events found in{' '}
                        {selectedLocation?.address.municipality || 'your area'}
                    </div>
                    {view === 'map' ? (
                        <EventsMap
                            events={eventsWithAttendance || []}
                            isUserLoaded={isUserLoaded}
                            currentUser={currentUser}
                            gestureHandling='greedy'
                            defaultCenter={
                                selectedLocation
                                    ? { lat: selectedLocation.position.lat, lng: selectedLocation.position.lon }
                                    : undefined
                            }
                            defaultZoom={13}
                        />
                    ) : (
                        <EventList
                            events={eventsWithAttendance || []}
                            isUserLoaded={isUserLoaded}
                            currentUser={currentUser}
                        />
                    )}
                </div>
            </div>
        </section>
    );
};

export const EventSection = (props: EventSectionProps) => {
    const { data: googleApiKey, isLoading } = useGetGoogleMapApiKey();

    if (isLoading) return null;

    return (
        <APIProvider apiKey={googleApiKey || ''}>
            <EventSectionComponent {...props} />
        </APIProvider>
    );
};
