import Navbar from "./components/Navbar";
import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </div>
  )
}

export default App;

