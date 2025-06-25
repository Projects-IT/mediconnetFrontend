import  'bootstrap/dist/css/bootstrap.css';
import './App.css'
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import Root from './Root';
import Home from './components/home/Home';
import Appointment from './components/appointment/Appointment'
import About from './components/about/About';
import Consultants from './components/consultants/Consultants';
import Login from './components/login/Login'
import Register from './components/register/Register'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import PreviousAppointments from './components/appointment/PreviousAppointments';
import Documents from './components/documents/Documents';
import Contact from './components/contact/Contact';
import DoctorProfile from './components/consultants/DoctorProfile';
import { createContext } from 'react';
import { pdfjs } from 'react-pdf';
import ChatSystem from './components/chat/ChatSystem';

// Create API URL context
export const ApiUrlContext = createContext();
const API_URL = "https://mediconnetbackend.onrender.com";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();
function App() {
  
  let router=createBrowserRouter([
    {
      path:'',
      element:<Root></Root>,
      children:[
        {
          path:'',
          element:<Home></Home>
        },
        {
          path:"appointment",
          element:<Appointment></Appointment>,
          
        },
        {
          path:"previous-appointments",
          element:<PreviousAppointments></PreviousAppointments>
        },
        {
          path:"consultants",
          element:<Consultants></Consultants>
        },
        {
          path:"doctor/:id",
          element:<DoctorProfile></DoctorProfile>
        },
        {
          path:"about",
          element:<About></About>
        },
        {
          path:"login",
          element:<Login></Login>
        },
        {
          path:"register",
          element:<Register></Register>
        },
        {
          path:"document/:doctorName",
          element:<Documents></Documents>
        },
        {
          path:"contact",
          element:<Contact></Contact>
        }
      ]
    }
  ])
  
  return (
    <ApiUrlContext.Provider value={API_URL}>
    <div className="App">
      <RouterProvider router={router}/>
        <ChatSystem />
      <ToastContainer position='top-center'/>
    </div>
    </ApiUrlContext.Provider>
  );
}

export default App;
