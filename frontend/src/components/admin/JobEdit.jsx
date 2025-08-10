import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { COMPANY_API_END_POINT} from '@/utils/constant'
const JobEdit = () => {
  const [input, setInput] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    position: 0,
    company: '',
  });

  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  // ✅ Fetch companies from backend
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get`);
        if (res.data && res.data.companies) {
          setCompanies(res.data.companies);
        } else {
          toast.error('No companies found from API');
        }
      } catch (error) {
        toast.error('Failed to fetch companies');
      }
    };
    fetchCompanies();
  }, []);

  // ✅ Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });
        const job = res.data.job;
        setInput({
          title: job.title || '',
          description: job.description || '',
          requirements: job.requirements || '',
          salary: job.salary || '',
          location: job.location || '',
          jobType: job.jobType || '',
          experienceLevel: job.experienceLevel || '',
          position: job.position || 0,
          company: job.company || '',
        });
      } catch (error) {
        toast.error('Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
    setInput({ ...input, company: selectedCompany?._id });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.put(`${JOB_API_END_POINT}/update/${id}`, input, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/admin/jobs');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className='flex items-center justify-center w-screen my-5'>
        <form onSubmit={submitHandler} className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md w-full'>
          <div className='grid grid-cols-2 gap-2'>
            {/* Input fields */}
            {[
              { label: 'Title', name: 'title' },
              { label: 'Description', name: 'description' },
              { label: 'Requirements', name: 'requirements' },
              { label: 'Salary', name: 'salary' },
              { label: 'Location', name: 'location' },
              { label: 'Job Type', name: 'jobType' },
              { label: 'Experience Level (in years)', name: 'experienceLevel' },
            ].map((field) => (
              <div key={field.name}>
                <Label>{field.label}</Label>
                <Input
                  type='text'
                  name={field.name}
                  value={input[field.name]}
                  onChange={changeEventHandler}
                  className='focus-visible:ring-offset-0 focus-visible:ring-0 my-1'
                />
              </div>
            ))}

            <div>
              <Label>No of Positions</Label>
              <Input
                type='number'
                name='position'
                value={input.position}
                onChange={changeEventHandler}
                className='focus-visible:ring-offset-0 focus-visible:ring-0 my-1'
              />
            </div>

            {/* ✅ Company Select */}
            <div>
              <Label>Company</Label>
              {companies.length > 0 ? (
                <Select
                  onValueChange={selectChangeHandler}
                  value={
                    companies.find((c) => c._id === input.company)?.name?.toLowerCase() || ''
                  }
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select a Company' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem
                          key={company._id}
                          value={company.name.toLowerCase()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <p className='text-sm text-red-500 mt-1'>
                  * Please register a company first.
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          {loading ? (
            <Button className='w-full my-4' disabled>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
            </Button>
          ) : (
            <Button type='submit' className='w-full my-4'>
              Update Job
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default JobEdit;
