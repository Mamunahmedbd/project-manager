import React from "react";
import AddTeam from "../components/team/AddTeam";
import Navigation from "../components/team/Navigation";
import Teams from "../components/team/Teams";
import Footer from "../components/ui/Footer";
import { ToastContainer } from "react-toastify";

export default function Team() {
  return (
    <>
      <div className="flex flex-col w-screen h-screen overflow-auto text-gray-700 bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200">
        <Navigation />
        <AddTeam />
        <Teams />
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}
