import { Map, MapProps } from '@vis.gl/react-google-maps'
import { PropsWithChildren } from 'react'
import * as MapStore from '../../../store/MapStore';
import { useGetDefaultMapCenter } from '../../../hooks/useGetDefaultMapCenter';

export const GoogleMap = (props: PropsWithChildren<MapProps>) => {
	const defaultCenter = useGetDefaultMapCenter()
	return (
		<Map
			mapId='6f295631d841c617'
			gestureHandling='greedy'
			disableDefaultUI
			style={{ width: '100%', height: '500px' }}
			defaultZoom={MapStore.defaultUserLocationZoom}
			defaultCenter={defaultCenter}
			{...props}
		>
			{props.children}
		</Map>
	)
}