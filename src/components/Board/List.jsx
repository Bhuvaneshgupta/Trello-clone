import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  deleteDoc,
  doc,
  getDocs,
  limit,
  updateDoc,
} from "firebase/firestore";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Card from "./Card";
import { Trash2, Plus, Edit2 } from "lucide-react";

const List = ({ list, boardId }) => {
  const [cards, setCards] = useState([]);
  const [text, setText] = useState("");
  const [isEditingList, setIsEditingList] = useState(false);
  const [editListTitle, setEditListTitle] = useState(list.title);

  useEffect(() => {
    const q = query(
      collection(db, `boards/${boardId}/lists/${list.id}/cards`),
      orderBy("order", "asc"),
    );
    return onSnapshot(q, (snap) =>
      setCards(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
  }, [boardId, list.id]);

  const addCard = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const col = collection(db, `boards/${boardId}/lists/${list.id}/cards`);
    const q = query(col, orderBy("order", "desc"), limit(1));
    const snap = await getDocs(q);
    const maxOrder = snap.empty ? 0 : (snap.docs[0].data().order || 0) + 1;
    await addDoc(col, {
      content: text.trim(),
      createdAt: new Date(),
      order: maxOrder,
    });
    setText("");
  };

  const { setNodeRef } = useDroppable({
    id: `list-${list.id}`,
    data: { type: "List", listId: list.id },
  });

  const handleEditList = async (e) => {
    e.stopPropagation();
    if (!editListTitle.trim()) return;

    await updateDoc(doc(db, `boards/${boardId}/lists`, list.id), {
      title: editListTitle.trim(),
    });
    setIsEditingList(false);
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditListTitle(list.title);
    setIsEditingList(false);
  };

  return (
    <div
      ref={setNodeRef}
      className="bg-slate-800 backdrop-blur-sm w-72 sm:w-80 rounded-2xl flex flex-col max-h-[85vh] shadow-xl hover:shadow-2xl transition-all duration-300 flex-shrink-0 border border-purple-500/30 hover:border-cyan-400/50 transform hover:scale-105 active:scale-100"
    >
      {isEditingList ? (
        <div className="p-4 bg-slate-700 rounded-t-2xl flex flex-col gap-3 border-b border-purple-500/30">
          <input
            type="text"
            value={editListTitle}
            onChange={(e) => setEditListTitle(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-purple-400/40 bg-slate-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition font-medium"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEditList(e);
              if (e.key === "Escape") handleCancelEdit(e);
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={handleEditList}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xs py-2 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex-1 bg-gradient-to-r from-slate-600 to-slate-500 hover:from-slate-700 hover:to-slate-600 text-white text-xs py-2 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 flex justify-between items-center bg-slate-700 rounded-t-2xl border-b border-purple-500/30 hover:bg-slate-600 transition-all duration-200">
          <h3 className="font-black text-cyan-300 truncate mr-2 text-base sm:text-lg tracking-wide">
            {list.title}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingList(true);
              }}
              className="text-slate-400 hover:text-cyan-400 hover:bg-slate-600 p-2 rounded-lg transition-all duration-200 transform hover:scale-110"
              title="Edit list"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => {
                if (window.confirm("Delete this list and all its cards?")) {
                  deleteDoc(doc(db, `boards/${boardId}/lists`, list.id));
                }
              }}
              className="text-slate-400 hover:text-red-400 hover:bg-red-600/20 p-2 rounded-lg transition-all duration-200 transform hover:scale-110"
              title="Delete list"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="p-3 overflow-y-auto space-y-2 flex-1 min-h-[50px]">
        {cards.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            <p className="font-semibold text-cyan-300">No cards yet</p>
            <p className="text-xs mt-1 text-slate-500">Add one below</p>
          </div>
        ) : (
          <SortableContext
            items={cards.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                listId={list.id}
                boardId={boardId}
              />
            ))}
          </SortableContext>
        )}
      </div>

      <form
        onSubmit={addCard}
        className="p-3 border-t border-purple-500/30 bg-slate-700 rounded-b-2xl hover:bg-slate-600 transition-all duration-200"
      >
        <div className="flex items-center bg-slate-800 rounded-lg px-3 py-2 shadow-lg focus-within:ring-2 focus-within:ring-cyan-400 focus-within:ring-offset-1 transition-all border border-purple-500/30">
          <input
            className="bg-transparent border-none w-full text-sm outline-none p-1 placeholder:text-slate-500 text-cyan-300 font-medium"
            placeholder="Add a card..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            type="submit"
            className="text-cyan-400 hover:bg-slate-600 p-2 rounded-md transition-all duration-200 hover:scale-110 transform"
            title="Add card"
          >
            <Plus size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default List;
