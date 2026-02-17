import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  categories,
  pathTask,
  pathTasklist,
  pathTaskView,
} from "@/constants";
import {
  Calendar,
  ListTodo,
  Plus,
  Search,
  X,
} from "lucide-react";

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

export default function Dashboard() {
  const navigate = useNavigate();
  const [allTasks] = useLocalStorage<MainTaskType[]>("savedTasks", []);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const totalTasks = allTasks.length;
  const tasksWithSubtasks = allTasks.filter(
    (task: MainTaskType) => task.subtaskRadio === "yes",
  ).length;

  const recentTasks = [...allTasks].slice(-3).reverse();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowSearchResults(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const searchResults = allTasks.filter((task: MainTaskType) => {
    const query = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      task.category.toLowerCase().includes(query) ||
      task.date.includes(query) ||
      (task.subtasks &&
        task.subtasks.some(
          (subtask) =>
            subtask.title.toLowerCase().includes(query) ||
            subtask.description.toLowerCase().includes(query),
        ))
    );
  });

  return (
    <>
      <div className="grid place-items-center min-h-[10vh] text-center m-5">
        <h1 className="text-2xl font-serif font-bold">
          Welcome to Task Dashboard
        </h1>
        <h3>
          Start Creating new tasks. You can also search from existing tasks.
        </h3>
      </div>

      <div className="flex justify-center items-center gap-4 px-10 mb-8">
        <button
          type="button"
          className="flex items-center justify-center gap-2 p-2 bg-black text-white border-2 border-black rounded cursor-pointer hover:bg-white hover:text-black transition-colors"
          onClick={() => navigate(pathTask)}
        >
          <Plus size={20} />
          <span>Create new task</span>
        </button>

        <div className="flex gap-2 items-center flex-1 max-w-2xl">
          <div className="relative flex-1">
            <input
              type="text"
              className="border border-black rounded py-2 px-4 w-full pr-10"
              placeholder="Search task by title, description, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            type="button"
            className="flex items-center justify-center gap-2 py-2 px-4 bg-black text-white border-2 border-black rounded cursor-pointer hover:bg-white hover:text-black transition-colors"
            onClick={handleSearch}
          >
            <Search size={16} />
            <span>Search</span>
          </button>
        </div>
      </div>

      {showSearchResults && (
        <div className="max-w-6xl mx-auto px-10 mb-8">
          <div className="bg-white p-8 rounded-lg border-2 border-black">
            <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-3">
              <h2 className="text-2xl font-bold">
                Search Results for "{searchQuery}"
              </h2>
              <button
                type="button"
                onClick={clearSearch}
                className="text-sm bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded transition-colors"
              >
                Clear Search Results
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-2">No tasks found matching your search.</p>
                <p className="text-sm text-gray-500">Try different keywords or create a new task.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                  Found {searchResults.length} task(s)
                </p>
                {searchResults.map((task: MainTaskType) => (
                  <div
                    key={task.id}
                    className="border-2 border-gray-300 rounded-lg p-4 hover:border-black transition-colors cursor-pointer"
                    onClick={() => navigate(`${pathTaskView}/${task.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{task.title}</h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {task.description}
                        </p>
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className="inline-block bg-gray-200 px-3 py-1 rounded text-xs font-semibold">
                            {task.category}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar size={12} />
                            {task.date}
                          </span>
                          {task.subtasks && task.subtasks.length > 0 && (
                            <span className="text-xs text-blue-600 font-semibold">
                              {task.subtasks.length} subtask(s)
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="ml-4 text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`${pathTaskView}/${task.id}`);
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-100 p-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg border-2 border-black">
              <div className="flex items-center justify-between mb-2">
                <ListTodo className="text-blue-600" size={32} />
              </div>
              <h3 className="text-3xl font-bold">{totalTasks}</h3>
              <p className="text-gray-600 text-sm">Total Tasks</p>
            </div>

            <div className="bg-white p-6 rounded-lg border-2 border-black">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="text-purple-600" size={32} />
              </div>
              <h3 className="text-3xl font-bold">{tasksWithSubtasks}</h3>
              <p className="text-gray-600 text-sm">With Subtasks</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg border-2 border-black">
            <h2 className="text-2xl font-bold mb-6 border-b-2 border-black pb-3">
              Recent Tasks
            </h2>

            {allTasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No tasks yet!</p>
                <button
                  type="button"
                  onClick={() => navigate(pathTask)}
                  className="bg-black text-white px-6 py-3 rounded border-2 border-black hover:bg-white hover:text-black transition-colors font-bold"
                >
                  Create Your First Task
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="border-2 border-gray-300 rounded-lg p-4 hover:border-black transition-colors cursor-pointer"
                    onClick={() => navigate(`${pathTaskView}/${task.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{task.title}</h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {task.description}
                        </p>
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className="inline-block bg-gray-200 px-3 py-1 rounded text-xs font-semibold">
                            {task.category}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar size={12} />
                            {task.date}
                          </span>
                          {task.subtasks && task.subtasks.length > 0 && (
                            <span className="text-xs text-blue-600 font-semibold">
                              {task.subtasks.length} subtask(s)
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="ml-4 text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`${pathTaskView}/${task.id}`);
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}

                {allTasks.length > 3 && (
                  <button
                    type="button"
                    onClick={() => navigate(pathTasklist)}
                    className="w-full mt-4 bg-white text-black px-4 py-3 rounded border-2 border-black hover:bg-black hover:text-white transition-colors font-bold"
                  >
                    View All {allTasks.length} Tasks
                  </button>
                )}
              </div>
            )}
          </div>

          {allTasks.length > 0 && (
            <div className="mt-8 bg-white p-8 rounded-lg border-2 border-black">
              <h2 className="text-2xl font-bold mb-6 border-b-2 border-black pb-3">
                Tasks by Category
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => {
                  const count = allTasks.filter(
                    (task: MainTaskType) => task.category === category,
                  ).length;
                  return (
                    <div
                      key={category}
                      className="border-2 border-gray-300 rounded-lg p-4 text-center"
                    >
                      <h3 className="text-2xl font-bold">{count}</h3>
                      <p className="text-sm text-gray-600">{category}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}