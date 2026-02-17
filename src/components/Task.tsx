import { Formik, Form, ErrorMessage, Field } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { pathSubTask, categories, pathDashboard } from "@/constants";
import { ArrowLeft } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
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

const MainTaskSchema = Yup.object().shape({
  date: Yup.string().required("* Date is Required"),
  // .matches(
  //   /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
  //   "* Date must be in DD/MM/YYYY format",
  // ),
  title: Yup.string().required("* Title Required"),
  description: Yup.string().required("* Description Required"),
  category: Yup.string().required("* Please select any one category"),
  subtaskRadio: Yup.string().required("* Please select a option"),
});

export default function Task() {
  const navigate = useNavigate();
  const handleClick = () => navigate(pathDashboard);

  const [savedTasks, setSavedTasks] = useLocalStorage<MainTaskType[]>(
    "savedTasks",
    [],
  );

  const handleContinueToSubtasks = (values: typeof initialValues) => {
    const tempId = Date.now().toString();
    navigate(`${pathSubTask}/${tempId}`, { state: { mainTaskData: values } });
  };

  const handleSubmit = (values: typeof initialValues) => {
    const newTask: MainTaskType = {
      ...values,
      id: Date.now().toString(),
    };
    const updateSaved = [...savedTasks, newTask];
    setSavedTasks(updateSaved);
    toast.success("Task has been created");
    navigate(pathDashboard);
  };

  const location = useLocation();
  const initialValues = {
    id: "",
    date: location.state?.mainTaskData?.date ?? "",
    title: location.state?.mainTaskData?.title ?? "",
    description: location.state?.mainTaskData?.description ?? "",
    category: location.state?.mainTaskData?.category ?? "",
    subtaskRadio: location.state?.mainTaskData?.subtaskRadio ?? "",
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={MainTaskSchema}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {(formik) => (
          <Form className="max-w-2xl mx-auto bg-white p-8 border-2 border-black rounded-lg">
            <h1 className="text-3xl font-bold mb-8 text-center border-b-4 border-black pb-4">
              Create Task
            </h1>
            <button
              type="button"
              className="p-2 m-2 flex items-center justify-center gap-2 bg-black text-white border-2 border-black rounded cursor-pointer hover:bg-white hover:text-black transition-colors"
              onClick={handleClick}
            >
              <ArrowLeft size={16} />
              <span>Back To Dashboard</span>
            </button>

            <div className="mb-6">
              <label className="block font-bold mb-2 text-sm">
                Date Of Creation*
              </label>
              <Field
                name="date"
                type="date"
                placeholder="DD/MM/YYYY"
                className="w-full p-2.5 border-2 border-black rounded text-sm font-mono"
              />
              {/* <p className="text-xs mt-1 text-gray-600 italic">
                Accepts: 13/02/2026 | Rejects: 2026-02-13 | Rejects: 32/15/2026
              </p> */}
              <ErrorMessage
                name="date"
                component="span"
                className="text-red-600 text-xs mt-1 font-bold block"
              />
            </div>

            <div className="mb-6">
              <label className="block font-bold mb-2 text-sm">Title*</label>
              <Field
                name="title"
                type="text"
                placeholder="Give Task Title..."
                className="w-full p-2.5 border-2 border-black rounded text-sm"
              />
              <ErrorMessage
                name="title"
                component="span"
                className="text-red-600 text-xs mt-1 font-bold block"
              />
            </div>

            <div className="mb-6">
              <label className="block font-bold mb-2 text-sm">
                Description*
              </label>
              <Field
                name="description"
                as="textarea"
                placeholder="Description..."
                className="w-full p-2.5 border-2 border-black rounded text-sm min-h-24 resize-y"
              />
              <ErrorMessage
                name="description"
                component="span"
                className="text-red-600 text-xs mt-1 font-bold block"
              />
            </div>

            <div className="mb-6">
              <label className="block font-bold mb-2 text-sm">Category*</label>
              <Field
                name="category"
                as="select"
                className="w-full p-2.5 border-2 border-black rounded text-sm bg-white cursor-pointer"
              >
                <option value="">Select category from dropdown</option>
                {categories.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="category"
                component="span"
                className="text-red-600 text-xs mt-1 font-bold block"
              />
            </div>

            <div className="mb-6">
              <label className="block font-bold mb-3 text-sm">
                Would you like to create subtasks?*
              </label>
              <div className="flex gap-6 mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Field
                    name="subtaskRadio"
                    type="radio"
                    value="yes"
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Field
                    name="subtaskRadio"
                    type="radio"
                    value="no"
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm">No</span>
                </label>
              </div>
              <ErrorMessage
                name="subtaskRadio"
                component="span"
                className="text-red-600 text-xs mt-1 font-bold block"
              />
            </div>

            {formik.values.subtaskRadio === "yes" && (
              <button
                type="button"
                onClick={async () => {
                  const errors = await formik.validateForm();
                  if (Object.keys(errors).length === 0) {
                    handleContinueToSubtasks(formik.values);
                  } else {
                    formik.setTouched({
                      date: true,
                      title: true,
                      description: true,
                      category: true,
                      subtaskRadio: true,
                    });
                  }
                }}
                className="w-full bg-black text-white px-4 py-4 border-4 border-black rounded cursor-pointer text-lg font-bold hover:bg-white hover:text-black transition-colors"
              >
                Continue to Subtasks
              </button>
            )}

            {formik.values.subtaskRadio === "no" && (
              <button
                type="submit"
                className="w-full bg-black text-white px-4 py-4 border-4 border-black rounded cursor-pointer text-lg font-bold hover:bg-white hover:text-black transition-colors"
              >
                Submit Task
              </button>
            )}

            {formik.values.subtaskRadio === "" && (
              <div className="w-full bg-gray-200 text-gray-500 px-4 py-4 border-4 border-gray-300 rounded text-lg font-bold text-center">
                Please select an option above
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}
