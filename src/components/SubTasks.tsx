import { Formik, Form, ErrorMessage, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { pathDashboard, subCategories } from "@/constants";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { toast } from "sonner"

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

const SubTaskSchema = Yup.object().shape({
  subtasks: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required("* Title Required"),
      description: Yup.string().required("* Description Required"),
      category: Yup.string().required("* Please select category"),
      status: Yup.string().required("* Please enter the status of your subtask"),
    }),
  ),
});

export default function SubTasks() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [allTasks, setAllTasks] = useLocalStorage<MainTaskType[]>("savedTasks", []);

  const handleBack = () => navigate(pathDashboard);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <Formik
        initialValues={{
          subtasks: [
            { title: "", description: "", category: "", status: "" },
          ],
        }}
        onSubmit={(values) => {
          if (!id) {
            navigate(pathDashboard);
            return;
          }

          const parentTask = allTasks.find((task:MainTaskType) => task.id === id);
          if (!parentTask) {
            console.error("Parent task not found");
            navigate(pathDashboard);
            return;
          }

          const updatedTask = allTasks.map((task: MainTaskType) => {
            if (task.id === id)
              return {
                ...task,
                subtasks: values.subtasks,
              };
            return task;
          });

          setAllTasks(updatedTask);
          toast.success("Task has been created with these subtasks")
          navigate(pathDashboard);
        }}
        validationSchema={SubTaskSchema}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {(formik) => (
          <>
            <Form className="max-w-3xl mx-auto bg-white p-8 border-2 border-black rounded-lg">
              <h1 className="text-3xl font-bold mb-8 text-center border-b-4 border-black pb-4">
                Create SubTasks
              </h1>
              <button
                type="button"
                className="p-2 m-2 flex items-center justify-center gap-2 bg-black text-white border-2 border-black rounded cursor-pointer hover:bg-white hover:text-black transition-colors"
                onClick={handleBack}
              >
                <ArrowLeft size={16} />
                <span>Back To MainTask </span>
              </button>

              <FieldArray name="subtasks">
                {({ push, remove }) => (
                  <div>
                    {formik.values.subtasks.map((_, index) => (
                      <div
                        key={index}
                        className="border-2 border-gray-800 p-5 mb-6 rounded-md bg-gray-50"
                      >
                        <h2 className="text-xl font-bold mb-5 border-b-2 border-gray-600 pb-3">
                          SubTask {index + 1}
                        </h2>

                        <div className="mb-5">
                          <label className="block font-bold mb-2 text-sm">
                            Title
                          </label>
                          <Field
                            name={`subtasks.${index}.title`}
                            type="text"
                            placeholder="Enter title"
                            className="w-full p-2.5 border-2 border-black rounded text-sm"
                          />
                          <ErrorMessage
                            name={`subtasks.${index}.title`}
                            component="div"
                            className="text-red-700 text-xs mt-1 font-bold"
                          />
                        </div>

                        <div className="mb-5">
                          <label className="block font-bold mb-2 text-sm">
                            Description
                          </label>
                          <Field
                            name={`subtasks.${index}.description`}
                            as="textarea"
                            placeholder="Enter description"
                            className="w-full p-2.5 border-2 border-black rounded text-sm min-h-20 resize-y"
                          />
                          <ErrorMessage
                            name={`subtasks.${index}.description`}
                            component="div"
                            className="text-red-700 text-xs mt-1 font-bold"
                          />
                        </div>

                        <div className="mb-5">
                          <label className="block font-bold mb-2 text-sm">
                            Category
                          </label>
                          <p className="text-xs mb-2 text-gray-600">
                            Select category from dropdown
                          </p>
                          <Field
                            as="select"
                            name={`subtasks.${index}.category`}
                            className="w-full p-2.5 border-2 border-black rounded text-sm bg-white cursor-pointer"
                          >
                            <option value="">-- Select Category --</option>
                            {subCategories.map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name={`subtasks.${index}.category`}
                            component="div"
                            className="text-red-700 text-xs mt-1 font-bold"
                          />
                        </div>

                        <div className="mb-5">
                          <label className="block font-bold mb-2 text-sm">
                            Status
                          </label>
                          <p className="text-xs mb-2 text-gray-600">
                            What's the status of your task?
                          </p>
                          <Field
                            name={`subtasks.${index}.status`}
                            type="text"
                            placeholder="Enter status"
                            className="w-full p-2.5 border-2 border-black rounded text-sm"
                          />
                          <ErrorMessage
                            name={`subtasks.${index}.status`}
                            component="div"
                            className="text-red-700 text-xs mt-1 font-bold"
                          />
                        </div>

                        {formik.values.subtasks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="bg-black text-white px-5 py-2.5 border-2 border-black rounded cursor-pointer text-sm font-bold mt-2 hover:bg-white hover:text-black transition-colors"
                          >
                            Remove SubTask
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        push({
                          title: "",
                          description: "",
                          category: "",
                          status: "",
                        })
                      }
                      className="bg-white text-black px-6 py-3 border-4 border-black rounded cursor-pointer text-base font-bold mb-5 hover:bg-black hover:text-white transition-colors"
                    >
                      + Add Subtask
                    </button>
                  </div>
                )}
              </FieldArray>

              <button
                type="submit"
                className="w-full bg-black text-white px-4 py-4 border-4 border-black rounded cursor-pointer text-lg font-bold mt-2 hover:bg-white hover:text-black transition-colors"
              >
                Create Task with these Subtasks
              </button>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}