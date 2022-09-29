import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAddProjectMutation } from "../../features/project/projectApi";
import { useGetTeamsQuery } from "../../features/teams/teamsApi";
import Error from "../ui/Error";

export default function Modal({ open, control }) {
  const [title, setTitle] = useState("");
  const [team, setTeam] = useState("");
  const [description, setDescription] = useState("");
  const { user: loggedInUser } = useSelector((state) => state.auth) || {};
  const { email: myEmail } = loggedInUser || {};
  const { data } = useGetTeamsQuery(myEmail);
  const navigate = useNavigate();

  const [addProject, { isError, error, isLoading, isSuccess }] =
    useAddProjectMutation();

  // listen conversation add success
  useEffect(() => {
    if (isSuccess) {
      control();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // add conversation
    navigate("/project");
    addProject({
      owner: myEmail,
      stage: "Backlog",
      title,
      description,
      category: team,
      timestamp: new Date().getTime(),
    });
  };

  return (
    open && (
      <>
        <div
          onClick={control}
          className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
        ></div>
        <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create an Project
          </h2>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="name" className="sr-only">
                  Project Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Project Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="teamOption" className="sr-only">
                  Select an Team
                </label>
                <select
                  id="teamOption"
                  required
                  onChange={(e) => setTeam(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                >
                  <option value="">Choose a Team</option>
                  {data.map((team, index) => (
                    <option key={index} value={team.category}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="description" className="sr-only">
                  Project Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                disabled={isLoading}
              >
                Create Project
              </button>
            </div>
            {isError && <Error message={error} />}
          </form>
        </div>
      </>
    )
  );
}
