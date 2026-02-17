import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import Dashboard from './components/Dashboard'
import TaskList from './components/TaskList'
import Task from './components/Task'
import SubTasks from './components/SubTasks'
import { pathDashboard,pathSubTask,pathTask,pathTasklist,pathTaskView,pathEditView } from './constants'
import FullTaskView from './components/FullTaskView'
import EditTask from './components/EditTask'


const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path={pathDashboard} element={<Layout/>}>
      <Route path={pathDashboard} element={<Dashboard/>}/>
      <Route path={pathTask} element={<Task/>}/>
      <Route path={`${pathSubTask}/:id`} element={<SubTasks/>}/>
      <Route path={pathTasklist} element={<TaskList/>}/>
      <Route path={`${pathTaskView}/:id`} element={<FullTaskView/>}/>
      <Route path={`${pathEditView}/:id`} element={<EditTask/>}/>
    </Route>
  )
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
