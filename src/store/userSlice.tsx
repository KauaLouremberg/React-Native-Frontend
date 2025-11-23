import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  nome: '',
  is_amparado: false,
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { id, nome, is_amparado, token } = action.payload;
      state.id = id;
      state.nome = nome;
      state.token = token;
      state.is_amparado = is_amparado
    },
    clearUser: (state) => {
      state.id = null;
      state.nome = '';
      state.token = null;
      state.is_amparado = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice;
