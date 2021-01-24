import React, {useEffect, useRef, useState} from 'react';
import ViewWrapper from '../components/ViewWrapper';
import Slider from '../components/toolbox/form/Slider';
import RangeSlider, {date,MONTHS_ABRV} from '../components/toolbox/form/RangeSlider';
import Counter, {positiveOnly, maxVal} from '../components/toolbox/form/Counter';
import MoreDetails from '../components/toolbox/misc/MoreDetails2'
import {useNumberCounter} from '../components/hooks/useNumberCounter'
import Button from '../components/toolbox/form/Button'
import {useMediaQuery} from 'react-responsive'
import {HiCheck} from 'react-icons/hi'
import {motion, useSpring, useTransform} from 'framer-motion'
import Cookies from 'universal-cookie'
import {useHistory} from 'react-router'
import {shouldPromptToEnableNotifications} from './PushNotificationsPrompt'
import {ReduxState} from '../redux/reducers/all_reducers'
import {useSelector} from 'react-redux'
import {useSearchForPropertiesLazyQuery, Property, PropertyDirections} from '../API/queries/types/graphqlFragmentTypes'

import {MapContainer, TileLayer, Marker, Polyline, Popup} from 'react-leaflet'

const SearchView = () => {

    const [SearchForProps, {data: searchResponse}] = useSearchForPropertiesLazyQuery();

    const user = useSelector((state: ReduxState) => state.user);
    const institute = useSelector((state: ReduxState) => state.institution);

    const containerRef = useRef<HTMLDivElement>(null)
    const leftContainerRef = useRef<HTMLDivElement>(null)
    const [leftFilterWidth, setLeftFilterWidth] = useState<number>(400)
    const [contentStart, setContentStart] = useState<number>(0)
    
    const [properties, setProperties] = useState<Property[]>([])

    const history = useHistory();
    const cookie = new Cookies ();

    const resultsCount = useNumberCounter({
        value: 50,
        duration: 1000
    })

    useEffect(() => {
        updateFilterWidth ()
        window.addEventListener(`resize`, updateFilterWidth)

        // execute search queries
        SearchForProps({
            variables: {
                price_start: 0,
                price_end: 0,
                rooms: 0,
                distance: 0
            }
        })

        return () => {
            window.removeEventListener(`resize`, updateFilterWidth)
        }
    }, [])

    useEffect(() => {

        if (searchResponse && searchResponse.searchForProperties && searchResponse.searchForProperties.data) {
            setProperties(searchResponse.searchForProperties.data.properties);
        }

    }, [searchResponse]);

    useEffect(() => {

        if (user && user.user) {
            shouldPromptToEnableNotifications(user)
            .then((shouldPrompt: boolean) => {
                if (shouldPrompt) history.push('/notifications/enable')
            })
        }
    }, [user])

    const updateFilterWidth = () => {
        // filter width should be x% of the page width
        let w_ = document.documentElement.getBoundingClientRect().width;
        setLeftFilterWidth(w_ * 0.32)
    }

    const getInstituteLocation = () => {
        if (institute && institute.location) {
            // [institute.location.latitude, institute.location.longitude]
            return {
                lat: institute.location.latitude,
                lng: institute.location.longitude
            }
         }
         return {lat: 0, lng: 0};
    }

    const generateCoordsPolyLine = (dir: any[]): any [] => {
        let coords: any [] = [];

        for (let i = 0; i < dir.length - 1; ++i) {
            coords.push([
                [dir[i][1], dir[i][0]], [dir[i+1][1], dir[i+1][0]]
            ]);
        }

        console.log(`coords`, coords);
        return coords;
    }

    return (<ViewWrapper
        hide_sidebar={true}
        left_attachment_width={leftFilterWidth}
        onContentStart={(val: number) => {
            setContentStart(val)
        }}
        left_attachment={<div className="filter-map-attachment">

            {/* Left Side */}
            <div className="section-header-2" style={{height: `30px`, marginBottom: `16px`}}>
                <div className="title-area">Search</div>
                <div className="counter_">{resultsCount} Properties</div>
            </div>
            
            <div className="left-side_" ref={leftContainerRef} style={{
                // left: `${leftFilterProps.left}px`,
                // width: `${leftFilterProps.width}px`
            }}>
                {/* Filter Box */}
                <div className="search-filter-box">
                    <div style={{
                        padding: `10px`,
                        marginBottom: `5px`,
                        // border: `1px solid black`
                    }}>
                        <div className="input-label_">Price Per Room</div>
                        <RangeSlider 
                            forceUpdate={leftFilterWidth}
                            range={{start: 300, end: 1200}}
                            toStr={(val: any): string => {return `$${(val as number).toFixed(2)}`}}
                        />
                    </div>

                    <div style={{
                        padding: `10px`,
                        // border: `1px solid black`
                    }}>
                    <div className="input-label_">Lease Period</div>
                        <RangeSlider 
                            forceUpdate={leftFilterWidth}
                            // range={{start: 300, end: 1200}}
                            range={{
                                interpolate: date.from(new Date()).to(date.fromNow({ years: 1 })),
                                toString: (_: Date) => `${MONTHS_ABRV[_.getMonth()]} ${_.getDate()}, ${_.getFullYear()}`
                            }}
                            onChange={(start_date: Date, end_date: Date) => {
                                console.log(`start`, start_date)
                                console.log(`end`, end_date)
                            }}
                            toStr={(val: any): string => {return `$${(val as number).toFixed(2)}`}}
                        />
                    </div>

                    {/* # of Rooms & Distance Counters */}
                    <div className="filter-bottom-counters">
                        <div className="inline-form-input" style={{
                            padding: `10px`
                        }}>
                            <div className="input-label_">
                                <span style={{marginRight: `5px`}}>Rooms</span>
                                <div style={{display: 'inline-block'}}>
                                    <MoreDetails
                                        width={150}
                                        details="Choose how many rooms you are looking for."
                                    />
                                </div>
                            </div>
                            <div className="input-area_">
                                <Counter
                                    restrictions={[positiveOnly, maxVal(4, {inclusive: true})]}
                                    onChange={(val: number) => {}}
                                />
                            </div>
                        </div>

                        <div className="inline-form-input right" style={{
                            padding: `10px`
                        }}>
                            <div className="input-label_">
                                <span style={{marginRight: `5px`}}>Distance (mi.)</span>
                                <div style={{
                                    display: 'inline-block'
                                }}>
                                    <MoreDetails 
                                        width={150}
                                        details="Choose the maximum distance from campus you are looking for"
                                    />
                                </div>
                            </div>
                            <div className="input-area_">
                                <Counter
                                    restrictions={[positiveOnly, maxVal(40, {inclusive: true})]}
                                    onChange={(val: number) => {}}
                                    incrementBy={5}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{height: `10px`}} />
                </div>

                <div className="map-box" style={{}}>
                    {/* React Leaflet Resource: https://blog.logrocket.com/how-to-use-react-leaflet/ */}
                    <MapContainer center={getInstituteLocation()} zoom={17} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={getInstituteLocation()}>
                        <Popup>Troy Placeholder</Popup>
                    </Marker>

                    {/* Put the coordinates information */}
                    {properties.map((property: Property, i: number) => {
                        if (!property.directions) return (<div key={i} />)
                        let directions_ = property.directions.filter((dir: PropertyDirections) => 
                            institute && institute._id && dir.institution_id == institute._id);
                        
                        if (directions_.length == 0) return (<div key={i} />)
                        let dir: any[] = [];
                        if (directions_[0].cycling_regular_directions != undefined && directions_[0].cycling_regular_directions.length > 0) 
                            dir = directions_[0].cycling_regular_directions[0].coordinates;
                        
                        else if (directions_[0].driving_car_directions != undefined && directions_[0].driving_car_directions.length > 0) 
                            dir = directions_[0].driving_car_directions[0].coordinates;

                        else if (directions_[0].foot_walking_directions != undefined && directions_[0].foot_walking_directions.length > 0) 
                            dir = directions_[0].foot_walking_directions[0].coordinates;

                        return (<Polyline key={i}
                            pathOptions={{ color: 'purple' }}
                            positions={ generateCoordsPolyLine(dir) }
                        />)
                    })}
                    </MapContainer>
                </div>
            </div>

        </div>}
    >
        <div className="search-container" ref={containerRef} style={{
            position: 'relative',
            marginTop: `47px`
        }}>

            {/* Right Side */}
            <div className="right-side_">
                {properties.map((_: any, i: number) => 
                    <SearchResult key={i} delay={i < 8 ? i * 100 : 0} />
                )}
            </div>

        </div>
    </ViewWrapper>)
}

const SearchResult = ({delay}: {delay: number}) => {
    
    const isLargeScreen = useMediaQuery({
        query: '(min-width: 1200px)'
    })
    
    const showResultSpring = useSpring(0)
    const rotateXTransform = useTransform(showResultSpring, [0, 1], [10, 0])
    const translateYTransform = useTransform(showResultSpring, [0, 1], [-15, 0])

    useEffect(() => {
        let t_ = setTimeout(() => {
            showResultSpring.set(1)
        }, delay)

        return () => {
            clearTimeout(t_);
        }
    }, [])

    return (<motion.div 
        style={{
            opacity: showResultSpring,
            rotateX: rotateXTransform,
            translateY: translateYTransform,
            perspective: `6.5cm`
        }}
        className="search-result-2">
        
        <div className="image-area_">
            <div className="image-holder" />
        </div>
        <div className="info-area_">
            <div className="property-location">Sample Property Location 101</div>
            <div className="property-meta">TROY NY, 12180</div>

            <div className="action-area">
                <Button 
                    bold={true}
                    text="View"
                    textColor="white"
                    background="#3B4353"
                />
            </div>
        </div>

        {isLargeScreen && <div className="amenities-area">
            <div className="header_">Amenities</div>
            {Array.from(new Array(3), (_: any, i: number) => 
                <div className="entry_" key={i}>
                    <div className="check_"><HiCheck /></div>
                    <div className="">Entry Goes Here</div>
                </div>
            )}
        </div>}

    </motion.div>)
}
export default SearchView