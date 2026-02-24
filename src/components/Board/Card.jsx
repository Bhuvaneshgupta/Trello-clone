import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, GripVertical, Edit2 } from "lucide-react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useState } from "react";

const Card = ({ card, listId, boardId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(card.content);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "Card",
      card,
      listId,
      refPath: `boards/${boardId}/lists/${listId}/cards/${card.id}`,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm("Delete this card?")) {
      await deleteDoc(
        doc(db, `boards/${boardId}/lists/${listId}/cards`, card.id),
      );
    }
  };

  const handleEdit = async (e) => {
    e.stopPropagation();
    if (!editContent.trim()) return;

    await updateDoc(
      doc(db, `boards/${boardId}/lists/${listId}/cards`, card.id),
      { content: editContent.trim() },
    );
    setIsEditing(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setEditContent(card.content);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-slate-700 p-4 rounded-lg shadow-md border-2 border-cyan-400/50 flex flex-col gap-3 hover:border-blue-400/70 transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-purple-400/40 bg-slate-600 text-cyan-300 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none font-medium"
          rows="3"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) handleEdit(e);
            if (e.key === "Escape") handleCancel(e);
          }}
        />
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm py-2 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-gradient-to-r from-slate-600 to-slate-500 hover:from-slate-700 hover:to-slate-600 text-white text-sm py-2 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-slate-700 p-3 sm:p-4 rounded-lg shadow-md hover:shadow-lg border border-purple-500/30 group hover:border-cyan-400/50 transition-all duration-200 flex justify-between items-start gap-3 cursor-grab active:cursor-grabbing hover:bg-slate-600 transform hover:scale-105 active:scale-100"
    >
      <div className="flex items-start gap-2 flex-1 min-w-0">
        <div className="text-slate-500 group-hover:text-cyan-400 flex-shrink-0 transition-colors duration-200 mt-1">
          <GripVertical size={16} />
        </div>
        <span className="text-sm text-cyan-300 font-medium break-words leading-relaxed">
          {card.content}
        </span>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="text-slate-400 hover:text-cyan-400 hover:bg-slate-600 p-2 rounded-lg transition-all duration-200 transform hover:scale-110"
          title="Edit card"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={handleDelete}
          className="text-slate-400 hover:text-red-400 hover:bg-red-600/20 p-2 rounded-lg transition-all duration-200 transform hover:scale-110"
          title="Delete card"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default Card;
