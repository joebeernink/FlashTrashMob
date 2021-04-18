﻿import { useEffect, useState } from 'react';
import * as React from 'react';
import { AzureMap, AzureMapDataSourceProvider, AzureMapFeature, AzureMapLayerProvider, AzureMapsProvider, IAzureDataSourceChildren, IAzureMapFeature, IAzureMapLayerType, IAzureMapOptions } from 'react-azure-maps'
import { data, SymbolLayerOptions } from 'azure-maps-control';
import EventData from './Models/EventData';
import * as MapStore from '../store/MapStore'

const renderPoint = (coordinates: data.Position): IAzureMapFeature => {
    const rendId = Math.random();

    return (
        <AzureMapFeature
            key={rendId}
            id={rendId.toString()}
            type="Point"
            coordinate={coordinates}
            properties={{
                title: 'Pin',
                icon: 'pin-round-blue',
                
            }}
        />
    );
};

export interface SingleEventMapDataState {
    eventName: string;
    latitude: number;
    longitude: number;
    loading: boolean;
    onLocationChange: any;
}

const SingleEventMap: React.FC<SingleEventMapDataState> = (props) => {
    const [marker, setMarker] = useState<data.Position>();
    const [markersLayer] = useState<IAzureMapLayerType>('SymbolLayer');
    const [layerOptions, setLayerOptions] = useState<SymbolLayerOptions>(MapStore.memoizedOptions);
    const [isKeyLoaded, setIsKeyLoaded] = useState(false);

    // componentDidMount()
    useEffect(() => {
        // simulate fetching subscriptionKey from Key Vault
        async function GetMap() {
            MapStore.option.authOptions = await MapStore.getOption()
            setIsKeyLoaded(true);            
        } 

        GetMap();
    }, []);

    useEffect(() => {
        if (!props.loading) {
            const mark = new data.Position(props.latitude, props.longitude);
            setMarker(mark);
        }
    }, [props.loading, props.latitude, props.longitude])


    const memoizedMarkerRender: IAzureDataSourceChildren = React.useMemo(
        (): any => renderPoint(marker),
        [marker],
    );

    function getCoordinates(e: any) {
        console.log('Clicked on:', e.position);
        props.onLocationChange(e.position);
    }

    // render()
    return (
        <>
            <AzureMapsProvider>
                <div style={styles.map}>
                    {!isKeyLoaded && <div>Map is loading.</div>}
                    {isKeyLoaded && <AzureMap options={MapStore.option} events={{ click: getCoordinates }}>
                        <AzureMapDataSourceProvider
                            events={{
                                dataadded: (e: any) => {
                                    console.log('Data on source added', e);
                                },
                            }}
                            id={'markersExample AzureMapDataSourceProvider'}
                            options={{ cluster: true, clusterRadius: 2 }}
                        >
                            <AzureMapLayerProvider
                                id={'markersExample AzureMapLayerProvider'}
                                options={layerOptions}
                                lifecycleEvents={{
                                    layeradded: () => {
                                        console.log('LAYER ADDED TO MAP');
                                    },
                                }}
                                type={markersLayer}                               
                            />
                            {memoizedMarkerRender}
                        </AzureMapDataSourceProvider>
                    </AzureMap>}
                </div>
            </AzureMapsProvider>
        </>
    );
}

const styles = {
    map: {
        height: 300,
    },
};

export default SingleEventMap
