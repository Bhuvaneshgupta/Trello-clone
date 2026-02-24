import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  orderBy,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  collectionGroup,
  where,
  documentId,
  updateDoc,
} from "firebase/firestore";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import List from "../components/Board/List";
import { ArrowLeft, Layout } from "lucide-react";

const BoardView = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [title, setTitle] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [activeCard, setActiveCard] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  useEffect(() => {
    const q = query(
      collection(db, `boards/${boardId}/lists`),
      orderBy("createdAt", "asc"),
    );
    return onSnapshot(q, (snap) =>
      setLists(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
  }, [boardId]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    console.log("drag end", {
      active: active?.id,
      over: over?.id,
      activeData: active?.data,
    });
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    try {
      console.log(
        "active data/refPath:",
        active.data?.current?.refPath,
        active.data?.current?.listId,
      );

      let activeData = active.data?.current?.card || null;
      let activeRef = null;
      let activeListId = active.data?.current?.listId || null;
      const activeRefPath = active.data?.current?.refPath || null;

      if (activeRefPath) {
        activeRef = doc(db, activeRefPath);
        if (!activeListId && activeRef.path) {
          const parts = activeRef.path.split("/");

          activeListId = parts[3];
        }
        if (!activeData) {
          const snap = await getDocs(
            query(
              collectionGroup(db, "cards"),
              where(documentId(), "==", activeId),
            ),
          );
          if (!snap.empty) activeData = snap.docs[0].data();
        }
      } else if (!activeData) {
        const activeQ = query(
          collectionGroup(db, "cards"),
          where(documentId(), "==", activeId),
        );
        const activeSnap = await getDocs(activeQ);
        if (activeSnap.empty) return;
        const activeDoc = activeSnap.docs[0];
        activeData = activeDoc.data();
        activeRef = activeDoc.ref;
        activeListId = activeRef.parent.parent.id;
      }

      let destListId = null;
      if (String(overId).startsWith("list-")) {
        destListId = String(overId).replace("list-", "");
      } else {
        destListId = over.data?.current?.listId || null;
        if (!destListId) {
          const overQ = query(
            collectionGroup(db, "cards"),
            where(documentId(), "==", overId),
          );
          const overSnap = await getDocs(overQ);
          if (!overSnap.empty) {
            destListId = overSnap.docs[0].ref.parent.parent.id;
          }
        }
      }
      console.log("destListId:", destListId);
      if (!destListId) return;

      const destCol = collection(
        db,
        `boards/${boardId}/lists/${destListId}/cards`,
      );
      const destSnap = await getDocs(query(destCol, orderBy("order", "asc")));
      const destDocs = destSnap.docs.map((d) => ({
        id: d.id,
        ref: d.ref,
        data: d.data(),
      }));

      let newIndex = destDocs.length;
      if (!String(overId).startsWith("list-")) {
        const idx = destDocs.findIndex((d) => d.id === overId);
        if (idx !== -1) newIndex = idx;
      }

      if (activeListId === destListId) {
        const reordered = destDocs.filter((d) => d.id !== activeId);

        const activeInDest = destDocs.find((d) => d.id === activeId) || {
          data: activeData,
        };
        reordered.splice(newIndex, 0, {
          id: activeId,
          ref: activeRef,
          data: activeInDest.data,
        });

        const updates = reordered.map((d, i) => updateDoc(d.ref, { order: i }));
        await Promise.all(updates);
      } else {
        const newOrder = newIndex;
        const created = await addDoc(destCol, {
          ...activeData,
          order: newOrder,
        });

        const after = destDocs.slice(newIndex);
        await Promise.all(
          after.map((d, i) => updateDoc(d.ref, { order: newIndex + 1 + i })),
        );

        await deleteDoc(activeRef);
      }
    } catch (err) {
      console.error("drag end error", err);
    }
    setActiveId(null);
    setActiveCard(null);
  };

  const handleDragStart = (event) => {
    console.log("drag start", {
      active: event.active.id,
      data: event.active.data,
    });
    setActiveId(event.active.id);
    setActiveCard(event.active.data?.current?.card || null);
  };

  const handleDragOver = (event) => {
    console.log("drag over", { active: event.active.id, over: event.over?.id });
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveCard(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-500 to-indigo-600 overflow-hidden">
      <nav className="p-4 bg-black/20 backdrop-blur-md flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="hover:bg-white/20 p-2 rounded-full transition-all"
          >
            <ArrowLeft />
          </button>
          <div className="flex items-center gap-2">
            <Layout size={20} />{" "}
            <span className="font-bold hidden sm:inline">Board View</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 p-6 flex gap-4 overflow-x-auto items-start custom-scrollbar">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragCancel={handleDragCancel}
        >
          {lists.map((list) => (
            <List key={list.id} list={list} boardId={boardId} />
          ))}
          <DragOverlay>
            {activeCard ? (
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                {activeCard.content}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!title) return;
            await addDoc(collection(db, `boards/${boardId}/lists`), {
              title,
              createdAt: new Date(),
            });
            setTitle("");
          }}
          className="bg-white/20 p-3 rounded-xl min-w-[280px] hover:bg-white/30 transition-all"
        >
          <input
            className="w-full bg-transparent p-2 text-white placeholder:text-white/60 outline-none font-medium"
            placeholder="+ Add another list"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
};

export default BoardView;
