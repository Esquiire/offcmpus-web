import React, { useState, useEffect, useRef } from 'react'
import { Helmet } from "react-helmet";
import ViewWrapper from '../components/ViewWrapper';
import Tabs from '../components/toolbox/misc/Tabs';
import {
    Select, Rate, Empty,
    Upload, Input, Result, Spin,
    Tag, Button as AntButton
} from 'antd';
import { InboxOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import {
    useGetPropertySummaryLazyQuery,
    useCanAddReviewLazyQuery,
    useAddReviewForLeaseMutation,
    useExpressInterestMutation,
    useAddCollectionMutation,
    useRemoveCollectionMutation,
    LeaseHistory,
    Lease,
    LeaseAndAvailability,
    PropertySummary,
    PropertyDetails
} from '../API/queries/types/graphqlFragmentTypes'
import { IoMdQrScanner } from 'react-icons/io'
import { BiHealth } from 'react-icons/bi'

import { fetchUser } from '../redux/actions/user'
import { ReduxState } from '../redux/reducers/all_reducers';
import Button from '../components/toolbox/form/Button';
import Popup, { PopupHeader, ConfirmLine } from '../components/toolbox/misc/Popup';
import { UploadFile } from 'antd/lib/upload/interface';
import { uploadObjects } from '../API/S3API';
import MoreDetails from '../components/toolbox/misc/MoreDetails2';
import ImageGalleryPopup from '../components/toolbox/misc/ImageGalleryPopup'

const { Option } = Select;
const { Dragger } = Upload;

const dateAbbr = (date: Date): string => {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

const images = [
    "https://pix.idxre.com/pix/clientPhotos3/0_11523444_201900119.JPG",
    "https://img.chime.me/imagesrc/mls-listing/20210219/14/original_202030175-12573062901660652.jpg",
    "https://img.chime.me/imagesrc/mls-listing/20210217/14/original_202030175-12402065906477274.jpg",
    'https://www.houselogic.com/wp-content/uploads/2016/08/property-tax-appeal-retina_retina_9f661fd354bfde92b764d39542dfee75.jpg',
    "https://pix.idxre.com/pix/clientPhotos3/0_11523444_201900119.JPG",
    "https://img.chime.me/imagesrc/mls-listing/20210219/14/original_202030175-12573062901660652.jpg",
    "https://img.chime.me/imagesrc/mls-listing/20210217/14/original_202030175-12402065906477274.jpg",
    'https://www.houselogic.com/wp-content/uploads/2016/08/property-tax-appeal-retina_retina_9f661fd354bfde92b764d39542dfee75.jpg',
    "https://pix.idxre.com/pix/clientPhotos3/0_11523444_201900119.JPG",
    "https://img.chime.me/imagesrc/mls-listing/20210219/14/original_202030175-12573062901660652.jpg",
    "https://img.chime.me/imagesrc/mls-listing/20210217/14/original_202030175-12402065906477274.jpg",
    'https://www.houselogic.com/wp-content/uploads/2016/08/property-tax-appeal-retina_retina_9f661fd354bfde92b764d39542dfee75.jpg',
    "https://pix.idxre.com/pix/clientPhotos3/0_11523444_201900119.JPG",
    "https://img.chime.me/imagesrc/mls-listing/20210219/14/original_202030175-12573062901660652.jpg",
    "https://img.chime.me/imagesrc/mls-listing/20210217/14/original_202030175-12402065906477274.jpg",
    'https://www.houselogic.com/wp-content/uploads/2016/08/property-tax-appeal-retina_retina_9f661fd354bfde92b764d39542dfee75.jpg',
    "https://pix.idxre.com/pix/clientPhotos3/0_11523444_201900119.JPG",
    "https://img.chime.me/imagesrc/mls-listing/20210219/14/original_202030175-12573062901660652.jpg",
    "https://img.chime.me/imagesrc/mls-listing/20210217/14/original_202030175-12402065906477274.jpg",
    'https://www.houselogic.com/wp-content/uploads/2016/08/property-tax-appeal-retina_retina_9f661fd354bfde92b764d39542dfee75.jpg',
    "https://pix.idxre.com/pix/clientPhotos3/0_11523444_201900119.JPG",
    "https://img.chime.me/imagesrc/mls-listing/20210219/14/original_202030175-12573062901660652.jpg",
    "https://img.chime.me/imagesrc/mls-listing/20210217/14/original_202030175-12402065906477274.jpg",
    'https://www.houselogic.com/wp-content/uploads/2016/08/property-tax-appeal-retina_retina_9f661fd354bfde92b764d39542dfee75.jpg',
    "https://pix.idxre.com/pix/clientPhotos3/0_11523444_201900119.JPG",
    "https://img.chime.me/imagesrc/mls-listing/20210219/14/original_202030175-12573062901660652.jpg",
    "https://img.chime.me/imagesrc/mls-listing/20210217/14/original_202030175-12402065906477274.jpg",
    'https://www.houselogic.com/wp-content/uploads/2016/08/property-tax-appeal-retina_retina_9f661fd354bfde92b764d39542dfee75.jpg',
    "https://pix.idxre.com/pix/clientPhotos3/0_11523444_201900119.JPG",
    "https://img.chime.me/imagesrc/mls-listing/20210219/14/original_202030175-12573062901660652.jpg",
    "https://img.chime.me/imagesrc/mls-listing/20210217/14/original_202030175-12402065906477274.jpg",
    'https://www.houselogic.com/wp-content/uploads/2016/08/property-tax-appeal-retina_retina_9f661fd354bfde92b764d39542dfee75.jpg',
    "https://pix.idxre.com/pix/clientPhotos3/0_11523444_201900119.JPG",
    "https://img.chime.me/imagesrc/mls-listing/20210219/14/original_202030175-12573062901660652.jpg",
    "https://img.chime.me/imagesrc/mls-listing/20210217/14/original_202030175-12402065906477274.jpg",
    'https://www.houselogic.com/wp-content/uploads/2016/08/property-tax-appeal-retina_retina_9f661fd354bfde92b764d39542dfee75.jpg',
    "https://pix.idxre.com/pix/clientPhotos3/0_11523444_201900119.JPG",
    "https://img.chime.me/imagesrc/mls-listing/20210219/14/original_202030175-12573062901660652.jpg",
    "https://img.chime.me/imagesrc/mls-listing/20210217/14/original_202030175-12402065906477274.jpg",
    'https://www.houselogic.com/wp-content/uploads/2016/08/property-tax-appeal-retina_retina_9f661fd354bfde92b764d39542dfee75.jpg',
    "https://pix.idxre.com/pix/clientPhotos3/0_11523444_201900119.JPG",
    "https://img.chime.me/imagesrc/mls-listing/20210219/14/original_202030175-12573062901660652.jpg",
    "https://img.chime.me/imagesrc/mls-listing/20210217/14/original_202030175-12402065906477274.jpg",
    'https://www.houselogic.com/wp-content/uploads/2016/08/property-tax-appeal-retina_retina_9f661fd354bfde92b764d39542dfee75.jpg',
    "https://pix.idxre.com/pix/clientPhotos3/0_11523444_201900119.JPG",
    "https://img.chime.me/imagesrc/mls-listing/20210219/14/original_202030175-12573062901660652.jpg",
    "https://img.chime.me/imagesrc/mls-listing/20210217/14/original_202030175-12402065906477274.jpg",
    'https://www.houselogic.com/wp-content/uploads/2016/08/property-tax-appeal-retina_retina_9f661fd354bfde92b764d39542dfee75.jpg'
];
const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
const StudentPropertyInfoView = ({ property_id }: { property_id: string }) => {

    const dispatch = useDispatch();
    const user = useSelector((state: ReduxState) => state.user);
    const [reviewView, setReviewView] = useState<'landlord' | 'property'>('property');
    const [summary, setPropertySummary] = useState<any | null>(null);
    const [showAddReview, setShowAddReview] = useState<boolean>(false);
    const [userLease, setUserLease] = useState<any>(null);
    const [userLeaseHistory, setUserLeaseHistory] = useState<LeaseHistory | null>(null);
    const [reviewPopupPage, setReviewPopupPage] = useState<number>(0);
    const [showImageGallery, setShowImageGallery] = useState<boolean>(false);

    const [imageIndex, setImageIndex] = useState<number>(0);
    const imageIndexRef = useRef<number>(0);
    const timerTickerRef = useRef(null);

    useEffect(() => {

        setInterval(() => {
            imageIndexRef.current = (imageIndexRef.current + 1) % images.length;
            setImageIndex(imageIndexRef.current);
        }, 5000);

    }, []);

    const closePopup = () => {
        setReviewPopupPage(0);
        setShowAddReview(false);
    }

    type NewReview = {
        review: string
        rating: number
        image_files?: (Blob | File | undefined)[]
    }
    const [updatedReview, setUpdatedReview] = useState<{ landlord: NewReview, property: NewReview }>({
        landlord: {
            review: "", rating: 0
        }, property: {
            review: "", rating: 0
        }
    })

    const [ExpressInterest, { data: interestResponse }] = useExpressInterestMutation();
    const [AddReview, { data: addReviewResponse, loading: addReviewLoading }] = useAddReviewForLeaseMutation();
    // query whether the current user can write a review
    const [CanAddReview, { data: canAddReviewResponse }] = useCanAddReviewLazyQuery();
    const [AddToCollection, { data: addCollectionResponse }] = useAddCollectionMutation();
    const [RemoveFromCollection, { data: removeCollectionResponse }] = useRemoveCollectionMutation();

    // get the summary for this property
    const [GetPropertySummary, { data: summaryDataResponse }] = useGetPropertySummaryLazyQuery();

    useEffect(() => {
        if (
            (removeCollectionResponse && removeCollectionResponse.removePropertyFromStudentCollection
                && removeCollectionResponse.removePropertyFromStudentCollection.data
                && removeCollectionResponse.removePropertyFromStudentCollection.success)
            ||
            (addCollectionResponse && addCollectionResponse.addPropertyToStudentCollection
                && addCollectionResponse.addPropertyToStudentCollection.data
                && addCollectionResponse.addPropertyToStudentCollection.success)
        ) {
            // update student state information
            dispatch(fetchUser(user, { update: true }));
        }
    }, [addCollectionResponse, removeCollectionResponse]);

    useEffect(() => {
        if (summaryDataResponse && summaryDataResponse.getPropertySummary) {

            // if there is an error getting the property information ...
            // TODO route back to search view
            if (summaryDataResponse.getPropertySummary.error
                || !summaryDataResponse.getPropertySummary.success) {
                console.error(`Could not fetch property summart for property: ${property_id}`);
                console.error(summaryDataResponse.getPropertySummary.error);
            }

            // otherwise, set the summary state
            else if (summaryDataResponse.getPropertySummary.data) {
                setPropertySummary(summaryDataResponse.getPropertySummary.data);
            }
        }
    }, [summaryDataResponse]);

    /**
     * Determine whether this student has already expressed interest for this property
     */
    const alreadyInterested = (lease: Lease): boolean => {
        if (!user || !user.user) return false;
        for (let i = 0; i < lease.student_interests.length; ++i) {
            if (lease.student_interests[i].student_id == user.user._id) return true;
        }
        return false;
    }

    useEffect(() => {

        // if the user can add reviews, try to find the lease history of most recent date
        // to use for the active lease history
        if (user && user.user) {
            if (canAddReviewResponse && canAddReviewResponse.canAddReview && canAddReviewResponse.canAddReview.success) {
                if (summaryDataResponse && summaryDataResponse.getPropertySummary && summaryDataResponse.getPropertySummary.success
                    && summaryDataResponse.getPropertySummary.data) {

                    // loop through the data's lease history 
                    let lease_history: LeaseHistory | null = null;
                    let lease_: any = null;

                    let leases = summaryDataResponse.getPropertySummary.data.leases;
                    for (let i = 0; i < leases.length; ++i) {
                        if (leases[i].lease.lease_history) {

                            for (let j = 0; j < leases[i].lease.lease_history.length; ++j) {

                                if (leases[i].lease.lease_history[j].student_id == user.user._id) {
                                    lease_ = leases[i];
                                    if (lease_history == null) lease_history = leases[i].lease.lease_history[j] as LeaseHistory;
                                    else {

                                        // get the most recent lease history
                                        let prev: Date = new Date((lease_history as any).end_date);
                                        let current: Date = new Date(leases[i].lease.lease_history[j].end_date);

                                        if (current > prev) {
                                            lease_history = leases[i].lease.lease_history[j] as LeaseHistory;
                                        }

                                    }
                                }

                            } // end for j

                        }
                    } // end for i
                    if (lease_history != null) setUserLeaseHistory(lease_history);
                    if (lease_ != null) setUserLease(lease_);

                }
            }
        }

    }, [canAddReviewResponse, summaryDataResponse, user]);

    useEffect(() => {
        if (user && user.user) {
            CanAddReview({
                variables: {
                    property_id,
                    student_id: user.user._id
                }
            })
        }
    }, [user]);

    useEffect(() => {
        GetPropertySummary({
            variables: {
                property_id,
                student_id: user && user.user ? user.user._id : ''
            }
        })
    }, []);

    // review order structure
    type ReviewOrder = {
        property: 'most-recent' | 'least-recent'
        landlord: 'most-recent' | 'least-recent'
    }
    const [reviewOrder, setReviewOrder] = useState<ReviewOrder>({
        property: 'most-recent',
        landlord: 'most-recent'
    })

    const getOrderSelect = () => {

        if (reviewView == 'property') {
            return (
                <Select
                    key={0}
                    defaultValue={reviewOrder['property']}
                    onChange={(value: 'most-recent' | 'least-recent') => {
                        let old_order = { ...reviewOrder };
                        old_order['property'] = value;
                        setReviewOrder(old_order);
                    }
                    }>
                    <Option value="most-recent">Most Recent</Option>
                    <Option value="least-recent">Lease Recent</Option>
                </Select>)
        }
        else return (
            <Select
                key={1}
                defaultValue={reviewOrder['landlord']}
                onChange={(value: 'most-recent' | 'least-recent') => {
                    let old_order = { ...reviewOrder };
                    old_order['landlord'] = value;
                    setReviewOrder(old_order);
                }
                }>
                <Option value="most-recent">Most Recent</Option>
                <Option value="least-recent">Lease Recent</Option>
            </Select>)

    }

    const getAddressLine = (): string => {
        let addr = "";
        if (summary) {
            addr += summary.property.address_line;
            if (summary.property.address_line_2 && summary.property.address_line_2 != "")
                addr += ", " + summary.property.address_line_2;
        }
        return addr;
    }

    const getStateAndZip = (): string => {
        let str = "";
        if (summary) {
            str += `${summary.property.city} ${summary.property.state}, ${summary.property.zip}`
        }
        return str;
    }

    const getReviewCount = (): number => {
        let count_ = 0;

        /* 
        * The review count is the count of all the property reviews and all the
        * landlord reviews.
        */
        if (summary) {
            for (let i = 0; i < summary.leases.length; ++i) {
                for (let j = 0; j < summary.leases[i].lease.lease_history.length; ++j) {
                    if (summary.leases[i].lease.lease_history[j].review_of_property) ++count_;
                    if (summary.leases[i].lease.lease_history[j].review_of_landlord) ++count_;
                }
            }
        }

        return count_;
    }

    const setActiveUserReviewState = () => {
        let review_: { landlord: NewReview, property: NewReview } = {
            landlord: { review: "", rating: 0 },
            property: { review: "", rating: 0 }
        };

        // fetch the data for the review that the user already has stored
        // in our history
        if (userLeaseHistory == null) return;

        if (userLeaseHistory.review_of_landlord) {
            review_.landlord.review = userLeaseHistory.review_of_landlord.review;
            review_.landlord.rating = userLeaseHistory.review_of_landlord.rating;
        }
        if (userLeaseHistory.review_of_property) {
            review_.property.review = userLeaseHistory.review_of_property.review;
            review_.property.rating = userLeaseHistory.review_of_property.rating;
        }

        setUpdatedReview(review_);
    }

    /** 
     * Get the average review scale b/w 0 and 1
    */
    const getAveragePropertyReviewScale = (): number => {
        let scale = 0;
        let count = 0;

        if (summary) {
            for (let i = 0; i < summary.leases.length; ++i) {
                if (!summary.leases[i].lease.lease_history) continue;
                for (let j = 0; j < summary.leases[i].lease.lease_history.length; ++j) {
                    if (summary.leases[i].lease.lease_history[j].review_of_property) {
                        ++count;
                        scale += summary.leases[i].lease.lease_history[j].review_of_property.rating;
                    }
                }
            }
        }
        return count == 0 ? 0 : scale / count;
    }

    const getAverageLandlordReviewScale = (): number => {
        let scale = 0;
        let count = 0;

        if (summary) {
            for (let i = 0; i < summary.leases.length; ++i) {
                if (!summary.leases[i].lease.lease_history) continue;
                for (let j = 0; j < summary.leases[i].lease.lease_history.length; ++j) {
                    if (summary.leases[i].lease.lease_history[j].review_of_landlord) {
                        ++count;
                        scale += summary.leases[i].lease.lease_history[j].review_of_landlord.rating;
                    }
                }
            }
        }
        return count == 0 ? 0 : scale / count;
    }

    const getPriceRange = (): string => {
        let price_range = "";

        if (summary) {
            if (summary.leases.length == 1) price_range = `$${summary.leases[0].lease.price_per_month}`;
            else if (summary.leases.length > 1) {
                let min_ = Number.MAX_VALUE;
                let max_ = Number.MIN_VALUE;
                for (let i = 0; i < summary.leases.length; ++i) {
                    min_ = Math.min(min_, summary.leases[i].lease.price_per_month);
                    max_ = Math.max(min_, summary.leases[i].lease.price_per_month);
                }
                price_range = `$${min_}-${max_}`;
            }
        }

        return price_range;
    }

    const propertySaved = (): boolean => {
        if (!user || !user.user) return false;
        if (user.type == 'landlord') return false;
        if ((user.user as any).saved_collection!.includes(property_id)) return true;
        return false;
    }

    return (<ViewWrapper>

        <Helmet>
            <meta charSet="utf-8" />
            <title>offcmpus | Property Info</title>
        </Helmet>

        {/* Image Gallery */}
        <ImageGalleryPopup images={images} onClose={() => setShowImageGallery(false)} show={showImageGallery} />

        {/* Add Review Popup */}
        <Popup show={canAddReviewResponse != undefined && canAddReviewResponse.canAddReview
            && canAddReviewResponse.canAddReview.success && showAddReview} width={600} height={700}>
            <PopupHeader
                withClose={true}
                onClose={() => closePopup()}
            >
                {canAddReviewResponse && canAddReviewResponse.canAddReview.data
                    && canAddReviewResponse.canAddReview.data.value == 2 ? "Write A Review" : "Edit Your Review"}
            </PopupHeader>


            {reviewPopupPage == 0 && <div style={{ padding: '0 20px' }}>
                {/* Property Review 1st */}
                <div style={{ fontWeight: 600, padding: `5px 0` }}>Review the Property</div>
                <div>
                    <Rate
                        character={<BiHealth />}
                        tooltips={desc} onChange={(val) => {
                            let old_review = { ...updatedReview };
                            old_review.property.rating = val / 5.0;
                            setUpdatedReview(old_review);
                        }} value={updatedReview.property.rating * 5} />
                </div>
                <div className="textarea-holder" style={{ marginTop: '10px' }}>
                    <textarea defaultValue={updatedReview.property.review} onChange={(e: any) => {
                        let old_review = { ...updatedReview };
                        old_review.property.review = e.target.value;
                        setUpdatedReview(old_review);
                    }}></textarea>
                </div>

                <div style={{ marginTop: `10px` }}>
                    <div style={{ fontWeight: 600, padding: `5px 0` }}>Add Images to of Property (optional)</div>
                    <Dragger {...{
                        name: 'file',
                        multiple: true,
                        onChange(info) {
                            const { status } = info.file;
                            console.log(info);

                            // add the files.
                            let allowed: string[] = ['image/jpeg', 'image/gif', 'image/png'];
                            let old_updatedReview = { ...updatedReview };
                            old_updatedReview.property.image_files = info.fileList.map((file_info: UploadFile<any>) =>
                                file_info.originFileObj).filter((file: any) => allowed.includes(file.type))

                            setUpdatedReview(old_updatedReview);

                        },
                    }}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                            band files
                        </p>
                    </Dragger>
                </div>

            </div>}

            {reviewPopupPage == 1 && <div style={{ padding: '0 20px' }}>
                {/* Property Review 1st */}
                <div style={{ fontWeight: 600, padding: `5px 0` }}>Review the Landlord</div>
                <div>
                    <Rate
                        character={<BiHealth />}
                        tooltips={desc} onChange={(val) => {
                            let old_review = { ...updatedReview };
                            old_review.landlord.rating = val / 5.0;
                            setUpdatedReview(old_review);
                        }} value={updatedReview.landlord.rating * 5} />
                </div>
                <div className="textarea-holder" style={{ marginTop: '10px' }}>
                    <textarea defaultValue={updatedReview.landlord.review} onChange={(e: any) => {
                        let old_review = { ...updatedReview };
                        old_review.landlord.review = e.target.value;
                        setUpdatedReview(old_review);
                    }}></textarea>
                </div>

            </div>}

            {/* Uploading the Review */}
            {reviewPopupPage == 2 && addReviewLoading &&
                <div style={{ textAlign: 'center', transform: `translateY(300px)` }}>
                    <Spin />
                </div>
            }

            {reviewPopupPage == 2 && !addReviewLoading &&
                <div>
                    <Result
                        status="success"
                        title="Review successfully uploaded"
                        subTitle="You have successfully uplaoded your review for this property"
                        extra={[
                            <AntButton type="primary" onClick={() => {
                                closePopup()
                            }} key="console">
                                Dismiss
                        </AntButton>,
                        ]}
                    />
                </div>
            }

            {reviewPopupPage != 2 && <ConfirmLine
                withCancel={true}
                onCancel={() => closePopup()}
                onConfirm={() => {
                    if (reviewPopupPage == 0) setReviewPopupPage(1);
                    else {
                        // TODO Submit feedback!
                        if (updatedReview.property.image_files != undefined) {
                            // upload the images
                            uploadObjects({
                                files: (updatedReview.property.image_files.filter((_: any) => _ != undefined)) as Blob[],
                                restricted: false
                            })
                                .then((res) => {
                                    // console.log(`Upload Result:`, res);
                                    let files = res.data.files_uploaded;
                                    // AddReview
                                    let added_images: string[] = files.map((file: any) => file.key);
                                    console.log("image keys: ", added_images);

                                    AddReview({
                                        variables: {
                                            lease_id: userLease != null ? userLease._id : "",
                                            student_id: user && user.user ? user.user._id : "",
                                            property_review: updatedReview.property.review,
                                            property_rating: updatedReview.property.rating,
                                            landlord_review: updatedReview.landlord.review,
                                            landlord_rating: updatedReview.landlord.rating,
                                            property_images: added_images
                                        }
                                    })
                                    setReviewPopupPage(2);
                                })
                                .catch((err) => {
                                    console.log(`Error: `, err);
                                    // ! problem occurred
                                    closePopup();
                                })
                        }
                        else {
                            // Just add the review.
                            AddReview({
                                variables: {
                                    lease_id: userLease != null ? userLease._id : "",
                                    student_id: user && user.user ? user.user._id : "",
                                    property_review: updatedReview.property.review,
                                    property_rating: updatedReview.property.rating,
                                    landlord_review: updatedReview.landlord.review,
                                    landlord_rating: updatedReview.landlord.rating,
                                    property_images: []
                                }
                            });
                            setReviewPopupPage(2);
                        }

                    }
                }}
                confirmButtonText={reviewPopupPage == 0 ? `Next: Landlord Review` : `Save Review`}
            />}

        </Popup>

        <div className="section-header-2" style={{ height: `30px`, marginBottom: `16px` }}>
            <div className="title-area">Property Info</div>
        </div>

        <div className="student-property-view-modal">

            {/* Property Info & Image */}
            <div className="property-info">

                <div className="image-area_ no-select">

                    {/* Top Icon Area */}
                    <div className="image-icon-area">
                        <div className="icon_"
                            onClick={() => setShowImageGallery(true)}
                        ><IoMdQrScanner /></div>
                    </div>

                    <div className="iamge-container" style={{
                        width: `calc(100% * ${images.length})`,
                        transform: `translateX(calc(calc(100%/${images.length}) * ${imageIndex * -1})`
                    }}>

                        {images.map((img: string, i: number) =>
                            <div key={i}
                                className="preview-image-holder"
                                style={{
                                    width: '100%', height: '100%',
                                }}>
                                <img
                                    className="preview-image"
                                    style={{
                                        position: 'relative',
                                        top: '50%',
                                        transform: 'translateY(-50%)'
                                    }}
                                    src={img}
                                    width="100%"
                                />
                            </div>
                        )}

                    </div>

                    <div className="image-timer">
                        <div className="timer-ticker" ref={timerTickerRef} />
                    </div>

                </div>
                <div className="info-area_">

                    {/* Property Info */}
                    <div className="addr_">
                        <div className="addr1">
                            {getAddressLine()}
                        </div>
                        <div className="addr2">
                            {getStateAndZip()}
                        </div>
                    </div>
                    {/* Price Area */}
                    <div className="price-range">
                        <div className="price_">{getPriceRange()}</div> <div>/month</div>
                    </div>

                    <div>
                        <div className="property-tags_">
                            {
                                summary && summary.property && summary.property.details
                                && function () {
                                    let tags: any[] = [];
                                    let details: PropertyDetails = summary.property.details;

                                    let i = 0;
                                    if (details.furnished) {
                                        tags.push(<div className="tag_" key={i}>Furnished</div>);
                                        ++i;
                                    }
                                    if (details.has_washer) {
                                        tags.push(<div className="tag_" key={i}>Washer</div>);
                                        ++i;
                                    }
                                    if (details.has_heater) {
                                        tags.push(<div className="tag_" key={i}>Heating</div>);
                                        ++i;
                                    }
                                    if (details.has_ac) {
                                        tags.push(<div className="tag_" key={i}>AC</div>);
                                        ++i;
                                    }

                                    return tags;
                                }()
                            }
                        </div>
                    </div>

                    <div className="extra-info">
                        <div>
                            {summary == null ? '' : `${summary.landlord.first_name} ${summary.landlord.last_name}`}
                        </div>
                        <div>
                            {summary && summary.leases.map((l: LeaseAndAvailability) => l.able_to_lease).length} Rooms available to lease
                        </div>
                        <div>
                            {getReviewCount()} Reviews
                        </div>
                    </div>

                    {/* Ratings Area */}
                    <div className="property-ratings">

                        <div className="ratings_">
                            <div className="header">Property Score</div>
                            <div>
                                <Rate character={<BiHealth />} disabled value={getAveragePropertyReviewScale() * 5} />
                            </div>
                            <div>of 0 Reviews</div>

                        </div>
                        <div className="ratings_">
                            <div className="header">Landlord Score</div>
                            <div>
                                <Rate character={<BiHealth />} disabled value={getAverageLandlordReviewScale() * 5} />
                            </div>
                            <div>of 0 Reviews</div>
                        </div>

                    </div>

                </div>

            </div>

        </div>

        {/* Interest Area */}
        {summary && summary.leases.length > 0 && <div className="property-interest-area">
            <div className="main-section">
                <div>
                    <div style={{ fontWeight: 600 }}>There are {summary.leases.length} rooms available to lease.</div>
                </div>
            </div>

            {/* Interests go here */}
            {summary && summary.leases && summary && summary.leases.length > 0
                && <div className="potential-property-interest-header">
                    <div className="room-number">Room</div>
                    <div className="price-per-month">Price Per Month</div>
                    <div className="date-start">Lease Start Date</div>
                    <div className="date-end">Lease End Date</div>
                    <div className="request-lease-button-area" />
                </div>}
            {summary && summary.leases
                && summary.leases.map((lease_av: LeaseAndAvailability, i: number) => {
                    let lease: Lease = lease_av.lease;
                    return (<div className={`potential-property-interest ${i == summary.leases.length - 1 ? 'last-child' : ''}`} key={i}>
                        <div className="room-number">Room {i + 1}</div>
                        <div className="price-per-month">${lease.price_per_month}/month</div>
                        <div className="date-start">{dateAbbr(new Date(lease.lease_availability_start_date ? lease.lease_availability_start_date : ''))}</div>
                        <div className="date-end">{dateAbbr(new Date(lease.lease_availability_end_date ? lease.lease_availability_end_date : ''))}</div>
                        <div className="request-lease-button-area">
                            {alreadyInterested(lease) &&
                                <Button
                                    text="Request Pending"
                                    textColor="white"
                                    background="#6AD68B"
                                    bold={true}
                                    transformDisabled={true}
                                    onClick={() => { }}
                                />}
                            {!alreadyInterested(lease) &&
                                <div>
                                    {lease_av.able_to_lease && <Button
                                        text="Request Lease"
                                        textColor="white"
                                        background="#3B4353"
                                        bold={true}
                                        transformDisabled={true}
                                        onClick={() => {
                                            ExpressInterest({
                                                variables: {
                                                    student_id: user && user.user ? user.user._id : "",
                                                    lease_id: lease._id
                                                }
                                            })
                                        }}
                                    />}
                                    {!lease_av.able_to_lease && <Button
                                        text="Unable to Lease"
                                        disabled={true}
                                        textColor="white"
                                        background="#ccc"
                                        transformDisabled={true}
                                    />}
                                </div>
                            }
                        </div>
                    </div>);
                })}
        </div>}

        {/* Reviews Area */}
        <div style={{
            width: '90%',
            margin: '0 auto',
            marginTop: `30px`,
        }}>
            <div style={{ fontFamily: 'khumbh-sans', fontWeight: 600 }}>Student Reviews</div>
            {/* Tab Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <Tabs
                        activeTab={reviewView == 'property' ? 0 : 1}
                        tabs={["Property", "Landlord"]}
                        onChange={(tab_ind: number) => {
                            if (tab_ind == 0) setReviewView('property');
                            else setReviewView('landlord');
                        }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div>{getOrderSelect()}</div>
                    {canAddReviewResponse
                        && canAddReviewResponse.canAddReview
                        && canAddReviewResponse.canAddReview.success == true
                        && <div style={{ marginLeft: `10px` }}><Button
                            text={canAddReviewResponse.canAddReview.data
                                && canAddReviewResponse.canAddReview.data.value == 2 ? "Write A Review" : "Edit Your Review"}
                            background="#E0777D"
                            textColor="white"
                            bold={true}
                            transformDisabled={true}
                            onClick={() => {
                                setActiveUserReviewState();
                                setShowAddReview(true);
                            }}
                        /></div>}
                </div>
            </div>

            <div style={{ marginBottom: `50px` }}>
                {function () {
                    let reviews: any[] = [];

                    if (summary) {
                        for (let i = 0; i < summary.leases.length; ++i) {
                            if (summary.leases[i].lease.lease_history == undefined) continue;

                            for (let j = 0; j < summary.leases[i].lease.lease_history.length; ++j) {

                                if (reviewView == 'landlord') {
                                    if (summary.leases[i].lease.lease_history[j].review_of_landlord == undefined) continue;

                                    reviews.push({
                                        date: new Date(summary.leases[i].lease.lease_history[j].end_date),
                                        dom: <ReviewResponse
                                            key={i}
                                            lease_history={summary.leases[i].lease.lease_history[j]}
                                            reviewFor={reviewView}
                                        />
                                    })
                                }

                                else if (reviewView == 'property') {
                                    if (summary.leases[i].lease.lease_history[j].review_of_property == undefined) continue;

                                    reviews.push({
                                        date: new Date(summary.leases[i].lease.lease_history[j].end_date),
                                        dom: <ReviewResponse
                                            key={i}
                                            lease_history={summary.leases[i].lease.lease_history[j]}
                                            reviewFor={reviewView}
                                        />
                                    })
                                }

                            }
                        } // out of for loop
                    }

                    // sort the reviews.
                    if (reviews.length > 0) {
                        reviews.sort((a: any, b: any): number => {
                            if (reviewView == 'property') {
                                if (reviewOrder.property == 'most-recent') return a.date > b.date ? 1 : -1;
                                else return a.date < b.date ? 1 : -1;
                            }
                            if (reviewView == 'landlord') {
                                if (reviewOrder.landlord == 'most-recent') return a.date > b.date ? 1 : -1;
                                else return a.date < b.date ? 1 : -1;
                            }

                            // no sort mode selected...
                            return 0;
                        });
                        return reviews.map((data: any) => data.dom);
                    }
                    // put Empty placeholder
                    else {
                        reviews.push(<div key={-1}>
                            <Empty description="No reviews for this property yet" />
                        </div>);
                    }

                    return reviews;
                }()}
            </div>

        </div>

    </ViewWrapper>)
}


const ReviewResponse = ({ lease_history, reviewFor }: { lease_history: LeaseHistory, reviewFor: 'landlord' | 'property' }) => {

    return (<div className="review-response-container">

        <div className='review-box'>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: `5px` }}>
                <div style={{ fontWeight: 600 }}>Leased {new Date(lease_history.end_date).getFullYear()}</div>
                <div>
                    <Rate
                        character={<BiHealth />}
                        disabled value={
                            reviewFor == 'property' ?
                                lease_history.review_of_property!.rating * 5
                                : lease_history.review_of_landlord!.rating * 5
                        } />
                </div>
            </div>
            <div className="review_">
                {reviewFor == 'property' ? lease_history.review_of_property!.review : lease_history.review_of_landlord!.review}

                {reviewFor == 'property' &&
                    <div className="review_images">
                        {lease_history.property_images.map((img_info: any, i: number) =>
                            <div key={i} className="review-image-holder"><img /></div>)}
                    </div>}
            </div>

            {lease_history.review_of_property!.response != undefined &&
                <div className="response_">
                    <div style={{ fontWeight: 600 }}>Response from Landlord</div>
                    {reviewFor == 'property'
                        ?
                        <div className="review_">
                            {lease_history.review_of_property!.response}
                        </div>
                        : <div className="review_">
                            {lease_history.review_of_landlord!.response}
                        </div>
                    }
                </div>
            }
        </div>

    </div>)
}

export default StudentPropertyInfoView;