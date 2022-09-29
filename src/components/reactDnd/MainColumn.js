import React from "react";
import { useGetProjectQuery } from "../../features/project/projectApi";
import Error from "../ui/Error";

import ItemContainer from "./ItemContainer";

const Columns = () => {
  const { data, isError, isLoading, error } = useGetProjectQuery();

  let content = null;

  if (isLoading) {
    content = <h1 className="m-2 text-center">Loading...</h1>;
  } else if (!isLoading && isError) {
    content = (
      <h1 className="m-2 text-center">
        <Error message={error?.data} />
      </h1>
    );
  } else if (!isLoading && !isError && data?.length === 0) {
    content = <h1 className="m-2 text-center">No Team found!</h1>;
  } else if (!isLoading && !isError && data?.length > 0) {
    content = (
      <div className="flex flex-grow px-10 mt-4 space-x-6 overflow-auto">
        <ItemContainer containers={data} stage="Backlog" />
        <ItemContainer containers={data} stage="Ready" />
        <ItemContainer containers={data} stage="Doing" />
        <ItemContainer containers={data} stage="Review" />
        <ItemContainer containers={data} stage="Blocked" />
        <ItemContainer containers={data} stage="Done" />
      </div>
    );
  }

  return content;
};

export default Columns;
