import gravatarUrl from "gravatar-url";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import logoImage from "../../assets/images/logo.svg";
import { searchValue, userLoggedOut } from "../../features/auth/authSlice";

export default function Navigation() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth) || {};
  const { email } = user || {};

  let { pathname } = useLocation();

  const logout = () => {
    dispatch(userLoggedOut());
    localStorage.clear();
  };

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
    dispatch(searchValue(value));
  };

  const handleSearch = debounceHandler(doSearch, 300);

  return (
    <div className="flex items-center flex-shrink-0 w-full h-16 px-10 bg-white bg-opacity-75">
      <Link to="/">
        <img className="h-10 w-10" src={logoImage} alt="Learn with Sumit" />
      </Link>
      {pathname === "/project" && (
        <input
          className="flex items-center h-10 px-4 ml-10 text-sm bg-gray-200 rounded-full focus:outline-none focus:ring"
          type="search"
          placeholder="Search for anything…"
          onChange={(e) => handleSearch(e.target.value)}
        />
      )}

      <div className="ml-10">
        <NavLink
          to="/project"
          className={({ isActive }) =>
            isActive
              ? "mx-2 text-sm font-semibold text-indigo-700"
              : "text-gray-600 mx-2 text-sm font-semibold hover:text-indigo-700"
          }
        >
          Projects
        </NavLink>
        <NavLink
          to="/team"
          className={({ isActive }) =>
            isActive
              ? "mx-2 text-sm font-semibold text-indigo-700"
              : "text-gray-600 mx-2 text-sm font-semibold hover:text-indigo-700"
          }
        >
          Team
        </NavLink>
      </div>
      <button className="flex items-center justify-center w-8 h-8 ml-auto overflow-hidden rounded-full cursor-pointer">
        <img
          src={gravatarUrl(email, {
            size: 80,
          })}
          alt=""
        />
      </button>
      <ul>
        <li className="mx-2 text-sm font-semibold text-gray-600 hover:text-indigo-700">
          <span className="cursor-pointer" onClick={logout}>
            Logout
          </span>
        </li>
      </ul>
    </div>
  );
}
