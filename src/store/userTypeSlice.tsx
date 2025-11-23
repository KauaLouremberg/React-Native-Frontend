import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  responsavel_id: null,
  amparado_id: null
};

const userTypeSlice = createSlice({
  name: 'userType',
  initialState,
  reducers: {
    setUserType: (state, action) => {
      const { responsavel_id, amparado_id } = action.payload;
      state.responsavel_id = responsavel_id
      state.amparado_id = amparado_id
    },
    clearUserType: (state) => {
      state.responsavel_id = null;
      state.amparado_id = null;
    },
  },
});

export const { setUserType, clearUserType } = userTypeSlice.actions;
export default userTypeSlice;
