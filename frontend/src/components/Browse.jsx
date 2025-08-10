import React, { useEffect, useMemo } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { useLocation } from 'react-router-dom';

const Browse = () => {
    useGetAllJobs();
    const { allJobs } = useSelector(store => store.job);
    const dispatch = useDispatch();
    const location = useLocation();

    // Extract query params
    const { industryParam, searchParam } = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return {
            industryParam: params.get("industry"),
            searchParam: params.get("search")
        };
    }, [location.search]);

    // Reset search query on unmount
    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));
        };
    }, [dispatch]);

    // Filter jobs based on query params
    const filteredJobs = useMemo(() => {
        if (industryParam) {
            // Carousel click → strict match
            return allJobs.filter(job => job.title === industryParam);
        }
        if (searchParam) {
            // Search bar → partial match
            return allJobs.filter(job =>
                job.title.toLowerCase().includes(searchParam.toLowerCase())
            );
        }
        return allJobs;
    }, [allJobs, industryParam, searchParam]);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10'>
                <h1 className='font-bold text-xl my-10'>
                    Search Results ({filteredJobs.length})
                    {(industryParam || searchParam) && (
                        <span className="text-gray-500">
                            {" — "}{industryParam || searchParam}
                        </span>
                    )}
                </h1>
                <div className='grid grid-cols-3 gap-4'>
                    {filteredJobs.map((job) => (
                        <Job key={job._id} job={job} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Browse;
