import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const center = {
    lat: -3.745,
    lng: -38.523
};

const GoogleMapComponent = ({
    location = center,
    zoom = 10,
    containerStyleProp = containerStyle
}) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY" // Replace with your API key
    });

    const [map, setMap] = React.useState(null);

    const onLoad = React.useCallback(function callback(map) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(location);
        map.fitBounds(bounds);

        setMap(map);
    }, [location]);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyleProp}
            center={location}
            zoom={zoom}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            { /* Child components, such as markers, info windows, etc. */}
            <Marker position={location} />
        </GoogleMap>
    ) : <div className="w-full h-[400px] bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">Loading Map...</div>;
};

export default React.memo(GoogleMapComponent);
