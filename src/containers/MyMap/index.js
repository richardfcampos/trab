import React, { useState, useEffect } from 'react'
import Locations from '../../dataExamples/cargoData'
import { compose, withProps, lifecycle, withHandlers } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, OverlayView } from "react-google-maps"
import CustomMarker from '../../components/Marker/'
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer"
import logo from '../../assets/img/cluster.png'

const Markers = (props) => {
    const [ visibility, setVisibility ] = useState({})

    let iconMarker = new window.google.maps.MarkerImage(
        "https://www.iconninja.com/files/902/911/830/dot-icon.png",
        null, /* size is determined at runtime */
        null, /* origin is 0,0 */
        new window.google.maps.Point(4, 4), /* anchor is bottom center of the scaled image */
        new window.google.maps.Size(8, 8)
    );
    return Locations.map((location, key) => {
        const position1 = new window.google.maps.LatLng(location.latlong.lat, location.latlong.lng)
        const position2 = new window.google.maps.LatLng(location.destiny.lat, location.destiny.lng)

        const getPixelPositionOffset = (width, height) => ({
            x: -(width / 2),
            y: -(height / 2),
        })

        const showCustomMarker = props.cluster.length === 0 || props.cluster.filter(clust => {
            return (
                clust.lat.toFixed(6) !== location.latlong.lat.toFixed(6)
                && clust.lng.toFixed(6) !== location.latlong.lng.toFixed(6)
            );
        }).length === props.cluster.length

        return (
            <div key={`${key}-p`}>
                <OverlayView
                    key={Math.random()}
                    position={{ lat: location.latlong.lat, lng: location.latlong.lng }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET || null}
                    getPixelPositionOffset={getPixelPositionOffset}
                >
                    <CustomMarker
                        key={`${key}-cm`}
                        id={location.id}
                        cargoState={location.state}
                        color="blue"
                        transport={location.type}
                        show={showCustomMarker}
                        onMouseEnter={() => {
                            setVisibility({
                                ...visibility,
                                [key]: true
                            })
                        }}
                        onMouseLeave={() => {
                            setVisibility({
                                ...visibility,
                                [key]: false
                            })
                        }}
                    />


                </OverlayView>
                {
                    visibility[key] && (
                        <React.Fragment>
                            <Marker position={position1} icon={iconMarker} />
                            <DestinationMarker position={position2} />
                            <CurveMarker
                                pos1={position1}
                                pos2={position2}
                                mapProjection={props.mapProjection}
                                zoom={props.zoom}
                            />
                        </React.Fragment>
                    )
                }
            </div>
        )
    })
}

const MyMap = compose(
    withProps({
        googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_KEY}&v=3.exp&libraries=geometry,drawing,places`,
        loadingElement: <div style={{ height: `100%`}} />,
        containerElement: <div style={{ flex: 1, height: `100%`, marginLeft:'50px', marginRight:'50px', marginTop:'-50px', marginBottom:'-50px' }} />,
        mapElement: <div style={{ flex: 1, height: `65%`}} />
    }),
    withHandlers({
        onMarkerClustererClick: () => (markerClusterer) => {
            markerClusterer.getMarkers()
        },
        onClusteringBegin: () => async (props, markerClusterer) =>  {
            let clust = [];
            const clusters = await markerClusterer.getClusters()
            await clusters.filter( async (cluster, index) => {
                const clustr = await cluster.getMarkers()
                if (clustr && clustr.length > 1){
                    clustr.map(val => {
                        const { position } = val
                        clust.push({lat: position.lat(), lng:position.lng()})
                        return true
                    })
                }
            })
            props.setCluster(clust)

        },
    }),

    lifecycle({
        componentWillMount() {
            const refs = {};

            this.setState({
                mapProjection: null,
                zoom: 11,
                center: {
                    lat: 0,
                    lng: 0
                },
                cluster: [],
                setCluster: (value) => {
                    if (JSON.stringify(this.state.cluster) !== JSON.stringify(value)) {
                        this.setState({ cluster: value });
                    }
                },
                fitBounds: () => {
                    const bounds = new window.google.maps.LatLngBounds();
                    Locations.map(location => {
                        bounds.extend(location.latlong);
                        bounds.extend(location.latlong);
                        return location.id;
                    });
                    refs.map.fitBounds(bounds);

                },
                onMapMounted: ref => {
                    refs.map = ref;
                    this.state.fitBounds()
                },
                projectionChanged: () => {
                    this.setState({
                        mapProjection: refs.map.getProjection()
                    });
                },
                onZoomChanged: () => {
                    this.setState({
                        zoom: refs.map.getZoom()
                    });
                },
                setCenter: (value) => {
                    this.setState({
                        center: refs.map.getCenter().toJSON()
                    })
                }
            });
        }
    }),
    withScriptjs,
    withGoogleMap
)(props => (
    <GoogleMap
        center={props.center}
        ref={props.onMapMounted}
        onProjectionChanged={props.projectionChanged}
        zoom={props.zoom}
        onZoomChanged={props.onZoomChanged}
        onCenterChanged={props.setCenter}
    >

        <Markers
            mapProjection={props.mapProjection}
            zoom={props.zoom}
            cluster={props.cluster}
        />


        <MarkerClusterer

            onClick={props.onMarkerClustererClick}
            averageCenter
            enableRetinaIcons
            gridSize={50}
            onClusteringBegin={markerClusterer => props.onClusteringBegin(props, markerClusterer) }
            styles={[{
                height: 31,
                width: 75,
                left: 21,
                url: logo,
            }]}
        >
            {Locations.map((marker, key) => (
                <Marker
                    key={`${key}-m`}
                    opacity={0}
                    style={{display:'none', width:'0', zIndex:'0'}}
                    position={{ lat: marker.latlong.lat, lng: marker.latlong.lng }}
                />

            ))}
        </MarkerClusterer>
    </GoogleMap>
));

const DestinationMarker = (props) => {
    const [ opacity, setOpacity ] = useState(0)

    useEffect(() => {
        let tempOpacity = 0;

        const idInterval = window.setInterval(() => {
            if (tempOpacity < 1) {
                tempOpacity += 0.2
                setOpacity(tempOpacity)
            } else {
                window.clearInterval(idInterval)
            }
        }, 100)
        return function() {
            tempOpacity = 0
        }
    }, [])

    let iconMarker = new window.google.maps.MarkerImage(
        "https://www.iconninja.com/files/902/911/830/dot-icon.png",
        null, /* size is determined at runtime */
        null, /* origin is 0,0 */
        new window.google.maps.Point(4, 4), /* anchor is bottom center of the scaled image */
        new window.google.maps.Size(8, 8)
    );

    return (
        <Marker position={props.position} icon={iconMarker} opacity={opacity} />
    )
}

const CurveMarker = ({ pos1, pos2, mapProjection, zoom }) => {
    const [ opacity, setOpacity ] = useState(0)
    const [ mounted, setMounted ] = useState(false)

    useEffect(() => {
        let i = 0;
        let timer = 0;
        let tempOpacity = 0;
        let idTimeout = [];

        if (mounted === false) {
            for (i = 0; i < 5; i++) {
                timer += 100;
                idTimeout.push(
                    window.setTimeout(() => {
                        tempOpacity += 0.2
                        setOpacity(tempOpacity)
                    }, timer)
                )
            }
        }

        setMounted(true)

        return () => {
            for (let i = 0; i < idTimeout; i++) {
                window.clearTimeout(idTimeout[i])
            }
        }
    }, [])

    if ( ! mapProjection) return <div />;

    const curvature = 0.2;

    const p1 = mapProjection.fromLatLngToPoint(pos1);
    const p2 = mapProjection.fromLatLngToPoint(pos2);

    // Calculating the arc.
    const e = new window.google.maps.Point(p2.x - p1.x, p2.y - p1.y) // endpoint
    const m = new window.google.maps.Point(e.x / 2, e.y / 2); // midpoint
    const o = new window.google.maps.Point(e.y, -e.x); // orthogonal
    const c = new window.google.maps.Point(m.x + curvature * o.x, m.y + curvature * o.y); //curve control point

    const pathDef = "M 0,0 " + "q " + c.x + "," + c.y + " " + e.x + "," + e.y;

    const scale = 1 / Math.pow(2, -zoom);

    const symbol = {
        path: pathDef,
        scale: scale,
        strokeWeight: 2,
        strokeColor: '#47cae4',
        fillColor: "none"
    };

    return (
        <Marker
            opacity={opacity}
            position={pos1}
            clickable={false}
            icon={symbol}
            zIndex={0}
        />
    );
};

export default MyMap;
