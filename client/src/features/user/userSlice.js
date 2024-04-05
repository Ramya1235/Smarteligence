import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  associate : null,
  associatesList:[],
  locations:[]
};

export const userSlice = createSlice({
  name: 'user',
  initialState,

  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    userLogin: (state,action) => {
      state.associate = action.payload;
    },
    getAssociatesList: (state, action) => {
      state.associatesList = action.payload
    },
    deleteAssociate: (state,action) =>{
      state.associatesList = action.payload
    },
    updateAssociate: (state,action) =>{
      state.associatesList = action.payload
    },
    userLogout: (state) => {
      state.associate = null
    },
    getLocations: (state,action) => {
      console.log(action.payload)
      const locationData = new Set(
        action.payload.map((item) => item.location)
      );
      const uniqueLocation = [...locationData];
      console.log(uniqueLocation)
      state.locations = uniqueLocation
    }
  },
});

export const { userLogin, getAssociatesList, deleteAssociate, updateAssociate, userLogout, getLocations} = userSlice.actions;


export default userSlice.reducer;
