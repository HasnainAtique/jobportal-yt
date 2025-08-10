import React, { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant'

const CategoryCarousel = () => {
    const [industries, setIndustries] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (industry) => {
        dispatch(setSearchedQuery(industry));
        navigate(`/browse?industry=${encodeURIComponent(industry)}`);
    };


    useEffect(() => {
        const fetchIndustries = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get`);
                const jobs = res.data.jobs || [];
                const industryList = [...new Set(jobs.map(job => job.title).filter(Boolean))];
                setIndustries(industryList);
            } catch (error) {
                console.error("Error fetching industries", error);
            }
        };

        fetchIndustries();
    }, []);

    return (
        <div>
            <Carousel className="w-full max-w-xl mx-auto my-20">
                <CarouselContent>
                    {industries.map((industry, index) => (
                        <CarouselItem
                            key={index}
                            className="md:basis-1/2 lg:basis-1/3"
                        >
                            <Button
                                onClick={() => searchJobHandler(industry)}
                                variant="outline"
                                className="rounded-full"
                            >
                                {industry}
                            </Button>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
};

export default CategoryCarousel;
