import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { teamsApi, useEditTeamMutation } from "../../features/teams/teamsApi";
import { useGetUserQuery } from "../../features/users/usersApi";
import isValidEmail from "../../utils/isValidEmail";
import Error from "../ui/Error";

export default function Modal({ id, open, control }) {
  const [to, setTo] = useState("");
  const [userCheck, setUserCheck] = useState(false);
  const { user: loggedInUser } = useSelector((state) => state.auth) || {};
  const { email: myEmail } = loggedInUser || {};
  const dispatch = useDispatch();
  const [responseError, setResponseError] = useState("");
  const [existingUser, setExistingUser] = useState("");
  const [conversation, setConversation] = useState(undefined);
  const navigate = useNavigate();
  const { data: participant } = useGetUserQuery(to, {
    skip: !userCheck,
  });
  const [editTeam, { isSuccess }] = useEditTeamMutation();

  useEffect(() => {
    if (participant?.length > 0) {
      // check team existance
      dispatch(teamsApi.endpoints.getTeams.initiate(myEmail))
        .unwrap()
        .then((data) => {
          const targetData = data.find((d) => d.id === id);
          setConversation(targetData);
        })
        .catch((err) => {
          setResponseError("There was a problem!");
        });
    }
  }, [participant, dispatch, myEmail, id]);

  // listen conversation add/edit success
  useEffect(() => {
    if (isSuccess) {
      control();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const debounceHandler = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  const doSearch = (value) => {
    if (isValidEmail(value)) {
      // check user API
      setUserCheck(true);
      setTo(value);
    }
  };

  const handleSearch = debounceHandler(doSearch, 300);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const teamMember = await dispatch(
      teamsApi.endpoints.getTeams.initiate(myEmail)
    ).unwrap();
    const targetData = teamMember.find((d) => d.id === id);
    const findEmail = targetData?.participants?.find(
      (c) => c === participant[0].email
    );
    if (!findEmail) {
      editTeam({
        id: conversation?.id,
        data: {
          owner: myEmail,
          participants: [...conversation?.participants, participant[0].email],
          name: conversation?.name,
          description: conversation?.description,
          category: conversation?.category,
          timestamp: new Date().getTime(),
        },
      });
      navigate("/team");
    } else {
      setExistingUser("User already added at this team");
    }
  };
  const handleReset = () => {
    control();
    handleSearch("");
  };

  return (
    open && (
      <>
        <div
          onClick={handleReset}
          className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
        ></div>
        <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Edit Team
          </h2>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="to" className="sr-only">
                  To
                </label>
                <input
                  id="to"
                  name="to"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Add an existing user email"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                disabled={
                  conversation === undefined ||
                  (participant?.length > 0 && participant[0].email === myEmail)
                }
              >
                Send Message
              </button>
            </div>

            {participant?.length === 0 && (
              <Error message="This user does not exist!" />
            )}
            {participant?.length > 0 && participant[0].email === myEmail && (
              <Error message="You can not send message to yourself!" />
            )}
            {responseError && <Error message={responseError} />}
            {existingUser?.length > 0 && <Error message={existingUser} />}
          </form>
        </div>
      </>
    )
  );
}
