import { useState, useEffect } from "react";
import { pathDashboard, pathTaskView, categories, subCategories } from "@/constants";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

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

interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  subtasks?: { title?: string; description?: string; category?: string; status?: string }[];
}

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [allTask, setAllTask] = useLocalStorage<MainTaskType[]>("savedTasks", []);

  const [formData, setFormData] = useState<MainTaskType | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const found = allTask.find((t: MainTaskType) => String(t.id) === String(id));
    if (found) {
      setFormData(found);
    }
  }, [id]);

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-100 p-10">
        <div className="max-w-2xl mx-auto bg-white p-8 border-2 border-red-500 rounded-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Task Not Found</h1>
          <p className="mb-4">The task you're trying to edit doesn't exist.</p>
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

  const validate = (data: MainTaskType): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.title.trim()) newErrors.title = "* Title is required";
    if (!data.description.trim()) newErrors.description = "* Description is required";
    if (!data.category) newErrors.category = "* Please select a category";

    if (data.subtasks && data.subtasks.length > 0) {
      const subtaskErrors = data.subtasks.map((sub) => {
        const subErr: { title?: string; description?: string; category?: string; status?: string } = {};
        if (!sub.title.trim()) subErr.title = "* Title is required";
        if (!sub.description.trim()) subErr.description = "* Description is required";
        if (!sub.category) subErr.category = "* Please select a category";
        if (!sub.status.trim()) subErr.status = "* Status is required";
        return subErr;
      });

      if (subtaskErrors.some((e) => Object.keys(e).length > 0)) {
        newErrors.subtasks = subtaskErrors;
      }
    }

    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    setFormData(updated);
    if (touched) setErrors(validate(updated));
  };

  const handleSubtaskChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const updatedSubtasks = (formData.subtasks ?? []).map((sub, i) =>
      i === index ? { ...sub, [e.target.name]: e.target.value } : sub,
    );
    const updated = { ...formData, subtasks: updatedSubtasks };
    setFormData(updated);
    if (touched) setErrors(validate(updated));
  };

  const handleAddSubtask = () => {
    const newSubtask: SubTaskType = { title: "", description: "", category: "", status: "" };
    const updated = {
      ...formData,
      subtasks: [...(formData.subtasks ?? []), newSubtask],
      subtaskRadio: "yes",
    };
    setFormData(updated);
  };

  const handleRemoveSubtask = (index: number) => {
    const updatedSubtasks = (formData.subtasks ?? []).filter((_, i) => i !== index);
    const updated = {
      ...formData,
      subtasks: updatedSubtasks,
      subtaskRadio: updatedSubtasks.length > 0 ? "yes" : "no",
    };
    setFormData(updated);
  };

  const handleUpdate = () => {
    setTouched(true);
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors before saving");
      return;
    }

    const updatedTasks = allTask.map((task: MainTaskType) =>
      String(task.id) === String(id) ? formData : task,
    );

    setAllTask(updatedTasks);
    toast.success("Task has been updated");
    navigate(`${pathTaskView}/${id}`);
  };

  const fieldClass = "w-full border-2 border-black p-2.5 rounded text-sm";
  const errorClass = "text-red-600 text-xs mt-1 font-bold block";
  const labelClass = "block font-bold mb-2 text-sm";

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-3xl mx-auto bg-white p-8 border-2 border-black rounded-lg">
        <h1 className="text-3xl font-bold mb-8 text-center border-b-4 border-black pb-4">
          Edit Task
        </h1>

        <button
          type="button"
          onClick={() => navigate(`${pathTaskView}/${id}`)}
          className="mb-6 p-2 flex items-center gap-2 bg-black text-white border-2 border-black rounded hover:bg-white hover:text-black transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Task</span>
        </button>

        <div className="space-y-5">
          <div>
            <label className={labelClass}>Title*</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={fieldClass}
              placeholder="Task title"
            />
            {errors.title && <span className={errorClass}>{errors.title}</span>}
          </div>

          <div>
            <label className={labelClass}>Description*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`${fieldClass} min-h-24 resize-y`}
              placeholder="Task description"
            />
            {errors.description && <span className={errorClass}>{errors.description}</span>}
          </div>

          <div>
            <label className={labelClass}>Category*</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`${fieldClass} bg-white cursor-pointer`}
            >
              <option value="">Select category from dropdown</option>
              {categories.map((item: string) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.category && <span className={errorClass}>{errors.category}</span>}
          </div>

          {formData.subtasks && formData.subtasks.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">
                Subtasks
                <span className="ml-2 text-sm text-gray-500 font-normal">
                  ({formData.subtasks.length})
                </span>
              </h2>

              {formData.subtasks.map((subtask, index) => {
                const subErr = errors.subtasks?.[index] ?? {};
                return (
                  <div
                    key={index}
                    className="border-2 border-gray-300 p-5 mb-4 rounded-md bg-gray-50"
                  >
                    <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2">
                      <h3 className="font-bold text-lg">Subtask {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(index)}
                        className="flex items-center gap-1 text-sm text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition-colors"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className={labelClass}>Title*</label>
                        <input
                          type="text"
                          name="title"
                          value={subtask.title}
                          onChange={(e) => handleSubtaskChange(index, e)}
                          className={fieldClass}
                          placeholder="Subtask title"
                        />
                        {subErr.title && <span className={errorClass}>{subErr.title}</span>}
                      </div>

                      <div>
                        <label className={labelClass}>Description*</label>
                        <textarea
                          name="description"
                          value={subtask.description}
                          onChange={(e) => handleSubtaskChange(index, e)}
                          className={`${fieldClass} min-h-16 resize-y`}
                          placeholder="Subtask description"
                        />
                        {subErr.description && (
                          <span className={errorClass}>{subErr.description}</span>
                        )}
                      </div>

                      <div>
                        <label className={labelClass}>Category*</label>
                        <select
                          name="category"
                          value={subtask.category}
                          onChange={(e) => handleSubtaskChange(index, e)}
                          className={`${fieldClass} bg-white cursor-pointer`}
                        >
                          <option value="">-- Select Category --</option>
                          {subCategories.map((item: string) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                        {subErr.category && (
                          <span className={errorClass}>{subErr.category}</span>
                        )}
                      </div>

                      <div>
                        <label className={labelClass}>Status*</label>
                        <input
                          type="text"
                          name="status"
                          value={subtask.status}
                          onChange={(e) => handleSubtaskChange(index, e)}
                          className={fieldClass}
                          placeholder="e.g. In Progress, Done, Blocked"
                        />
                        {subErr.status && <span className={errorClass}>{subErr.status}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button
            type="button"
            onClick={handleAddSubtask}
            className="flex items-center gap-2 bg-white text-black px-5 py-2.5 border-2 border-black rounded font-bold hover:bg-black hover:text-white transition-colors"
          >
            <Plus size={16} />
            Add Subtask
          </button>

          <div className="flex gap-4 mt-6 pt-4 border-t-2 border-black">
            <button
              type="button"
              onClick={handleUpdate}
              className="flex-1 bg-black text-white px-6 py-3 rounded border-2 border-black font-bold hover:bg-white hover:text-black transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate(`${pathTaskView}/${id}`)}
              className="flex-1 bg-white text-black px-6 py-3 rounded border-2 border-black font-bold hover:bg-black hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}