// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { tokenExpiryTime } from "../utility/Utils"
import { getRequest } from '../helpers'
import { apiUrls } from '../constants'

export const getMeAndSaveUserState = createAsyncThunk('authentication/getMeAndSaveUserState', async () => {
  const response = await getRequest(apiUrls.me)
  return response.data
})

export const authSlice = createSlice({
  name: 'authentication',
  initialState: {
    user: null,
    login: false,
    token: null,
    role: null,
    tokenExpiryTime: null,
    getMeAPICall_status: 'idle'
  },
  reducers: {
    handleLogin: (state, action) => {
      state.user = action.payload.user || state.user
      state.login = action.payload.login || state.login
      state.token = action.payload.token || state.token
      state.role = action.payload.role || state.role
    },
    handleUser: (state, action) => {
      state.user = action.payload.user
    },
    handleTokenExpiryTime: (state, action) => {
      state.tokenExpiryTime = action.payload.tokenExpiryTime
    },
    handleLogout: state => {
      state.user = null
      state.login = false
      state.token = null
      state.role = null
      state.tokenExpiryTime = null
      state.getMeAPICall_status = 'idle'
      localStorage.setItem("token", "")
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getMeAndSaveUserState.pending, (state, action) => {
        state.getMeAPICall_status = 'loading'
      })
      .addCase(getMeAndSaveUserState.fulfilled, (state, action) => {
        state.getMeAPICall_status = 'succeeded'
        state.user = action.payload.result?.currentUser
      })
      .addCase(getMeAndSaveUserState.rejected, (state, action) => {
        state.getMeAPICall_status = 'failed'
      })
  }
})

export const { handleLogin, handleLogout, handleUser, handleTokenExpiryTime } = authSlice.actions

export default authSlice.reducer
