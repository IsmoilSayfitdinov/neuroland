import { Plus, BookOpen, Loader2, RefreshCw } from "lucide-react";
import { useTopicsAdminPage } from "@/hooks/admin/useTopicsAdminPage";
import { CreateTopicModal } from "./components/CreateTopicModal";
import { TopicCard } from "./components/TopicCard";

export default function TopicsAdmin() {
  const {
    topics,
    isLoading,
    showCreateModal,
    setShowCreateModal,
    deleteTopic,
    rotateTopics,
    createTopic,
    assignGroup,
  } = useTopicsAdminPage();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-[28px] font-bold text-[#2D3142]">Mavzular boshqaruvi</h1>
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto pb-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-[#2D3142]">Mavzular boshqaruvi</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => rotateTopics.mutate()}
            disabled={rotateTopics.isPending}
            className="flex items-center gap-2 h-10 px-4 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[12px] font-bold rounded-xl transition-colors disabled:opacity-60"
          >
            {rotateTopics.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            Rotatsiya
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />Yangi mavzu
          </button>
        </div>
      </div>

      {!topics?.length ? (
        <div className="py-20 text-center bg-white rounded-[24px] border border-dashed border-gray-200">
          <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-[#9EB1D4] font-medium">Mavzular mavjud emas</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white text-[13px] font-bold rounded-[10px]"
          >
            <Plus className="w-4 h-4" />Mavzu yaratish
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onDelete={() => deleteTopic.mutate(topic.id)}
              onAssignGroup={(data) => assignGroup.mutate(data)}
              isAssigning={assignGroup.isPending}
            />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateTopicModal
          onClose={() => setShowCreateModal(false)}
          onSave={(data) => createTopic.mutate(data)}
          isPending={createTopic.isPending}
        />
      )}
    </div>
  );
}
