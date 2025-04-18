import React, { useState } from "react";
import { useDarkMode } from "../context/DarkModeContext";
import { useProjectsContext } from "../hooks/useProjectsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const ProjectForm = ({ project, setIsModalOpen, setIsOverlayOpen }) => {
  const [title, setTitle] = useState(project ? project.title : "");
  const [tech, setTech] = useState(project ? project.tech : "");
  const [budget, setBudget] = useState(project ? project.budget : "");
  const [duration, setDuration] = useState(project ? project.duration : "");
  const [manager, setManager] = useState(project ? project.manager : "");
  const [dev, setDev] = useState(project ? project.dev : "");
    const { isDarkMode } = useDarkMode();

  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const { dispatch } = useProjectsContext();
  const { user } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in!");
      return;
    }

    // data
    const projectObj = { title, tech, budget, duration, manager, dev };

    // if there is no project, send post req
    if (!project) {
      // sending post request
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/projects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(projectObj),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        setError(json.error);
        setEmptyFields(json.emptyFields);
      }

      // reset
      if (res.ok) {
        setTitle("");
        setTech("");
        setBudget("");
        setDuration("");
        setManager("");
        setDev("");
        setError(null);
        setEmptyFields([]);
        // project post successfully
        dispatch({ type: "CREATE_PROJECT", payload: json });
      }
      return;
    }

    // if there is a project, send patch req
    if (project) {
      // sending patch req
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/projects/${project._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(projectObj),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        setError(json.error);
        setEmptyFields(json.emptyFields);
      }

      if (res.ok) {
        setError(null);
        setEmptyFields([]);

        // dispatch
        dispatch({ type: "UPDATE_PROJECT", payload: json });

        // closing overlay & modal
        setIsModalOpen(false);
        setIsOverlayOpen(false);
      }
      return;
    }
  };

  return (
    <div className="px-90 py-10">
      <form
        onSubmit={handleSubmit}
        className={`px-10 flex flex-col gap-5 rounded-lg ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-600"
        }`}
      >
        <h2
          className={`text-4xl font-medium my-5 capitalize ${
            project ? "hidden" : ""
          }`}
        >
          Add a new project
        </h2>

        <div className="form-control flex flex-col gap-2">
          <label
            htmlFor="title"
            className="cursor-pointer hover:text-sky-400 duration-300"
          >
            Project Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="e.g. e-commerce website"
            id="title"
            className={`bg-transparent border placeholder-gray-400 py-3 px-5 rounded-lg outline-none focus:border-sky-400 duration-300 ${
              emptyFields?.includes("title")
                ? "border-rose-500"
                : "border-slate-500"
            }`}
          />
        </div>

        <div className="form-control flex flex-col gap-2">
          <label
            htmlFor="tech"
            className="cursor-pointer hover:text-sky-400 duration-300"
          >
            Technologies
          </label>
          <input
            value={tech}
            onChange={(e) => setTech(e.target.value)}
            type="text"
            placeholder="e.g. react.js, redux, node.js"
            id="tech"
            className={`bg-transparent border placeholder-gray-400 py-3 px-5 rounded-lg outline-none focus:border-sky-400 duration-300 ${
              emptyFields?.includes("tech")
                ? "border-rose-500"
                : "border-slate-500"
            }`}
          />
        </div>

        <div className="form-control flex flex-col gap-2">
          <label
            htmlFor="budget"
            className="cursor-pointer hover:text-sky-400 duration-300"
          >
            Budget (in USD)
          </label>
          <input
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            type="number"
            placeholder="e.g. 500"
            id="budget"
            className={`bg-transparent border placeholder-gray-400 py-3 px-5 rounded-lg outline-none focus:border-sky-400 duration-300 ${
              emptyFields?.includes("budget")
                ? "border-rose-500"
                : "border-slate-500"
            }`}
          />
        </div>

        <div className="form-control flex flex-col gap-2">
          <label
            htmlFor="duration"
            className="cursor-pointer hover:text-sky-400 duration-300"
          >
            Duration (in week)
          </label>
          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            type="number"
            placeholder="e.g. 6"
            id="duration"
            className={`bg-transparent border placeholder-gray-400 py-3 px-5 rounded-lg outline-none focus:border-sky-400 duration-300 ${
              emptyFields?.includes("duration")
                ? "border-rose-500"
                : "border-slate-500"
            }`}
          />
        </div>

        <div className="form-control flex flex-col gap-2">
          <label
            htmlFor="manager"
            className="cursor-pointer hover:text-sky-400 duration-300"
          >
            Manager
          </label>
          <input
            value={manager}
            onChange={(e) => setManager(e.target.value)}
            type="text"
            placeholder="e.g. Tanisha Tanvin"
            id="manager"
            className={`bg-transparent border placeholder-gray-400 py-3 px-5 rounded-lg outline-none focus:border-sky-400 duration-300 ${
              emptyFields?.includes("manager")
                ? "border-rose-500"
                : "border-slate-500"
            }`}
          />
        </div>

        <div className="form-control flex flex-col gap-2">
          <label
            htmlFor="developer"
            className="cursor-pointer hover:text-sky-400 duration-300"
          >
            Developers
          </label>
          <input
            value={dev}
            onChange={(e) => setDev(e.target.value)}
            type="number"
            placeholder="e.g. 10"
            id="developer"
            className={`bg-transparent border placeholder-gray-400 py-3 px-5 rounded-lg outline-none focus:border-sky-400 duration-300 ${
              emptyFields?.includes("dev")
                ? "border-rose-500"
                : "border-slate-500"
            }`}
          />
        </div>

        <button
          type="submit"
          className="mb-8 bg-sky-400 text-slate-900 py-3 rounded-lg hover:bg-sky-50 duration-300 capitalize"
        >
          {project ? "Confirm Update" : "Add project"}
        </button>
        {error && (
          <p className="bg-rose-500/20 rounded-lg p-5 text-rose-500 border border-rose-500">
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default React.memo(ProjectForm);
