import { pathTaskView } from "@/constants";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Trash2, X } from "lucide-react";import { toast } from "sonner"

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

export default function TaskList() {
  const [allTask, setAllTask] = useLocalStorage<MainTaskType[]>("savedTasks", []);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoryFiltering = searchParams.get('category');
  
  const filteredTasks = categoryFiltering 
    ? allTask.filter((task: MainTaskType) => task.category === categoryFiltering)
    : allTask;

  const handleDelete = (taskId: string) => {
    const updatedTasks = allTask.filter((task: MainTaskType) => task.id !== taskId);
    setAllTask(updatedTasks);
    toast.info("Task has been deleted")
  };

  const clearFilter = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center border-b-4 border-black pb-4 bg-white p-4 rounded-t-lg">
          {categoryFiltering ? `Tasks in: ${categoryFiltering}` : 'All Tasks'}
        </h1>
        
        {categoryFiltering && (
          <div className="mb-4 flex items-center gap-2 bg-blue-100 border-2 border-blue-500 rounded p-3 w-fit">
            <span className="text-sm font-semibold text-blue-800">
              Filtered by category: {categoryFiltering}
            </span>
            <button
              onClick={clearFilter}
              className="p-1 hover:bg-blue-200 rounded transition-colors"
              aria-label="Clear filter"
            >
              <X size={16} className="text-blue-800" />
            </button>
          </div>
        )}
        
        {filteredTasks.length === 0 ? (
          <div className="bg-white p-8 rounded-lg border-2 border-black">
            <p className="text-center text-gray-600">
              {categoryFiltering 
                ? `No tasks found in category "${categoryFiltering}"`
                : "No saved tasks yet"
              }
            </p>
            {categoryFiltering && (
              <button
                onClick={clearFilter}
                className="mt-4 mx-auto block text-blue-600 hover:underline"
              >
                View all tasks
              </button>
            )}
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredTasks.map((element: MainTaskType, index: number) => ( 
              <li
                key={element.id} 
                className="
                  flex items-center justify-between gap-3
                  border-2 border-black rounded p-4 bg-white
                  hover:shadow-lg transition-shadow
                "
              >
                <div className="flex-1">
                  <div className="mb-2">
                    <span className="font-bold">Task {index + 1} : </span>
                    <span className="text-lg">{element.title}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Date: </span>
                    {element.date}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Category: </span>
                    {element.category}
                  </div>
                  {element.subtasks && element.subtasks.length > 0 && (
                    <div className="text-sm text-blue-600 mt-1">
                       {element.subtasks.length} subtask(s)
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="p-2 px-4 flex items-center justify-center gap-2 bg-black text-white border-2 border-black rounded cursor-pointer hover:bg-white hover:text-black transition-colors"
                  onClick={() => navigate(`${pathTaskView}/${element.id}`)} 
                >
                  View Details
                </button>
                <button
                  type="button"
                  className="p-2 px-4 flex items-center justify-center gap-2 text-white border-2 rounded cursor-pointer bg-red-700 border-red-700 hover:bg-white hover:text-black transition-colors"
                  onClick={() => handleDelete(element.id)}
                >
                  <Trash2 size={18} />
                  <span>Delete</span> 
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}