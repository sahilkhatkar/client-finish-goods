import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch and filter Google Sheets data by brand
// sheetSlice.js
export const fetchSheetData = createAsyncThunk(
  'sheet/fetchSheetData',
  async (brand, thunkAPI) => {
    try {
      const res = await fetch(`/api/fetch-sheet-data?brand=${brand}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch');

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch sheet data');
    }
  }
);


const sheetSlice = createSlice({
  name: 'sheet',
  initialState: {
    sheetData: [],
    loading: false,
    error: null,
  },

  reducers: {
    setSheetData: (state, action) => {
      state.sheetData = action.payload;
      state.error = null;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearSheetData: (state) => {
      state.sheetData = [];
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSheetData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSheetData.fulfilled, (state, action) => {
        state.loading = false;
        state.sheetData = action.payload;
      })
      .addCase(fetchSheetData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSheetData, setLoading, setError, clearSheetData, } = sheetSlice.actions;

export default sheetSlice.reducer;
