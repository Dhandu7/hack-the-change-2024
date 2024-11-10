import React, { useEffect, useState } from 'react';
import JobCard from '../../components/jobcard';
import './style.css';

const Employment = () => {
  const [jobData, setJobData] = useState([]);
  const [value, setValue] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/get_item_by_location?location=${value === '' ? 'AB' : value}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setJobData([]);
        } else {
          setJobData(data);
        }
      });
  }, [value]);

  const handleChange = (event) => {
    setValue(event.target.value);
  }

  return (
    <div className="employment-container">
      <input type="text" value={value} onChange={handleChange} />

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
  );
};

export default Employment;
