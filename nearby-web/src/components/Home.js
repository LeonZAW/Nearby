import React from 'react';
import { Tabs, Spin, Row, Col, Radio } from 'antd';
import $ from 'jquery';
import { GEO_OPTIONS, GEO_KEY, API_ROOT, AUTH_PREFIX, TOKEN_KEY } from "../constants";
import { Gallery} from "./Gallery";
import { ModalButton } from "./Modal"
import { WrappedNearbyMap } from './NearbyMap.js';

export class Home extends React.Component {

    state = {
        loadingGeoLocation: false,
        loadingPosts: false,
        error: '',
        posts: [],
        topic: "nearby"
    }

    componentDidMount(){
        this.setState({loadingGeoLocation: true, error: ''});
        this.getGeolocation();
    }

    getGeolocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeolocation,
                this.onFailedLoadGeolocation,
                GEO_OPTIONS,
            );
        } else {
            this.setState({error: 'Geolocation is Not supported in this browser '});
        }
    }

    onSuccessLoadGeolocation = (position) => {
        console.log(position);
        this.setState({ loadingGeoLocation: false, error: ''});
        const { latitude, longitude} = position.coords;
        localStorage.setItem(GEO_KEY, JSON.stringify({lat: latitude, lon: longitude}));
        this.loadNearbyPosts();
    }

    onFailedLoadGeolocation = () => {
        this.setState({ loadingGeoLocation: false, error: 'Failed to load geolocation'});
    }

    getGalleryContent = type => {
        if (this.state.error) {
            return <div>{this.state.error}</div>;
        } else if (this.state.loadingGeoLocation) {
            return <Spin tip="Loading geolocation..."/>;
        } else if (this.state.loadingPosts){
            return <Spin tip="Loading posts..."/>;
        } else if (this.state.posts && this.state.posts.length > 0) {
            return type === "image"
                ? this.getImagePosts()
                : this.getVideoPosts();
        } else {
            return "No nearby posts";
        } 
    }

    getImagePosts = () => {
        const images = this.state.posts
            .filter(post => post.type === "image")
            .map(post => {
                return {
                    user: post.user,
                    src: post.url,
                    thumbnail: post.url,
                    thumbnailWidth: 400,
                    thumbnailHeight: 300,
                    caption: post.message,
                }
            });
        return <Gallery images={images}/>
    }

    getVideoPosts = () => {
        const videos = this.state.posts.filter(post => post.type === "video");
        return (
            <Row gutter={32}>
                {videos.map(video => (
                    <Col span={6} key={video.url}>
                        {/* must have "controls" prop or there will be no play button on video */}
                        <video
                            src={video.url}
                            controls
                            className="video-block"
                        />
                        <p>{`${video.user}:${video.message}`}</p>
                    </Col>
                ))}
            </Row>
        );
    }

    onTopicChange = e => {
        const topic = e.target.value;
        this.setState({ topic });
        if (topic === "nearby") {
            this.loadNearbyPosts();
        } else {
            this.loadFacesNearby();
        }
    }

    loadFacesNearby = () => {
        this.setState({ isLoadingPosts: true, error: "" });
        $.ajax({
            url: `${API_ROOT}/cluster?term=face`,
            method: 'GET',
            headers: {
                Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`,
            },
        }).then((response)=>{
            console.log(response);
            this.setState({posts: response, loadingPosts: false, error:''});
        }, (error)=>{
            this.setState({loadingPosts: false, error: error.responseText});
            console.log(error);
        }).catch((error)=>{
            console.log(error);
        });
    }


    loadNearbyPosts = (location, radius) => {
        // this.setState({loadingPosts: true, error:''});
        //parse the string and use destructor to get lat and lon
        const { lat, lon } = location ? location: JSON.parse(localStorage.getItem(GEO_KEY));
        const range  = radius ? radius : 20;
        this.setState({ loadingPosts: true, error: ''});
        return $.ajax({
            url: `${API_ROOT}/search?lat=${lat}&lon=${lon}&range=${range}`,
            method: 'GET',
            headers: {
                Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`,
            },
        }).then((response)=>{
            console.log(response);
            this.setState({posts: response, loadingPosts: false, error:''});
        }, (error)=>{
            this.setState({loadingPosts: false, error: error.responseText});
            console.log(error);
        }).catch((error)=>{
            console.log(error);
        });
    }

    render() {
        const modalButton = <ModalButton loadNearbyPosts={this.loadNearbyPosts}/>
        return (
            <div className="home">
                <Radio.Group
                    className="topic-radio-group"
                    value={this.state.topic}
                    onChange={this.onTopicChange}
                >
                    <Radio value="nearby">Nearby Posts</Radio>
                    <Radio value="face">Nearby Faces</Radio>
                </Radio.Group>

                <Tabs tabBarExtraContent={modalButton} className="main-tabs">
                    <Tabs.TabPane tab="Image Posts" key="1">
                        {this.getGalleryContent("image")}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Video Posts" key="2">
                        {this.getGalleryContent("video")}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Map" key="3">
                        <WrappedNearbyMap
                            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCQSxp3piVNzgNKhZNosTC1fPMuB6WFgfs&v=3.exp&libraries=geometry,drawing,places"
                            loadingElement={<div style={{ height: `100%` }} />}
                            containerElement={<div style={{ height: `800px` }} />}
                            mapElement={<div style={{ height: `100%` }} />}
                            posts={this.state.posts}
                            loadNearbyPosts={this.loadNearbyPosts}
                            loadFacesNearby={this.loadFacesNearby}
                            topic={this.state.topic}
                        />
                    </Tabs.TabPane>
                </Tabs>
            </div>
        )
    }
}