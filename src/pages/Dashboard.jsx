import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { Plus, Trash2, Edit2, LogOut } from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    const q = query(collection(db, "boards"), where("ownerId", "==", user.uid));
    return onSnapshot(q, (snap) => {
      setBoards(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  }, [user.uid]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await addDoc(collection(db, "boards"), {
      title: title.trim(),
      ownerId: user.uid,
      createdAt: new Date(),
    });
    setTitle("");
  };

  const handleDelete = (boardId) => {
    if (window.confirm("Are you sure you want to delete this board?")) {
      deleteDoc(doc(db, "boards", boardId));
    }
  };

  const handleEditStart = (board) => {
    setEditingId(board.id);
    setEditTitle(board.title);
  };

  const handleEditSave = async (boardId) => {
    if (!editTitle.trim()) return;
    await updateDoc(doc(db, "boards", boardId), {
      title: editTitle.trim(),
    });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-slate-800 shadow-2xl sticky top-0 z-50 border-b border-purple-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg">
              <Plus size={24} className="text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 drop-shadow-lg">
              My Workspace
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-cyan-300 font-bold hidden sm:inline tracking-wide">
              {user?.displayName || user?.email}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 transition-all duration-300 font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              title="Logout"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-12 animate-fadeInUp">
          <form
            onSubmit={handleCreate}
            className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-purple-500/30 backdrop-blur-sm"
          >
            <label className="block text-lg font-bold text-cyan-300 mb-4 tracking-wide">
              Create a New Board
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                className="flex-1 px-5 py-3 border border-purple-400/40 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all font-medium placeholder:text-slate-400"
                placeholder="Enter board title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:from-cyan-600 hover:to-blue-700 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap text-base tracking-wide"
              >
                <Plus size={20} /> Create Board
              </button>
            </div>
          </form>
        </div>

        <div>
          <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-10 tracking-wide">
            Your Boards
          </h2>
          {boards.length === 0 ? (
            <div className="text-center py-20 bg-slate-800 rounded-2xl border-2 border-dashed border-purple-500/40 backdrop-blur-sm">
              <div className="text-white mb-4 text-6xl">📋</div>
              <p className="text-cyan-300 text-xl font-bold">
                No boards yet. Create one to get started!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {boards.map((board) => (
                <div key={board.id} className="group relative animate-fadeInUp">
                  {editingId === board.id ? (
                    <div className="bg-slate-800 rounded-2xl shadow-2xl p-5 border-2 border-cyan-400/50 backdrop-blur-sm">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-4 py-3 border border-purple-400/40 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 mb-4 font-medium"
                        autoFocus
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEditSave(board.id)}
                          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-slate-600 to-slate-500 text-white rounded-lg text-sm font-bold hover:from-slate-700 hover:to-slate-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={`/board/${board.id}`}
                      className="block p-6 bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl border-t-4 border-cyan-400 transition-all duration-300 h-40 flex flex-col justify-between group hover:border-blue-400 transform hover:scale-105 active:scale-100 backdrop-blur-sm hover:bg-slate-700"
                    >
                      <h3 className="font-black text-lg text-cyan-300 group-hover:text-blue-300 transition line-clamp-3 tracking-wide">
                        {board.title}
                      </h3>
                      <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleEditStart(board);
                          }}
                          className="p-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(board.id);
                          }}
                          className="p-2.5 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
