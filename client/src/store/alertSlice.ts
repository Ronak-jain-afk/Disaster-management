import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../services/api';
import { Alert } from '../types';

interface AlertState {
  alerts: Alert[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: AlertState = {
  alerts: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/alerts');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch alerts');
    }
  }
);

export const markAlertRead = createAsyncThunk(
  'alerts/markRead',
  async (alertId: string, { rejectWithValue }) => {
    try {
      const response = await api.put(`/alerts/${alertId}/read`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
    }
  }
);

const alertSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addAlert(state, action: PayloadAction<Alert>) {
      state.alerts.unshift(action.payload);
      state.unreadCount += 1;
    },
    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAlerts.fulfilled, (state, action: PayloadAction<Alert[]>) => {
        state.loading = false;
        state.alerts = action.payload;
        state.unreadCount = action.payload.filter((a) => {
          const userId = localStorage.getItem('userId');
          return !a.readBy?.some((r) => r.user === userId);
        }).length;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(markAlertRead.fulfilled, (state, action) => {
        const alert = state.alerts.find((a) => a._id === action.payload._id);
        if (alert) {
          alert.readBy = action.payload.readBy;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
  },
});

export const { addAlert, setUnreadCount } = alertSlice.actions;
export default alertSlice.reducer;
