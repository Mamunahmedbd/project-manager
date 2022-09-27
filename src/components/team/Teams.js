import React from "react";
import { useSelector } from "react-redux";
import Team from "./Team";
import Error from "../ui/Error";
import { useGetTeamsQuery } from "../../features/teams/teamsApi";
import moment from "moment/moment";

export default function Teams() {
  const { user } = useSelector((state) => state.auth) || {};
  const { email } = user || {};
  const {
    data: teams = [],
    isLoading,
    isError,
    error,
  } = useGetTeamsQuery(email) || {};

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <h1 className="m-2 text-center">Loading...</h1>;
  } else if (!isLoading && isError) {
    content = (
      <h1 className="m-2 text-center">
        <Error message={error?.data} />
      </h1>
    );
  } else if (!isLoading && !isError && teams?.length === 0) {
    content = <h1 className="m-2 text-center">No Team found!</h1>;
  } else if (!isLoading && !isError && teams?.length > 0) {
    content = teams.map((team) => (
      <Team
        key={team.id}
        id={team.id}
        name={team.name}
        category={team.category}
        description={team.description}
        participants={team.participants}
        owner={team.owner}
        lastDate={moment(team.timestamp).format("LL")}
      />
    ));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 px-10 mt-4 gap-6 overflow-auto">
      {content}
    </div>
  );
}
