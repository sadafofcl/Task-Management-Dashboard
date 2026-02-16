import useLocalStorage from "@/hooks/useLocalStorage";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { pathDashboard, pathEditView } from "@/constants";

interface SubTaskType {
  title: string;
  description: string;
  category: string;
  status: string;
}

interface MainTaskType {
  id: string;
  date: string;
  title: string;
  description: string;
  category: string;
  subtaskRadio: string;
  subtasks?: SubTaskType[];
}

export default function FullTaskView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [allTask] = useLocalStorage<MainTaskType[]>("savedTasks", []);

  const task = allTask.find((t: MainTaskType) => t.id === id);

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-100 p-10">
        <div className="max-w-2xl mx-auto bg-white p-8 border-2 border-red-500 rounded-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Task Not Found
          </h1>
          <p className="mb-4">The task you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate(pathDashboard)}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white p-8 border-2 border-black rounded-lg">
        <h1 className="text-3xl font-bold mb-8 text-center border-b-4 border-black pb-4">
          Task Details
        </h1>
        
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => navigate(pathDashboard)}
            className="p-2 flex items-center gap-2 bg-black text-white border-2 border-black rounded cursor-pointer hover:bg-white hover:text-black transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={() => navigate(`${pathEditView}/${task.id}`)}
            className="p-2 bg-blue-600 text-white border-2 border-blue-600 rounded cursor-pointer hover:bg-white hover:text-blue-600 transition-colors"
          >
            Edit Task
          </button>
        </div>

        <div className="space-y-4">
          <div className="border-b pb-3">
            <span className="font-bold text-sm">Date of Creation :</span>
            <p className="text-lg">{task.date}</p>
          </div>

          <div className="border-b pb-3">
            <span className="font-bold text-sm">Title :</span>
            <p className="text-lg">{task.title}</p>
          </div>

          <div className="border-b pb-3">
            <span className="font-bold text-sm">Description :</span>
            <p className="text-lg">{task.description}</p>
          </div>

          <div className="border-b pb-3">
            <span className="font-bold text-sm">Category :</span>
            <p className="text-lg">{task.category}</p>
          </div>

          <div className="border-b pb-3">
            <span className="font-bold text-sm">Contains Subtasks :</span>
            <p className="text-lg">
              {task.subtaskRadio === "yes" ? "Yes" : "No"}
            </p>
          </div>

          {task.subtasks && task.subtasks.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-4 border-b-4 border-black pb-2">
                Subtasks{" "}
                <span className="text-sm text-gray-600">
                  (No. of subtasks : {task.subtasks.length})
                </span>
              </h2>
              {task.subtasks.map((subtask: SubTaskType, index: any) => (
                <div
                  key={index}
                  className="border-2 border-gray-300 p-4 mb-4 rounded-md bg-gray-50"
                >
                  <h3 className="text-xl font-bold mb-3">
                    Subtask {index + 1}
                  </h3>

                  <div className="space-y-2">
                    <div>
                      <span className="font-bold text-sm">Title:</span>
                      <p>{subtask.title}</p>
                    </div>

                    <div>
                      <span className="font-bold text-sm">Description:</span>
                      <p>{subtask.description}</p>
                    </div>

                    <div>
                      <span className="font-bold text-sm">Category:</span>
                      <p>{subtask.category}</p>
                    </div>

                    <div>
                      <span className="font-bold text-sm">Status:</span>
                      <p>{subtask.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
