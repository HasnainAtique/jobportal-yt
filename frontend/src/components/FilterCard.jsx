import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'

export const salaryOptions = [
    { label: "0-40k", min: 0, max: 40000 },
    { label: "40k-1lakh", min: 40000, max: 100000 },
    { label: "1lakh-5lakh", min: 100000, max: 500000 },
    { label: "5lakh+", min: 500000, max: Infinity }
];

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const [filters, setFilters] = useState({
        Location: [],
        Industry: [],
        Salary: []
    });
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Public route ke liye credentials mat bhejo
                const res = await axios.get(`${JOB_API_END_POINT}/get`);
                const jobs = res.data.jobs || [];
                const locations = [...new Set(jobs.map(job => job.location).filter(loc => !!loc))];
                const industries = [...new Set(jobs.map(job => job.title).filter(title => !!title))];
                setFilters({
                    Location: locations,
                    Industry: industries,
                    Salary: salaryOptions.map(opt => opt.label)
                });
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
            }
        };
        fetchJobs();
    }, []);


    const changeHandler = (value) => {
        setSelectedValue(String(value));
    };

    useEffect(() => {
        dispatch(setSearchedQuery(selectedValue));
    }, [selectedValue, dispatch]);

    const handleClear = () => {
        setSelectedValue('');
        dispatch(setSearchedQuery(''));
    };

    const filterDisplayNames = {
        Location: "Location",
        Industry: "Industry",
        Salary: "Salary"
    };

    return (
        <div className='w-full bg-white p-3 rounded-md'>
            <div className="flex items-center justify-between">
                <h1 className='font-bold text-lg'>Filter Jobs</h1>
                {selectedValue && (
                    <button
                        onClick={handleClear}
                        className='text-sm text-blue-600 hover:underline'
                    >
                        Clear Filter
                    </button>
                )}
            </div>
            <hr className='mt-3' />
            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                {Object.entries(filters).map(([filterType, array]) => (
                    <div key={filterType}>
                        <h1 className='font-bold text-lg mt-4'>{filterDisplayNames[filterType] || filterType}</h1>
                        {array.map((item) => {
                            const itemId = `id-${filterType}-${item}`;
                            return (
                                <div className='flex items-center space-x-2 my-2' key={itemId}>
                                    <RadioGroupItem value={item} id={itemId} />
                                    <Label htmlFor={itemId}>{item}</Label>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
};

export default FilterCard;
