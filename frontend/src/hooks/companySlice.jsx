// src/redux/companySlice.jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';

export const deleteCompanyById = createAsyncThunk(
  'companies/deleteCompanyById',
  async (id, thunkAPI) => {
    try {
      const res = await axios.delete(`${COMPANY_API_END_POINT}/delete/${id}`, {
        withCredentials: true,
      });
      return id; // returning the deleted id to filter from state
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const companySlice = createSlice({
  name: 'companies',
  initialState: {
    companies: [],
    loading: false,
    error: null,
  },
  reducers: {
    setCompanies: (state, action) => {
      state.companies = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteCompanyById.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = state.companies.filter(
          (company) => company._id !== action.payload
        );
      })
      .addCase(deleteCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCompanies } = companySlice.actions;
export default companySlice.reducer;
export { deleteCompanyById }; // ✅ this line ensures the export is available
