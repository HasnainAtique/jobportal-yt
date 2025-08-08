// Profile.js - Updated component
import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen, Download, Eye } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    const hasResume = user?.profile?.resume;
    const skills = user?.profile?.skills || [];

    // ✅ Handle PDF viewing from Base64
    const handleViewResume = () => {
        if (user?.profile?.resume) {
            // Create blob from base64 data
            const byteCharacters = atob(user.profile.resume.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            
            // Create URL and open in new tab
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
            
            // Clean up URL after opening
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
    };

    // ✅ Handle PDF download from Base64
    const handleDownloadResume = () => {
        if (user?.profile?.resume) {
            // Create download link
            const link = document.createElement('a');
            link.href = user.profile.resume; // Base64 data URI
            link.download = user.profile.resumeOriginalName || 'resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage
                                src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
                                alt="profile"
                            />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullname}</h1>
                            <p>{user?.profile?.bio}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right" variant="outline">
                        <Pen />
                    </Button>
                </div>

                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{user?.phoneNumber}</span>
                    </div>
                </div>

                <div className='my-5'>
                    <h1>Skills</h1>
                    <div className='flex flex-wrap items-center gap-2'>
                        {
                            skills.length > 0
                                ? skills.map((item, index) => <Badge key={index}>{item}</Badge>)
                                : <span>NA</span>
                        }
                    </div>
                </div>

                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold">Resume</Label>
                    {
                        hasResume ? (
                            <div className="flex gap-2 items-center">
                                <Button
                                    onClick={handleViewResume}
                                    variant="outline"
                                    size="sm"
                                    className='text-blue-500 hover:text-blue-700'
                                >
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                </Button>
                                <Button
                                    onClick={handleDownloadResume}
                                    variant="outline"
                                    size="sm"
                                    className='text-green-500 hover:text-green-700'
                                >
                                    <Download className="w-4 h-4 mr-1" />
                                    Download
                                </Button>
                                {user?.profile?.resumeSize && (
                                    <span className="text-sm text-gray-500">
                                        ({Math.round(user.profile.resumeSize / 1024)}KB)
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span>NA</span>
                        )
                    }
                </div>
            </div>

            <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                <AppliedJobTable />
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
};

export default Profile;