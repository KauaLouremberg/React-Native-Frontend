import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  nome: '',
  is_amparado: false,
  token: null,
  has_perfil: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      Object.assign(state, action.payload);
    },
    clearUser: (state) => {
      state.id = null;
      state.nome = '';
      state.token = null;
      state.is_amparado = false;
      state.has_perfil = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice;
