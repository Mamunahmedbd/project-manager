import { apiSlice } from "../api/apiSlice";

export const projectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProject: builder.query({
      query: () => "/project",
    }),

    dropItem: builder.mutation({
      query: ({ id, data }) => ({
        url: `/project/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const projectData = await queryFulfilled;
        if (projectData?.data?.id) {
          // update messages cache pessimistically start
          dispatch(
            apiSlice.util.updateQueryData("getProject", undefined, (draft) => {
              const draftConversation = draft.find((c) => c.id == arg.id);
              draftConversation.stage = arg.data.stage;
            })
          );
          // update messages cache pessimistically end
        }
      },
    }),
    addProject: builder.mutation({
      query: (data) => ({
        url: "/project",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const newProjectData = await queryFulfilled;
        if (newProjectData?.data?.id) {
          // update messages cache pessimistically start
          dispatch(
            apiSlice.util.updateQueryData("getProject", undefined, (draft) => {
              const foundMsg = draft.findIndex(
                (msg) => msg.timestamp === arg?.timestamp
              );
              if (foundMsg === -1) draft.push(newProjectData.data);
            })
          );
          // update messages cache pessimistically end
        }
      },
    }),
    deleteItem: builder.mutation({
      query: (id) => ({
        url: `/project/${id}`,
        method: "DELETE",
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        dispatch(
          apiSlice.util.updateQueryData("getProject", undefined, (draft) => {
            const foundMsg = draft.filter((msg) => msg.id !== arg);
            return foundMsg;
          })
        );
      },
    }),
    addProjectData: builder.mutation({
      query: ({ id, data }) => ({
        url: `/project/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetProjectQuery,
  useDropItemMutation,
  useAddProjectDataMutation,
  useDeleteItemMutation,
  useAddProjectMutation,
} = projectApi;
