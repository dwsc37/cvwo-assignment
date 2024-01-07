import { isRejectedWithValue } from "@reduxjs/toolkit";
import { Middleware, MiddlewareAPI } from "redux";

const authErrorStatus = 401;
const authMiddleware: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
      try{
        const payloadWithStatus = action.payload as { status: number };
        if (payloadWithStatus.status === authErrorStatus){
          console.warn("You're not logged in!");
        }
      }
      catch{
      }
    }

    return next(action)
  }

export default authMiddleware