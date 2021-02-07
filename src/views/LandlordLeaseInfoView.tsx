import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import { Menu, Dropdown, Button as AntButton, Popover, Select, Tag, Empty } from 'antd';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';
import {useHistory} from 'react-router';
import {Link} from 'react-router-dom';
import { Viewer, Worker } from '@react-pdf-viewer/core';

import {objectURI} from '../API/S3API'
import ViewWrapper from '../components/ViewWrapper'
import Button from '../components/toolbox/form/Button'
import {ReduxState} from '../redux/reducers/all_reducers'
import {
    useGetLeaseSummaryLazyQuery,
    useAcceptOrDeclineStudentInterestMutation,
    Lease,
    StudentInterest,
    Student,
    Institution,
    Property,
    LeaseDocument
} from '../API/queries/types/graphqlFragmentTypes'
import '@react-pdf-viewer/core/lib/styles/index.css'

const { Option } = Select;

const data = [
    {
      name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
    },
    {
      name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
    },
    {
      name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
    },
    {
      name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
    },
    {
      name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
    },
    {
      name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
    },
    {
      name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
    },
  ];    

/**
 * This view shows information for each individual leases
 */
const LandlordLeaseInfoView = ({
    property_id,
    lease_id
}: {
    property_id: string
    lease_id: string
}) => {

    //============== GRAPHQL ==============
    const [GetLeaseSummary, {data: leaseSummaryResponse}] = useGetLeaseSummaryLazyQuery();
    
    //============== STATE ==============
    const user = useSelector((state: ReduxState) => state.user);
    const [roomNo, setRoomNo] = useState<number>(-2);
    const [property, setProperty] = useState<Property | null>(null);
    const [lease, setLease] = useState<Lease | null>(null);
    const [leaseDoc, setLeaseDoc] = useState<LeaseDocument | null>(null);
    const [students, setStudents] = useState<{[key: string]: Student}>({});
    const [institution, setInstitution] = useState<{[key: string]: Institution}>({});
    const [showDoc, setShowDoc] = useState<boolean>(false);

    //============== HOOKS ==============
    const history = useHistory();
    
    //============== EFFECTS ==============
    useEffect(() => {
        // get the lease summary
        GetLeaseSummary({
            variables: {
                lease_id
            }
        });
    }, []);

    useEffect(() => {
        if (leaseSummaryResponse && leaseSummaryResponse.getLeaseSummary) {
            if (leaseSummaryResponse.getLeaseSummary.error 
                || !leaseSummaryResponse.getLeaseSummary.success
                || !leaseSummaryResponse.getLeaseSummary.data) {
                // go to dashboard ...
                history.push('/');
            }

            // if the lease is inactive ... got to dashboard
            // (only show information for active leases)
            else if (
                !leaseSummaryResponse.getLeaseSummary.data.lease.active
            ) {
                history.push('/');
            }

            // extrapolate the information into state
            else {
                setLease(leaseSummaryResponse.getLeaseSummary.data.lease);
                setProperty(leaseSummaryResponse.getLeaseSummary.data.property);
                setRoomNo(leaseSummaryResponse.getLeaseSummary.data.room_no);

                if (leaseSummaryResponse.getLeaseSummary.data.lease_doc) 
                    setLeaseDoc(leaseSummaryResponse.getLeaseSummary.data.lease_doc);
                

                // get the students
                let students_: {[key: string]: Student} = {};
                for (let i = 0; i < leaseSummaryResponse.getLeaseSummary.data.students.length; ++i) {
                    students_[leaseSummaryResponse.getLeaseSummary.data.students[i]._id] = leaseSummaryResponse.getLeaseSummary.data.students[i];
                }
                setStudents(students_);

                // get the institutions
                let inst_: {[key: string]: Institution} = {};
                for (let i = 0; i < leaseSummaryResponse.getLeaseSummary.data.institutions.length; ++i) {
                    inst_[leaseSummaryResponse.getLeaseSummary.data.institutions[i]._id] = leaseSummaryResponse.getLeaseSummary.data.institutions[i];
                }
                setInstitution(inst_);
            }
        }
    }, [leaseSummaryResponse]);
    
    //============== FUNCTIONS ==============
    const addrStr = (property: Property): string => {
        let addr: string = `${property.address_line}, `;
        if (property.address_line_2) {
            addr += `${property.address_line_2}, `;
        }
        addr += `${property.city} ${property.state}, ${property.zip}`;

        return addr;
    }

    const dateStr = (iso: string | undefined) : string => {
        if (iso == undefined) return "";
        let date: Date = new Date(iso);
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }

    /**
     * Get the StudentInterest documents that do not have
     * an accepted value yet (undecided).
     */
    const getUndecidedInterested = (lease: Lease): StudentInterest[] => {
        return lease.student_interests.filter((interest: StudentInterest) => 
            interest.accepted == undefined);
    }

    //============== RENDER ==============
    return (<ViewWrapper>
        <div>

            {/* Title */}
            <div>
                <div className="section-header-2" style={{
                    alignItems: `center`
                }}>
                    <div className="title-area">Lease</div>
                </div>
            </div>


            {/* Content */}
            <div className="lease-contents">
                <div className="graph-area">

                    {lease != undefined 
                    && lease.priority == undefined
                    && <div className="container_">
                        <div className="body flex space-between align-center">
                            <div className="left">
                                Want to increase your engagement for this lease?
                            </div>
                            <div className="right" style={{width: `200px`, minWidth: `200px`}}>
                                <Button 
                                    text="Get Boost"
                                    textColor="white"
                                    background="#E0777D"
                                    bold={true}
                                    transformDisabled={true}
                                />
                            </div>
                        </div>
                    </div>}
                    
                    <div className="container_">
                        <div className="title">Statistics</div>
                        <div className="body">
                            
                            {/* 
                                Statistics Controller 
                                ======================
                                Choose which statistics graph to show:
                                    1. Student views
                                    2. Student Clicks
                                    3. Student Interests
                                Choose what time range to show from:
                                    1. 7 Days
                                    2. Month
                                    3. 3-Month
                                    4. 6-Month
                                    6. Year
                                    7. All-Time
                            */}
                            <div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <div style={{
                                        marginBottom: `10px`
                                    }}>
                                        <div
                                            style={{
                                                fontWeight: 600,
                                                fontSize: `1rem`,
                                                display: `flex`
                                            }}
                                        >{property && addrStr(property)}
                                            <div style={{
                                                marginLeft: `8px`,
                                            }}>
                                                <Link to={`/landlord/property/${property_id}`}>Go to property</Link> 
                                            </div>
                                        </div>
                                        <div>Room {roomNo}</div>
                                    </div>
                                    
                                    <div>
                                        <div style={{fontWeight: 600}}>Lease Availble</div>
                                        <div style={{
                                            display: 'flex'
                                        }}>
                                            <div className="date-container">
                                                <div style={{fontSize: `0.6rem`}}>From</div>
                                                <div>{dateStr(lease?.lease_availability_start_date || undefined)}</div>
                                            </div>
                                            <div className="date-container">
                                                <div style={{fontSize: `0.6rem`}}>To</div>
                                                <div>{dateStr(lease?.lease_availability_end_date || undefined)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="lease-graph-controls">
                                    <div className="ctrl">
                                        <Select defaultValue="views" style={{ width: 120 }} onChange={(option: string) => {
                                            // todo handle select 
                                        }}>
                                            <Option value="views">Views</Option>
                                            <Option value="clicks">Clicks</Option>
                                            <Option value="interests">Interests</Option>
                                        </Select>
                                    </div>
                                    <div className="ctrl">
                                        <Select defaultValue="month" style={{ width: 120 }} onChange={(option: string) => {
                                            // todo handle select 
                                        }}>
                                            <Option value="seven-days">7 Days</Option>
                                            <Option value="1-month">Month</Option>
                                            <Option value="3-months">3-Months</Option>
                                            <Option value="6-months">6-Months</Option>
                                            <Option value="1-year">Year</Option>
                                            <Option value="all-time">All Time</Option>
                                        </Select>
                                    </div>
                                </div>

                                {/* Chart */}
                                <div style={{
                                    display: 'flex',
                                    flexWrap: `wrap`,
                                    marginTop: `20px`
                                }}>
                                    <div style={{width: `600px`}}>
                                        <LineChart
                                            width={600}
                                            height={300}
                                            data={data}
                                            margin={{
                                            top: 5, right: 30, left: 20, bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                                            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                                        </LineChart>
                                    </div>
                                    <div>
                                        Details about the statistics go here.
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>

                    <div className="container_">
                        <div className="title">Lease Document</div>
                        <div className="body">

                            {/* 
                                Technically we don't allow uploading null lease document,
                                but for the sake of completeness, show an empty container 
                            */}
                            {leaseDoc == null && 
                            <div style={{marginTop: `15px`, marginBottom: `15px`}}>
                                <Empty
                                        description={
                                        <span>
                                            No lease documnt uploaded.
                                        </span>
                                        }
                                    >
                                    </Empty>   
                            </div>}
                            {leaseDoc != null &&
                            <div>

                                {/* Header */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: `space-between`,
                                    alignItems: `center`
                                }}>
                                    <div style={{display: `flex`}}>
                                        <div style={{fontWeight: 600, marginRight: `6px`}}>Name</div>
                                        <div>{leaseDoc.lease_name}</div> 
                                    </div>  
                                    <div style={{display: `flex`}}>
                                        <AntButton
                                            onClick={() => {
                                                if (!leaseDoc || leaseDoc.documents.length == 0) return;
                                                setShowDoc(!showDoc);
                                            }}
                                        >
                                            {showDoc ? "Collapse Lease Document" : "View Lease Document"}
                                        </AntButton>
                                    </div>  
                                </div>   

                                {/* TODO: Content goes here */}
                                {leaseDoc != null 
                                && showDoc 
                                && leaseDoc.documents.length > 0
                                &&
                                <div>
                                    <Worker 
                                        // workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js"
                                        workerUrl={`../modules/pdfjs/pdfjs-dist@2.6.347-pdf.js`}
                                    >
                                        <Viewer fileUrl={objectURI(leaseDoc.documents[0].s3_key)} />
                                    </Worker>
                                </div>}

                            </div>}
                        </div>
                    </div>

                </div>
                <div className="interests-area">

                    
                    <div className="container_">
                        <div className="title">Student Interests</div>
                        <div className="body">

                            <div>
                                See the students who have expressed interest in this lease.
                            </div>

                            {function () {
                                if (lease == null || lease.student_interests.length == 0) return (<div style={{
                                    marginTop: `15px`
                                }}>
                                    <Empty
                                        description={
                                        <span>
                                            No interests yet
                                        </span>
                                        }
                                    >
                                    </Empty>
                                </div>);
                                else {
                                    return /*getUndecidedInterested(lease)*/lease.student_interests
                                        .filter((interest: StudentInterest) => {
                                            // filter out the documents where the student cant be found
                                            // or the institution cant be found
                                            if (!Object.prototype.hasOwnProperty.call(students, interest.student_id))
                                                return false;
                                            
                                            let student_: Student = students[interest.student_id];
                                            if (student_.auth_info == undefined || student_.auth_info == null) return false;
                                            if (student_.auth_info.institution_id == undefined || student_.auth_info.institution_id == null)
                                                return false;

                                            if (!Object.prototype.hasOwnProperty.call(institution, student_.auth_info.institution_id)) 
                                                return false;
                                            return true;
                                        })
                                        .map((interest: StudentInterest, i: number) => {
                                        let student_: Student = students[interest.student_id];
                                        let institution_: Institution = institution[student_.auth_info!.institution_id!];
                                        return (<StudentInterestInfo
                                            lease_id={lease_id}
                                            key={i}
                                            status={interest.accepted}
                                            student={student_}
                                            institution={institution_}
                                            onUpdate={(lease: Lease) => {
                                                setLease(lease);
                                            }}
                                        />)
                                    });
                                }
                            }()}

                        </div>
                    </div>

                </div>
            </div>

        </div>
    </ViewWrapper>)
}

const StudentInterestInfo = ({
    student, institution, lease_id, status, onUpdate
}: {student: Student, onUpdate: (lease: Lease) => void, institution: Institution, status: boolean | undefined | null, lease_id: string }) => {

    const [AcceptOrDeclineStudentInterest, {data: studentInterestUpdateResponse}] = useAcceptOrDeclineStudentInterestMutation();

    useEffect(() => {
        if (studentInterestUpdateResponse
            && studentInterestUpdateResponse.acceptOrDeclineStudentInterest
            && studentInterestUpdateResponse.acceptOrDeclineStudentInterest.data) {
                // update the lease
                onUpdate(studentInterestUpdateResponse.acceptOrDeclineStudentInterest.data);
            }
    }, [studentInterestUpdateResponse]);

    const getOverlayMenu = () => {
        return (<Menu>
            <Menu.Item>
              <a>
                Get Contact
              </a>
            </Menu.Item>
            <Menu.Item>
              <div 
                style={{cursor: `pointer`}}
                onClick={() => {
                    AcceptOrDeclineStudentInterest({
                        variables: {
                            action: 'accept',
                            student_id: student._id,
                            lease_id
                        }
                    });
              }}>
                Accept
              </div>
            </Menu.Item>
            <Menu.Item>
            <div 
                style={{cursor: `pointer`}}
                onClick={() => {
                    AcceptOrDeclineStudentInterest({
                        variables: {
                            action: 'decline',
                            student_id: student._id,
                            lease_id
                        }
                    });
              }}>
                Decline
              </div>
            </Menu.Item>
          </Menu>)
    }

    return (<div className="student-interest">
        <div className="college-logo">
            <img 
                width={`100%`}
                height={`100%`}
                src={objectURI(institution.s3_thumb_key || ``)}
            />
        </div>
        <div className="student-name">
            <div>{student.first_name} {student.last_name}</div>
            <div style={{
                fontSize: `0.75rem`
            }}>{institution.name}</div>
        </div>
        <div className="actions-area">
            {(status == undefined || status == null)
            && <Dropdown overlay={getOverlayMenu()} placement="bottomLeft" arrow>
                <AntButton>Actions</AntButton>
                {/* <Button 
                    text="Actions"
                    textColor="white"
                    background="#E0777D"
                    bold={true}
                    transformDisabled={true}
                /> */}
            </Dropdown>}
            {status != undefined && status != null && status == true
            && <div>
                <Popover
                    placement="bottom"
                    content={<div>
                        <div>You have accepted this student's request for this lease.</div>
                        <div>You will be informed if they choose to take up the offer.</div>
                    </div>}>
                    <Tag color="#87d068">Lease Request Sent</Tag>
                </Popover>
            </div>}
            {status != undefined && status != null && status == false
            && <div>
                <Popover 
                     placement="bottom"
                    content={<div>
                        <div>You have declined this student the opportunity to</div>
                        <div>take this lease.</div>
                    </div>}>
                    <Tag color="#c73413">Lease Request Declined</Tag>
                </Popover>
            </div>}
        </div>
    </div>)
}

export default LandlordLeaseInfoView;