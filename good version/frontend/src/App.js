
// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AddUser } from './components/AddUser';
import { EditUser } from './components/EditUser';
import { UserList } from './components/UserList';
import { Layout } from './components/Layout';
import { NotFound } from './components/common/NotFound';
import { ToastContainer } from 'react-toastify';
import "./App.css";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<UserList />} />
            <Route path="/add" element={<AddUser />} />
            <Route path="/edit/:id" element={<EditUser />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      <ToastContainer />
    </QueryClientProvider>
  );
}