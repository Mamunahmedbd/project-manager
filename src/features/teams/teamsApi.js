import { apiSlice } from "../api/apiSlice";

export const teamsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTeams: builder.query({
      query: (email) => `/teams?participants_like=${email}`,
    }),
    getAllTeams: builder.query({
      query: () => "/teams",
    }),
    getTeam: builder.query({
      query: (userId) => `/teams/${userId}`,
    }),
    addTeam: builder.mutation({
      query: (data) => ({
        url: "/teams",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const newTeamData = await queryFulfilled;
        if (newTeamData?.data?.id) {
          // update messages cache pessimistically start
          dispatch(
            apiSlice.util.updateQueryData("getTeams", arg?.owner, (draft) => {
              const foundMsg = draft.findIndex(
                (msg) => msg.timestamp === arg?.timestamp
              );
              if (foundMsg === -1) draft.push(newTeamData.data);
            })
          );
          // update messages cache pessimistically end
        }
      },
    }),
    deleteTeam: builder.mutation({
      query: ({ id, email }) => ({
        url: `/teams/${id}`,
        method: "DELETE",
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        dispatch(
          apiSlice.util.updateQueryData("getTeams", arg.email, (draft) => {
            const updatedDraftData = draft.filter((msg) => msg.id !== arg.id);
            return updatedDraftData;
          })
        );
      },
    }),
    editTeam: builder.mutation({
      query: ({ id, data }) => ({
        url: `/teams/${id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const updatedTeamData = await queryFulfilled;
        try {
          if (updatedTeamData?.data?.id) {
            dispatch(
              apiSlice.util.updateQueryData(
                "getTeams",
                arg?.data?.owner,
                (draft) => {
                  const updateDraftData = draft.find((c) => c.id === arg?.id);
                  if (updateDraftData.id) {
                    updateDraftData.participants = arg?.data?.participants;
                  }
                }
              )
            );
          }
        } catch (error) {
          // updateTeam.undo();
        }
      },
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useAddTeamMutation,
  useGetTeamQuery,
  useEditTeamMutation,
  useDeleteTeamMutation,
  useGetAllTeamsQuery,
} = teamsApi;
