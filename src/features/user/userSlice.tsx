import { getAddress } from "../../services/apiGeocoding";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type Position = {
  latitude?: number;
  longitude?: number;
};

type UserState = {
  username: string;
  status: "idle" | "loading" | "error";
  position: Position;
  address: string;
  error: string;
};

export function getPosition() {
  return new Promise<GeolocationPosition>(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export const fetchAddress = createAsyncThunk("user/fetchAddress",
  async function () {
    //Got the user geolocation position
    const positionObj = await getPosition();
    const position = {
      latitude: positionObj.coords.latitude,
      longitude: positionObj.coords.longitude,
    };

    // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
    const addressObj = await getAddress(position);
    const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

    // 3) Then we return an object with the data that we are interested in
    //payload of the fulfilled state
    return { position, address };
  }
)

const initialState: UserState = {
  username: '',
  status: "idle",
  position: {},
  address: '',
  error: ''
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateName(state, action) {
      state.username = action.payload;
    }
  },
  extraReducers: (builder) => builder
    .addCase(
      fetchAddress.pending, (state) => { (state.status = "loading") }
    )
    .addCase(
      fetchAddress.fulfilled, (state, action) => {
        state.position = action.payload.position;
        state.address = action.payload.address;
        state.status = "idle";
      }
    )
    .addCase(
      fetchAddress.rejected, (state) => {
        state.status = "error";
        state.error = "There was a problem getting your address. Make sure to fill this field!"
      }
    )
})

export const { updateName } = userSlice.actions;

export default userSlice.reducer;
