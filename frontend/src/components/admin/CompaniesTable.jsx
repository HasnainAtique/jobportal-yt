import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, MoreHorizontal, Trash2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { setCompanies } from '@/redux/companySlice';

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const filteredCompany = companies?.filter((company) => {
            if (!searchCompanyByText) return true;
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this company?")) {
            try {
                const res = await axios.delete(`${COMPANY_API_END_POINT}/${id}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    // Remove deleted company from Redux state
                    const updatedCompanies = companies.filter((company) => company._id !== id);
                    dispatch(setCompanies(updatedCompanies));
                }
            } catch (error) {
                console.error("Delete failed:", error);
                alert("Something went wrong while deleting the company.");
            }
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>A list of your recently registered companies11</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Logo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterCompany?.map((company) => (
                            <TableRow key={company._id}>
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage src={company.logo} />
                                    </Avatar>
                                </TableCell>
                                <TableCell>{company.name}</TableCell>
                                <TableCell>{company.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                        <PopoverContent className="w-32 space-y-2">
                                            <div onClick={() => navigate(`/admin/companies/${company._id}`)} className='flex items-center gap-2 cursor-pointer hover:text-blue-600'>
                                                <Edit2 className='w-4' />
                                                <span>Edit</span>
                                            </div>
                                            <div onClick={() => handleDelete(company._id)} className='flex items-center gap-2 cursor-pointer hover:text-red-600'>
                                                <Trash2 className='w-4' />
                                                <span>Delete</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    );
};

export default CompaniesTable;
