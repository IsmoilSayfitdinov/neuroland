import { useState } from "react";
import { Plus, BookOpen, Loader2, RefreshCw, X, Info } from "lucide-react";
import { useTopicsAdminPage } from "@/hooks/admin/useTopicsAdminPage";
import { useGroups } from "@/hooks/admin/useGroups";
import { CreateTopicModal } from "./components/CreateTopicModal";
import { TopicCard } from "./components/TopicCard";
import { InfoModal } from "@/components/admin/ui/InfoModal";
import { cn } from "@/lib/utils";

const topicsInfo = (
  <>
    <p>Bu bo'limda mashg'ulot mavzularini yaratish va boshqarish mumkin.</p>
    <p><strong>Asosiy imkoniyatlar:</strong></p>
    <ul className="list-disc list-inside space-y-1">
      <li>Yangi mavzu yaratish (nom, tavsif, mashqlar)</li>
      <li>Mavzularga mashq (exercise) qo'shish</li>
      <li>Mavzularni guruhlar o'rtasida rotatsiya qilish</li>
      <li>Mavzu tafsilotlarini ko'rish va tahrirlash</li>
    </ul>
  </>
);

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

  const { useGroupsList } = useGroups();
  const { data: groups } = useGroupsList();

  const [showTopicsInfo, setShowTopicsInfo] = useState(false);
  const [showRotateModal, setShowRotateModal] = useState(false);
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);

  const toggleGroup = (id: number) => {
    setSelectedGroupIds((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleRotate = () => {
    if (selectedGroupIds.length < 2) return;
    rotateTopics.mutate(selectedGroupIds, {
      onSuccess: () => {
        setShowRotateModal(false);
        setSelectedGroupIds([]);
      },
    });
  };

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
        <div className="flex items-center gap-2.5">
          <h1 className="text-[28px] font-bold text-[#2D3142]">Mavzular boshqaruvi</h1>
          <button type="button" onClick={() => setShowTopicsInfo(true)} className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors">
            <Info className="w-4 h-4 text-blue-500" />
          </button>
        </div>
        <InfoModal isOpen={showTopicsInfo} onClose={() => setShowTopicsInfo(false)} title="Mavzular boshqaruvi">{topicsInfo}</InfoModal>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRotateModal(true)}
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

      {/* Rotate Modal */}
      {showRotateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowRotateModal(false)} />
          <div className="relative bg-white rounded-[24px] w-full max-w-[440px] p-7 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[18px] font-bold text-[#2D3142]">Mavzu rotatsiyasi</h3>
                <p className="text-[12px] text-[#9EB1D4] mt-0.5">Guruhlar orasida mavzularni almashtirish</p>
              </div>
              <button onClick={() => setShowRotateModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                <X className="w-4 h-4 text-[#9EB1D4]" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-[13px] font-medium text-[#6B7A99]">
                Rotatsiya tartibida guruhlarni tanlang (kamida 2 ta):
              </p>
              <p className="text-[11px] text-[#9EB1D4]">
                A → B, B → C, C → D, D → A tartibida almashadi
              </p>

              <div className="space-y-2 max-h-[250px] overflow-y-auto">
                {groups?.map((group) => {
                  const isSelected = selectedGroupIds.includes(group.id);
                  const order = selectedGroupIds.indexOf(group.id);
                  return (
                    <div
                      key={group.id}
                      onClick={() => toggleGroup(group.id)}
                      className={cn(
                        "flex items-center justify-between p-3.5 rounded-xl cursor-pointer border-2 transition-all",
                        isSelected
                          ? "border-amber-400 bg-amber-50"
                          : "border-gray-100 hover:border-gray-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {isSelected && (
                          <span className="w-6 h-6 bg-amber-400 text-white rounded-full flex items-center justify-center text-[11px] font-bold">
                            {order + 1}
                          </span>
                        )}
                        <div>
                          <p className="text-[14px] font-bold text-[#2D3142]">{group.name}</p>
                          {group.age_group_name && (
                            <p className="text-[12px] text-[#9EB1D4]">{group.age_group_name}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-[12px] text-[#9EB1D4]">{group.children_count} bola</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRotateModal(false)}
                className="flex-1 h-[46px] rounded-[12px] border border-gray-200 text-[#2D3142] text-[13px] font-bold hover:bg-gray-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleRotate}
                disabled={selectedGroupIds.length < 2 || rotateTopics.isPending}
                className="flex-1 h-[46px] rounded-[12px] bg-amber-500 hover:bg-amber-600 text-white text-[13px] font-bold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {rotateTopics.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Rotatsiya ({selectedGroupIds.length} guruh)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
