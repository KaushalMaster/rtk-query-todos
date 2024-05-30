import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const taskSlice = createApi({
  reducerPath: "taskSlice",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: () => "/tasks",
      providesTags: ["Task"],
      //   use to display the latest added task to the top
      transformResponse: (tasks) => tasks.reverse(),
    }),
    addTask: builder.mutation({
      query: (task) => ({
        url: "/tasks",
        method: "POST",
        body: task,
      }),
      // help to recall the endpoint again with the providesTags
      invalidatesTags: ["Task"],

      // providing optimistic updates to store the data even for slow networks
      async onQueryStarted(task, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          taskSlice.util.updateQueryData("getTasks", undefined, (tasksList) => {
            tasksList.unshift({ id: crypto.randomUUID(), task });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    updateTask: builder.mutation({
      query: ({ id, ...updatedTask }) => ({
        url: `/tasks/${id}`,
        method: "PATCH",
        body: updatedTask,
      }),

      invalidatesTags: ["Task"],

      // providing optimistic updates to store the data even for slow networks
      async onQueryStarted(
        { id, ...updatedTask },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          taskSlice.util.updateQueryData("getTasks", undefined, (tasksList) => {
            const taskIndex = tasksList.findIndex((el) => el.id === id);
            tasksList[taskIndex] = { ...tasksList[taskIndex], ...updatedTask };
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],

      // providing optimistic updates to store the data even for slow networks
      async onQueryStarted(task, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          taskSlice.util.updateQueryData("getTasks", undefined, (tasksList) => {
            const taskIndex = tasksList.findIndex((el) => el.id === id);
            tasksList.splice(taskIndex, 1);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetTasksQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskSlice;
