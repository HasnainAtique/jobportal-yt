import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const [filters, setFilters] = useState({
        Location: [],
        Industry: [],
        Salary: []
    });
    const dispatch = useDispatch();

    useEffect(() => {
        // Jobs API se data lao
        const fetchJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get`, { withCredentials: true });
                const jobs = res.data.jobs || [];
                // Unique locations
                const locations = [...new Set(jobs.map(job => job.location).filter(loc => !!loc))];
                // Unique industries
                const industries = [...new Set(jobs.map(job => job.jobType).filter(ind => !!ind))];
                // Salary ko range me convert karo
                const salaryRanges = jobs.map(job => {
                    const salary = Number(job.salary);
                    if (salary < 40000) return "0-40k";
                    if (salary >= 40000 && salary < 100000) return "40k-1lakh";
                    if (salary >= 100000 && salary < 500000) return "1lakh-5lakh";
                    if (salary >= 500000) return "5lakh+";
                    return "Other";
                });
                const salaries = [...new Set(salaryRanges)];
                setFilters({
                    Location: locations,
                    Industry: industries,
                    Salary: salaries
                });
            } catch (error) {
                // Optionally error handle
            }
        };
        fetchJobs();
    }, []);

    const changeHandler = (value) => {
        setSelectedValue(String(value));
    }
    useEffect(() => {
        dispatch(setSearchedQuery(selectedValue));
    }, [selectedValue, dispatch]);

    return (
        <div className='w-full bg-white p-3 rounded-md'>
            <h1 className='font-bold text-lg'>Filter Jobs</h1>
            <hr className='mt-3' />
            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                {Object.entries(filters).map(([filterType, array]) => (
                    <div key={filterType}>
                        <h1 className='font-bold text-lg'>{filterType}</h1>
                        {array.map((item, idx) => {
                            const itemId = `id-${filterType}-${item}`;
                            return (
                                <div className='flex items-center space-x-2 my-2' key={itemId}>
                                    <RadioGroupItem value={item} id={itemId} />
                                    <Label htmlFor={itemId}>{item}</Label>
                                </div>
                            )
                        })}
                    </div>
                ))}
            </RadioGroup>
        </div>
    )
}

export default FilterCard