import { ArrowLeft, BookOpen, Users, Calendar, Plus, Loader2, Trash2, Unlink } from "lucide-react";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { useTopicDetailAdminPage } from "@/hooks/admin/useTopicDetailAdminPage";
import { formatDateRange } from "@/hooks/admin/useTopicsAdminPage";
import { AddExerciseModal } from "./components/AddExerciseModal";
import { ExerciseCard } from "./components/ExerciseCard";

export default function TopicDetailAdmin() {
  const {
    topic,
    isLoading,
    categoryName,
    showAddModal,
    setShowAddModal,
    deleteModalOpen,
    setDeleteModalOpen,
    deleteTopic,
    detachGroup,
    addExercise,
    removeExercise,
    goBack,
  } = useTopicDetailAdminPage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!topic) return null;

  return (
    <div className="flex flex-col gap-6 pb-10 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={goBack}
            className="w-9 h-9 bg-white border border-gray-200 rounded-[10px] flex items-center justify-center hover:bg-gray-50">
            <ArrowLeft className="w-4 h-4 text-[#2D3142]" />
          </button>
          <h1 className="text-[22px] font-bold text-[#2D3142]">Mavzu tafsilotlari</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition-colors">
            <Plus className="w-4 h-4" />Mashq qo'shish
          </button>
          <button onClick={() => setDeleteModalOpen(true)}
            className="w-10 h-10 flex items-center justify-center bg-white border border-red-100 hover:bg-red-50 text-red-400 rounded-xl transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Topic info */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-[20px] font-bold text-[#2D3142]">{topic.title}</h2>
          {categoryName && <span className="shrink-0 px-3 py-1 bg-[#EEF4FF] text-[#4D89FF] text-[12px] font-bold rounded-full">{categoryName}</span>}
        </div>
        <div className="flex flex-wrap gap-4">
          {topic.group_assignments?.length > 0 ? (
            topic.group_assignments.map((g) => (
              <div key={g.id} className="flex items-center gap-2 text-[13px] text-[#5A6484] bg-gray-50 px-3 py-1.5 rounded-lg">
                <Users className="w-3.5 h-3.5 text-[#9EB1D4]" />
                <span>{g.group_name}</span>
                {g.is_active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                <button onClick={() => detachGroup.mutate(g.group)} className="ml-1 text-red-400 hover:text-red-600" title="Guruhdan uzish">
                  <Unlink className="w-3 h-3" />
                </button>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2 text-[13px] text-[#9EB1D4]">
              <Users className="w-3.5 h-3.5" /><span>Guruh biriktirilmagan</span>
            </div>
          )}
          {topic.start_date && topic.end_date && (
            <div className="flex items-center gap-2 text-[13px] text-[#9EB1D4]">
              <Calendar className="w-3.5 h-3.5" /><span>{formatDateRange(topic.start_date, topic.end_date)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Exercises */}
      <h2 className="text-[18px] font-bold text-[#2D3142]">Mashqlar ({topic.exercises?.length || 0})</h2>
      {!topic.exercises?.length ? (
        <div className="py-20 text-center bg-white rounded-[24px] border border-dashed border-gray-200">
          <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-[#9EB1D4] font-medium">Mashqlar mavjud emas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {topic.exercises.map((ex) => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              onRemove={() => removeExercise.mutate(ex.id)}
              isRemoving={removeExercise.isPending}
            />
          ))}
        </div>
      )}

      {showAddModal && (
        <AddExerciseModal
          onClose={() => setShowAddModal(false)}
          onSave={(data) => addExercise.mutate(data)}
          isPending={addExercise.isPending}
        />
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => deleteTopic.mutate()}
        title="Mavzuni o'chirish"
        description={`"${topic.title}" mavzusini o'chirmoqchimisiz? Bu qaytarib bo'lmaydi.`}
        isLoading={deleteTopic.isPending}
      />
    </div>
  );
}
