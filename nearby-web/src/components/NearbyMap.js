import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";

import { GEO_KEY } from '../constants.js';
import { NearbyMarker } from './NearbyMarker';

class NearbyMap extends React.Component {
    reloadMarkers = () => {
        const center = this.map.getCenter();
        const location = {lat: center.lat(), lon: center.lng()};
        const range = this.getRange();
        this.props.loadNearbyPosts(location, range);
    }
    getMapRef = (map) => {
        this.map = map;
        window.map = map;
    }
    getRange = () => {
        const google = window.google;
        const center = this.map.getCenter();
        const bounds = this.map.getBounds();
        if (center && bounds) {
            const ne = bounds.getNorthEast();
            const right = new google.maps.LatLng(center.lat(), ne.lng());
            return 0.000621371192 * google.maps.geometry.spherical.computeDistanceBetween(center, right);
        }
    }

    render() {
        const {lat, lon} = JSON.parse(localStorage.getItem(GEO_KEY));
        return (
            <GoogleMap
                onDragEnd={this.reloadMarkers}
                onZoomChanged={this.reloadMarkers}
                ref={this.getMapRef}
                defaultZoom={11}
                defaultCenter={{lat: lat, lng: lon}}
            >
            {
                this.props.posts ? this.props.posts.map((post) =>
                    <NearbyMarker post={post} key={post.url}/>
                ) : null
            }
            </GoogleMap>
        );
    }
}
export const WrappedNearbyMap = withScriptjs(withGoogleMap(NearbyMap)); 