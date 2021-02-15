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
import {ReduxState} from '../redux/reducers/all_reducers'
import {useSelector, useDispatch} from 'react-redux'
import {
    useSearchForPropertiesLazyQuery, 
    useAddCollectionMutation,
    useRemoveCollectionMutation,
    Property, 
    PropertySearchResult,
    PropertyDirections
} from '../API/queries/types/graphqlFragmentTypes'
import { Empty, Rate } from 'antd';
import {fetchUser} from '../redux/actions/user'

import {MapContainer, TileLayer, Marker, Polyline, Popup} from 'react-leaflet'

const SearchView = () => {

    const [SearchForProps, {data: searchResponse}] = useSearchForPropertiesLazyQuery();

    const user = useSelector((state: ReduxState) => state.user);
    const institute = useSelector((state: ReduxState) => state.institution);

    const containerRef = useRef<HTMLDivElement>(null)
    const leftContainerRef = useRef<HTMLDivElement>(null)
    const [leftFilterWidth, setLeftFilterWidth] = useState<number>(400)
    const [contentStart, setContentStart] = useState<number>(0)
    
    const [properties, setProperties] = useState<PropertySearchResult[]>([])

    const history = useHistory();
    const cookie = new Cookies ();

    const resultsCount = useNumberCounter({
        value: properties.length,
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
            setProperties(searchResponse.searchForProperties.data.search_results);
        }

    }, [searchResponse]);

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
                    {properties.map((res: PropertySearchResult, i: number) => {
                        let property: Property = res.property;
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
            {properties.length > 0 &&
            <div className="right-side_">
                {properties.map((property: PropertySearchResult, i: number) => 
                    <SearchResult user={user}
                    result={property} key={i} delay={i < 8 ? i * 100 : 0} />
                )}
            </div>}

            {properties.length == 0 &&
            <div style={{
                textAlign: `center`,
                margin: `0 auto`,
                paddingTop: `150px`
            }}>
                <Empty
                    description={
                    <span>No properties could be found</span>
                    }
                />
            </div>}

        </div>
    </ViewWrapper>)
}

const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
const SearchResult = ({delay, result, user}: {delay: number, result: PropertySearchResult, user: any}) => {

    const dispatch = useDispatch();

    const propertySaved = (): boolean => {
        if (!user || !user.user) return false;
        if (user.user.saved_collection.includes(result.property._id)) return true;
        return false;
    }

    const [AddCollection, {data: addCollectionResponse}] = useAddCollectionMutation();
    const [RemoveCollection, {data: removeCollectionResponse}] = useRemoveCollectionMutation();

    useEffect(() => {
        if (
            (addCollectionResponse && addCollectionResponse.addPropertyToStudentCollection
            && addCollectionResponse.addPropertyToStudentCollection.data
            && addCollectionResponse.addPropertyToStudentCollection.success)
        ||
            (removeCollectionResponse && removeCollectionResponse.removePropertyFromStudentCollection
            && removeCollectionResponse.removePropertyFromStudentCollection.data
            && removeCollectionResponse.removePropertyFromStudentCollection.success)) {
                dispatch(fetchUser(user, {update: true}));   
            }
      }, [addCollectionResponse, removeCollectionResponse])

    const getPropertyPriceRange = () :string => {
        if (result.price_range.length == 1) return `$${result.price_range[0]}`;
        else return `$${result.price_range[0]}-$${result.price_range[1]}`
    }

    return (<div className="search-result-3">

        {/* Price Area */}
        <div className="price-holder">
            <div className="price-info">
                <div className="price_">{getPropertyPriceRange()} </div>
                <div className="month_">/month</div>
            </div>

            {/* # of rooms avaliable */}
            { <div className="lease-count">{result.lease_count} lease(s) available</div>}
        </div>

        {/* Image Side */}
        <div className="image-area">
            <div style={{
                backgroundColor: `#E1E6EA`,
                width: `100%`,
                height: `100%`,
                borderRadius: `5px`
            }} />

            <div className="picture-count">+8 Pictures</div>
        </div>

        {/* Property Info Area */}
        <div className="property-info-area">

            {/* Top Side */}
            <div className="property-info-top">
                
                {/* Property Location Info */}
                <div className="prop-info">
                    <div className="addr-line">{result.property.address_line.toLowerCase()}</div>
                    {result.property.address_line_2 && result.property.address_line_2 != ""
                    && <div className="addr-line">{result.property.address_line_2.toLowerCase()}</div>}
                    <div className="addr-line-2">
                        {result.property.city.toLowerCase()} {result.property.state}, {result.property.zip}
                    </div>

                    {/* Show the amenities */}
                    <div style={{marginTop: `5px`}}>
                        {function () {
                            let amentities: string[] = [];
                            if (result.property.details && result.property.details.furnished) amentities.push("Furnished");
                            if (result.property.details && result.property.details.has_heater) amentities.push("Heating");
                            if (result.property.details && result.property.details.has_ac) amentities.push("AC");
                            if (result.property.details && result.property.details.has_washer) amentities.push("Washer");

                            return amentities.map((amenity: string, i: number) => 
                                <div key={i} className="info-tag">{amenity}</div>)
                        }()}
                    </div>

                    {/* Property Rating Placeholder */}
                    {result.property_rating_count > 0 && <div>
                        <div style={{fontWeight: 600, marginTop: `8px`}}>Property Ratings</div>
                        <Rate tooltips={desc} disabled value={result.property_rating_avg * 5} />
                        <div>from {result.property_rating_count} Ratings</div>
                    </div>}
                    {result.property_rating_count == 0 && <div style={{marginTop: `10px`, fontStyle: `italic`}}>No property ratings yet</div>}
                </div>

                {/* Landlord Info */}
                <div className="landlord-info">

                    <div style={{
                        fontWeight: 600,
                        fontFamily: "khumbh-sans"
                    }}>Landlord</div>
                    <div className="info-line">{result.landlord_first_name} {result.landlord_last_name}</div>
                    <div>
                        {result.landlord_rating_count > 0 && <div>
                            <div style={{fontWeight: 600, marginTop: `8px`}}>Landlord Ratings</div>
                            <Rate tooltips={desc} disabled value={result.landlord_rating_avg * 5} />
                            <div>from {result.landlord_rating_count} Ratings</div>
                        </div>}
                        {result.landlord_rating_count == 0 && <div style={{marginTop: `10px`, fontStyle: `italic`}}>No landlord ratings yet</div>}
                    </div>

                </div>

            </div>

            {/* Bottom Side */}
            <div className="property-info-bottom">
                
                {/* More Info on Property */}
                <div style={{
                    position: 'absolute',
                    right: `15px`,
                    bottom: `10px`,
                    display: `flex`
                }}>
                    <div style={{marginRight: `5px`}}>
                        <Button 
                            text={propertySaved() ? `Remove` : `Save`}
                            background="#848CFF"
                            bold={true}
                            textColor="white"
                            transformDisabled={true}
                            onClick={() => {
                                // Do save stuff ...
                                if (user && user.user) {
                                    if (propertySaved()) {
                                        RemoveCollection({
                                            variables: {
                                                student_id: user.user._id,
                                                property_id: result.property._id
                                            }
                                        });
                                    }
                                    else {
                                        AddCollection({
                                            variables: {
                                                student_id: user.user._id,
                                                property_id: result.property._id
                                            }
                                        });
                                    }
                                }
                            }}
                        /> 
                    </div>
                    <div>
                        <Button 
                            text="View Property"
                            background="#E0777D"
                            bold={true}
                            textColor="white"
                            transformDisabled={true}
                            link_to={`/info/property/${result.property._id}`}
                        /> 
                    </div>
                </div>
            </div>

        </div>

    </div>);
}
export default SearchView