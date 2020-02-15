import React from 'react';
import { Marker, InfoWindow} from 'react-google-maps';
import BlueMarker from "../images/blue-marker.svg";

export class NearbyMarker extends React.Component {

    state = {
        isOpen: false,
    }
    onToggleOpen = () => {
        this.setState((prevState) => ({ isOpen: !prevState.isOpen}));
    }
    render() {
        const post = this.props.post;
        const { type, location, user, message, url } = post;
        const { lat, lon } = location;
        const isImage = type === "image";
        const icon = isImage
            ? undefined
            : {
                  url: BlueMarker,
                  scaledSize: new window.google.maps.Size(26, 41)
              };
        return (
            <Marker
                position={{lat: lat, lng : lon}}
                onMouseOver={isImage ? this.onToggleOpen : undefined}
                onMouseOut={isImage ? this.onToggleOpen : undefined}
                onClick={isImage ? undefined : this.onToggleOpen}
                icon={icon}
            >
                {this.state.isOpen ?
                    <InfoWindow onCloseClick={this.onToggleOpen}>
                        <div>
                        {isImage ? (
                                <img
                                    className="nearby-marker-image"
                                    src={url}
                                    alt={message}
                                />
                            ) : (
                                <video
                                    className="nearby-marker-video"
                                    src={url}
                                    alt={message}
                                    controls
                                />
                            )}
                            <p>{`${user}: ${message}`}</p>
                        </div>
                    </InfoWindow> : null}
            </Marker>
        )
    }

} 