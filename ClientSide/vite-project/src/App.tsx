import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { MyTaskPage } from './pages/MyTaskPage';
import { NewTaskPage } from './pages/NewTaskPage';
import { EditTaskPage } from './pages/EditTaskPage';
import CoverPage from './pages/CoverPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CoverPage />} />
        <Route element={<MainLayout />}>
          <Route path="/my-tasks" element={<MyTaskPage />} />
          <Route path="/new-task" element={<NewTaskPage />} />
          <Route path="/edit-task/:id" element={<EditTaskPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;