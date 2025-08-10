import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setSingleCompany } from '@/redux/companySlice';
import { Loader2 } from 'lucide-react';  // import karo spinner icon

const CompanyCreate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        companyName: '',  // backend ka field name match kiya
        description: '',
        website: '',
        location: '',
        file: null
    });

    const [loading, setLoading] = useState(false);  // loading state

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    };

    const registerNewCompany = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('companyName', input.companyName); // backend ke name se match
            formData.append('description', input.description);
            formData.append('website', input.website);
            formData.append('location', input.location);
            if (input.file) {
                formData.append('file', input.file);
            }

            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies`);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-4xl mx-auto">
                <div className="my-10">
                    <h1 className="font-bold text-2xl">Create Your Company</h1>
                    <p className="text-gray-500">Enter all details for your company. You can edit later.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Company Name</Label>
                        <Input
                            type="text"
                            name="companyName" // yaha bhi backend field name
                            value={input.companyName}
                            onChange={changeEventHandler}
                            placeholder="JobHunt, Microsoft etc."
                            className="my-2"
                        />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Input
                            type="text"
                            name="description"
                            value={input.description}
                            onChange={changeEventHandler}
                            placeholder="Short company description"
                            className="my-2"
                        />
                    </div>
                    <div>
                        <Label>Website</Label>
                        <Input
                            type="text"
                            name="website"
                            value={input.website}
                            onChange={changeEventHandler}
                            placeholder="https://example.com"
                            className="my-2"
                        />
                    </div>
                    <div>
                        <Label>Location</Label>
                        <Input
                            type="text"
                            name="location"
                            value={input.location}
                            onChange={changeEventHandler}
                            placeholder="City, Country"
                            className="my-2"
                        />
                    </div>
                    <div>
                        <Label>Logo</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={changeFileHandler}
                            className="my-2"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 my-10">
                    <Button variant="outline" onClick={() => navigate("/admin/companies")} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={registerNewCompany} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                            </>
                        ) : (
                            "Register"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CompanyCreate;
