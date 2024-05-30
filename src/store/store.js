import { configureStore } from "@reduxjs/toolkit";

import { taskSlice } from "../api/ApiSlice.js";

export const store = configureStore({
  reducer: {
    [taskSlice.reducerPath]: taskSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(taskSlice.middleware),
});
