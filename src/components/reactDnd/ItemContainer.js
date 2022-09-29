import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { useDropItemMutation } from "../../features/project/projectApi";
import CreateProject from "./CreateProject";
import Card from "./Card";

const ItemContainer = ({ stage, containers }) => {
  const [dropItem] = useDropItemMutation();
  const filteredProjects = containers.filter(
    (project) => project.stage === stage
  );

  const [opened, setOpened] = useState(false);

  const controlModal = () => {
    setOpened((prevState) => !prevState);
  };

  const [{ isOver }, itemsRef] = useDrop({
    drop: (item) => {
      const task = item;
      const updateTask = { ...task, stage };
      if (stage !== item.stage) {
        dropItem({ id: task.id, data: updateTask });
      }
    },
    accept: "Card",
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div className="flex flex-col flex-shrink-0 w-72">
      <div className="flex items-center flex-shrink-0 h-10 px-2">
        <span className="block text-sm font-semibold">{stage}</span>
        <span className="flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-indigo-500 bg-white rounded bg-opacity-30">
          {filteredProjects.length}
        </span>
        {stage === "Backlog" && (
          <>
            <button
              onClick={controlModal}
              className="flex items-center justify-center w-6 h-6 ml-auto text-indigo-500 rounded hover:bg-indigo-500 hover:text-indigo-100"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
            </button>
            <CreateProject open={opened} control={controlModal} />
          </>
        )}
      </div>
      <div
        ref={itemsRef}
        className={`space-y-2 h-[calc(100vh-16rem)] overflow-auto  rounded-md pb-2 ${
          isOver ? "bg-indigo-300" : "bg-indigo-100"
        }`}
      >
        {filteredProjects
          .slice()
          .sort((a, b) => a.timestamp - b.timestamp)
          .reverse()
          .map((container) => (
            <Card
              stage={container.stage}
              key={container.id}
              container={container}
            />
          ))}
      </div>
    </div>
  );
};

export default ItemContainer;
