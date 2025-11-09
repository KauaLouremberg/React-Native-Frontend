import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  nome: '',
  perfil: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { id, nome, perfil } = action.payload;
      state.id = id;
      state.nome = nome;
      state.perfil = perfil;
    },
    clearUser: (state) => {
      state.id = null;
      state.nome = '';
      state.perfil = '';
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice;
