import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  responsavel_id: null,
  responsavel_name: null,
  amparado_id: null,
  amparado_name: null
};

const userTypeSlice = createSlice({
  name: 'userType',
  initialState,
  reducers: {
    setUserType: (state, action) => {
      const { responsavel_id, amparado_id, responsavel_name, amparado_name } = action.payload;
      state.responsavel_id = responsavel_id
      state.responsavel_name = responsavel_name;
      state.amparado_id = amparado_id
      state.amparado_name = amparado_name;
    },
    clearUserType: (state) => {
      state.responsavel_id = null;
      state.responsavel_name = null;
      state.amparado_id = null;
      state.amparado_name = null;
    },
  },
});

export const { setUserType, clearUserType } = userTypeSlice.actions;
export default userTypeSlice;
