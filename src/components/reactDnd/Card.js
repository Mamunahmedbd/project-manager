import gravatarUrl from "gravatar-url";
import moment from "moment";
import React from "react";
import { useDrag } from "react-dnd";
import { useSelector } from "react-redux";
import { useDeleteItemMutation } from "../../features/project/projectApi";

export default function Card({ container, stage }) {
  const { id, title, category, timestamp, owner, description } =
    container || {};

  const { user: loggedInUser, search } =
    useSelector((state) => state.auth) || {};
  const { email: myEmail } = loggedInUser || {};
  const [deleteItem] = useDeleteItemMutation();

  const [{ isDragging }, dragRef] = useDrag({
    type: "Card",
    item: () => ({ ...container }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
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

  const removeItem = (id) => {
    if (window.confirm("Are you sure to delete this project?")) {
      deleteItem(id);
    }
  };
  return (
    <div
      ref={dragRef}
      className={`relative bg-white p-4 rounded-md m-2 space-y-2 group ${
        search &&
        title.toLowerCase().includes(search.toLowerCase()) &&
        `ring-2 ring-blue-700 animate-pulse`
      } ${isDragging ? "opacity-50" : "opacity-100"}`}
      draggable="true"
      title={`Create by ${owner}`}
    >
      {stage === "Backlog" && myEmail === owner && (
        <button
          onClick={() => removeItem(id)}
          className="absolute top-0 right-0 flex items-center justify-center hidden w-5 h-5 mt-3 mr-2 text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700 group-hover:flex"
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
      <span
        className={`${teamByColor(
          category
        )} "flex items-center h-6 px-3 text-xs font-semibold rounded-full"`}
      >
        {title}
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
          <span className="ml-1 leading-none">
            {moment(timestamp).format("LL")}
          </span>
        </div>

        <img
          alt=""
          className="w-6 h-6 ml-auto rounded-full"
          src={gravatarUrl(owner, {
            size: 80,
          })}
        />
      </div>
    </div>
  );
}
