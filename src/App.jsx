import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BoardView from "./pages/BoardView";
import { ProtectedRoute } from "./components/Layout/ProtectedRoute";

function App() {
  const { user } = useAuth();
  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/board/:boardId"
          element={
            <ProtectedRoute>
              <BoardView />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
export default App;
