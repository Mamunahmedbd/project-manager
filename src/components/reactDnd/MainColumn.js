import React, { useEffect, useState } from "react";
import { useGetProjectQuery } from "../../features/project/projectApi";

import ItemContainer from "./ItemContainer";

const Columns = () => {
  const { data: loadData, isError, isSuccess } = useGetProjectQuery();

  const [containers, setContainers] = useState([]);
  useEffect(() => {
    if (loadData) {
      setContainers(loadData);
    }
  }, [loadData]);

  return (
    <div className="flex flex-grow px-10 mt-4 space-x-6 overflow-auto">
      <ItemContainer containers={containers} stage="Backlog" />
      <ItemContainer containers={containers} stage="Ready" />
      <ItemContainer containers={containers} stage="Doing" />
      <ItemContainer containers={containers} stage="Review" />
      <ItemContainer containers={containers} stage="Blocked" />
      <ItemContainer containers={containers} stage="Done" />
    </div>
  );
};

export default Columns;
