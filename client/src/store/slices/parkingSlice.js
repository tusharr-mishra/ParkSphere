import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  facilities: [],
  selectedFacility: null,
  searchFilter: {
    city: '',
    vehicleType: 'ALL',
    isEV: false,
    sortBy: 'price',
  },
  loading: false,
  error: null,
};

export const parkingSlice = createSlice({
  name: 'parking',
  initialState,
  reducers: {
    setFacilities: (state, action) => {
      state.facilities = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedFacility: (state, action) => {
      state.selectedFacility = action.payload;
    },
    setSearchFilter: (state, action) => {
      state.searchFilter = { ...state.searchFilter, ...action.payload };
    },
    setParkingLoading: (state, action) => {
      state.loading = action.payload;
    },
    setParkingError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setFacilities,
  setSelectedFacility,
  setSearchFilter,
  setParkingLoading,
  setParkingError,
} = parkingSlice.actions;
export default parkingSlice.reducer;
