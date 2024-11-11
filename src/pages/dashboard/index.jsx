import React, { useEffect, useState } from 'react';
import unnamed from "../../assets/unnamed.jpg";
import EventCard from '../../components/eventcard';
import JobCard from '../../components/jobcard';
import OrganizationCard from '../../components/organizationcard'; // Import the OrganizationCard
import "./style.css";

const Dashboard = () => {
    const [jobData, setJobData] = useState([]);
    const [eventData, setEventData] = useState([]);
    const [organizationData, setOrganizationData] = useState([]);  // State for organizations
    const videos = [
        { id: 1, title: "", url: "https://www.youtube.com/embed/I6qkFNOVebo" },
        { id: 2, title: "", url: "https://www.youtube.com/embed/8q69_gDP9PU" },
        { id: 3, title: "", url: "https://www.youtube.com/embed/Osy2tKV66v8" }
    ];

    useEffect(() => {
        // Fetch job postings with a default location (e.g., 'AB')
        fetch('http://localhost:5000/JobPostings/get_item_by_location?location=AB')
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    // Shuffle and select three random jobs
                    const shuffledJobs = data.sort(() => 0.5 - Math.random());
                    setJobData(shuffledJobs.slice(0, 3));
                }
            });

        // Fetch event postings with a default location (e.g., 'AB')
        fetch('http://localhost:5000/Events/get_item_by_location?location=AB')
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    // Shuffle and select three random events
                    const shuffledEvents = data.sort(() => 0.5 - Math.random());
                    setEventData(shuffledEvents.slice(0, 3));
                }
            });

        // Fetch organization data
        fetch('http://localhost:5000/Organizations/get_item_by_location?location=') // You can replace 'AB' with a dynamic location if needed
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    // Shuffle and select three random organizations
                    const shuffledOrganizations = data.sort(() => 0.5 - Math.random());
                    setOrganizationData(shuffledOrganizations.slice(0, 3));
                }
            });
    }, []);

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="profile-section">
                    <img src={unnamed} alt="Profile" className="profile-picture" />
                    <h1>Welcome Aaryan!</h1>
                </div>
                {/* Divider */}
                <hr className="divider" />
            </div>

            <div className="job-section">
                <h2>Job Postings</h2>
                <div className="job-cards">
                    {jobData.map((job, index) => (
                        <JobCard
                            key={index}
                            Title={job.Title}
                            CompanyName={job.CompanyName}
                            Desc={job.Desc}
                            Location={job.Location}
                            DatePosted={job.DatePosted}
                            Link={job.Link}
                            Image={job.Image}
                        />
                    ))}
                </div>
            </div>

            <div className="event-section">
                <h2>Event Opportunities</h2>
                <div className="event-cards">
                    {eventData.map((event, index) => (
                        <EventCard
                            key={index}
                            Name={event.Name}
                            Location={event.Location}
                            Description={event.Description}
                            Phone={event.Phone}
                            Email={event.Email}
                            Website={event.Website}
                        />
                    ))}
                </div>
            </div>

            <div className="organization-section">
                <h2>Featured Organizations</h2>
                <div className="organization-cards">
                    {organizationData.map((organization, index) => (
                        <OrganizationCard
                            key={index}
                            Name={organization.Name}
                            Location={organization.Location}
                            Description={organization.Description}
                            Phone={organization.Phone}
                            Email={organization.Email}
                            Website={organization.Website}
                        />
                    ))}
                </div>
            </div>

            <div className="video-section">
                <h2>Some Inspiring Videos</h2>
                <div className="video-cards">
                    {videos.map((video) => (
                        <div className="video-card" key={video.id}>
                            <iframe
                                width="100%"
                                height="200"
                                src={video.url}
                                title={video.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                            <p>{video.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
