import { useState, useEffect } from "react";
import { pathDashboard, categories } from "@/constants";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [allTask, setAllTask] = useLocalStorage<MainTaskType[]>(
    "savedTasks",
    [],
  );

  const taskToEdit = allTask.find(
    (t: MainTaskType) => String(t.id) === String(id),
  );

  const [formData, setFormData] = useState<MainTaskType | null>(null);

  useEffect(() => {
    if (taskToEdit) {
      setFormData(taskToEdit);
    }
  }, [taskToEdit]);

  if (!formData) return <div>Task not found</div>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    const updatedTasks = allTask.map((task: MainTaskType) =>
      String(task.id) === String(id) ? formData : task,
    );

    setAllTask(updatedTasks);
    toast.success("Task has been updated");
    navigate(pathDashboard);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-3xl mx-auto bg-white p-8 border-2 border-black rounded-lg">
        <h1 className="text-3xl font-bold mb-6 border-b-4 border-black pb-4">
          Edit Task
        </h1>

        <div className="space-y-4">
          <div>
            <label className="font-semibold">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border-2 border-black p-2 rounded"
            />
          </div>

          <div>
            <label className="font-semibold">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border-2 border-black p-2 rounded"
            />
          </div>

          <div>
            <label className="font-semibold">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border-2 border-black p-2 rounded"
            >
              <option value="">Select category from dropdown</option>
              {categories.map((item: string) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Update Task
            </button>

            <button
              onClick={() => navigate(pathDashboard)}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
