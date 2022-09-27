import gravatarUrl from "gravatar-url";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDeleteTeamMutation } from "../../features/teams/teamsApi";
import EditTeam from "./EditTeam";

export default function Team({
  id,
  name,
  description,
  lastDate,
  category,
  participants = [],
  owner,
}) {
  const { user: loggedInUser } = useSelector((state) => state.auth) || {};
  const { email: myEmail } = loggedInUser || {};
  const [opened, setOpened] = useState(false);
  const [deleteTeam] = useDeleteTeamMutation();

  const teamByColor = (teamName) => {
    switch (teamName) {
      case "green":
        return "text-green-500 bg-green-100";
      case "pink":
        return "text-pink-500 bg-pink-100";
      case "purple":
        return "text-purple-500 bg-purple-100";
      case "indigo":
        return "text-indigo-500 bg-indigo-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  const controlModal = () => {
    setOpened((prevState) => !prevState);
  };
  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this Team?")) {
      deleteTeam({ id: id, email: owner });
    }
  };
  return (
    <>
      <div
        className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100"
        draggable="true"
      >
        <div className="absolute top-0 right-0 flex">
          {myEmail === owner && (
            <button
              onClick={() => handleDelete(id)}
              className=" items-center justify-center hidden w-5 h-5 mt-3 mr-2 text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700 group-hover:flex"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          )}
          <button
            onClick={controlModal}
            className="items-center justify-center hidden w-5 h-5 mt-3 mr-2 text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700 group-hover:flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </button>
        </div>

        <span
          className={`flex items-center h-6 px-3 text-xs font-semibold rounded-full ${teamByColor(
            category
          )}`}
        >
          {name}
        </span>
        <h4 className="mt-3 text-sm font-medium">{description}</h4>
        <div className="flex items-center w-full mt-3 text-xs font-medium text-gray-400">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 text-gray-300 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="ml-1 leading-none"> {lastDate}</span>
          </div>
          <div className="ml-auto flex">
            {participants.map((participant, index) => (
              <img
                alt={participant}
                key={index}
                className="w-6 h-6 mr-2 rounded-full"
                src={gravatarUrl(participant, {
                  size: 80,
                })}
              />
            ))}
          </div>
        </div>
      </div>
      <EditTeam open={opened} control={controlModal} id={id} />
    </>
  );
}
