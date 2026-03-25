import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader2, Stethoscope } from "lucide-react";
import { useTreatmentComplexes } from "@/hooks/admin/useTreatmentComplexes";
import { useSkills } from "@/hooks/admin/useSkills";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import type { TreatmentComplex, TreatmentComplexRequest } from "@/types/treatment-complex.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";

const COMPLEX_COLORS = [
  "from-blue-50 to-indigo-50 border-blue-100",
  "from-emerald-50 to-teal-50 border-emerald-100",
  "from-amber-50 to-orange-50 border-amber-100",
  "from-purple-50 to-fuchsia-50 border-purple-100",
];

const treatmentInfo = (
  <>
    <p>Bu bo'limda davolash komplekslarini yaratish va boshqarish mumkin. Har bir kompleks yosh toifasiga biriktiriladi.</p>
    <p><strong>Asosiy imkoniyatlar:</strong></p>
    <ul className="list-disc list-inside space-y-1">
      <li>Yangi davolash kompleksi yaratish</li>
      <li>Kompleksga nom, tavsif va yosh toifasini belgilash</li>
      <li>Mavjud komplekslarni tahrirlash va o'chirish</li>
    </ul>
  </>
);

export default function TreatmentComplexesAdmin() {
  const { useList, useCreate, useUpdate, useDelete } = useTreatmentComplexes();
  const { data: complexes, isLoading } = useList();
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();

  const { useAgeGroups } = useSkills();
  const { data: ageGroups } = useAgeGroups();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<TreatmentComplex | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openCreate = () => { setEditing(null); setIsModalOpen(true); };
  const openEdit = (c: TreatmentComplex) => { setEditing(c); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditing(null); };

  const handleSave = (data: TreatmentComplexRequest) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, data }, { onSuccess: closeModal });
    } else {
      createMutation.mutate(data, { onSuccess: closeModal });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Davolash komplekslari" infoTitle="Davolash komplekslari" infoContent={treatmentInfo} />
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto pb-10 space-y-6">
      <PageHeader
        title="Davolash komplekslari"
        action={
          <button onClick={openCreate} className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-[12px] text-[14px] font-medium shadow-sm transition-colors">
            <Plus className="w-[18px] h-[18px]" />
            Kompleks qo'shish
          </button>
        }
      />

      {!complexes?.length ? (
        <EmptyState icon={Stethoscope} title="Komplekslar mavjud emas" description="Hozircha davolash kompleksi yaratilmagan." action={{ label: "Kompleks qo'shish", onClick: openCreate, icon: Plus }} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {complexes.map((c, idx) => (
            <div key={c.id} className={cn("bg-gradient-to-br p-6 rounded-[20px] border hover:shadow-lg transition-all group", COMPLEX_COLORS[idx % COMPLEX_COLORS.length])}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/80 rounded-[12px] flex items-center justify-center text-[18px] font-bold text-[#2D3142] shadow-sm">
                    {c.number}
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#2D3142]">{c.name}</h3>
                    <p className="text-[12px] text-[#6B7A99]">{c.age_min_year} — {c.age_max_year} yosh</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(c)} className="p-2 bg-white/80 hover:bg-white text-gray-500 hover:text-blue-500 rounded-[10px] transition-colors shadow-sm">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteId(c.id)} className="p-2 bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 rounded-[10px] transition-colors shadow-sm">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {c.description && (
                <p className="text-[13px] text-[#6B7A99] mb-3 line-clamp-2">{c.description}</p>
              )}

              {c.age_groups && c.age_groups.length > 0 && ageGroups && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {c.age_groups.map((agId) => {
                    const ag = ageGroups.find((a) => a.id === agId);
                    return ag ? (
                      <span key={agId} className="px-2.5 py-1 text-[11px] font-medium bg-white/70 text-[#2D3142] rounded-full">
                        {ag.name}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ComplexModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        initialData={editing}
        isPending={createMutation.isPending || updateMutation.isPending}
        ageGroups={ageGroups || []}
        nextNumber={((complexes?.reduce((max, c) => Math.max(max, c.number), 0) ?? 0) + 1) as 1 | 2 | 3 | 4}
      />

      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }}
        title="Kompleksni o'chirish"
        description="Ushbu davolash kompleksini o'chirmoqchimisiz?"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

/** Parse "0-1", "1-2 yosh", "3-4" etc. → { min, max } */
function parseAgeRange(name: string): { min: number; max: number } | null {
  const m = name.match(/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)/);
  if (!m) return null;
  return { min: parseFloat(m[1]), max: parseFloat(m[2]) };
}

function ComplexModal({ isOpen, onClose, onSave, initialData, isPending, ageGroups, nextNumber }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TreatmentComplexRequest) => void;
  initialData?: TreatmentComplex | null;
  isPending: boolean;
  ageGroups: { id: number; name: string }[];
  nextNumber: number;
}) {
  const { register, handleSubmit, reset } = useForm<{ name: string; description?: string | null }>();
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<number[]>([]);

  const autoNumber = initialData?.number ?? nextNumber;

  // Compute min/max from selected age groups
  const computedAgeRange = (() => {
    if (!selectedAgeGroups.length) return { min: 0, max: 0 };
    let min = Infinity;
    let max = -Infinity;
    for (const agId of selectedAgeGroups) {
      const ag = ageGroups.find((a) => a.id === agId);
      if (!ag) continue;
      const range = parseAgeRange(ag.name);
      if (range) {
        if (range.min < min) min = range.min;
        if (range.max > max) max = range.max;
      }
    }
    return { min: min === Infinity ? 0 : min, max: max === -Infinity ? 0 : max };
  })();

  useEffect(() => {
    if (initialData) {
      reset({ name: initialData.name, description: initialData.description });
      setSelectedAgeGroups(initialData.age_groups || []);
    } else {
      reset({ name: "", description: "" });
      setSelectedAgeGroups([]);
    }
  }, [initialData, isOpen, reset]);

  const toggleAgeGroup = (id: number) => {
    setSelectedAgeGroups((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const onSubmit = (data: { name: string; description?: string | null }) => {
    onSave({
      number: autoNumber as any,
      name: data.name,
      description: data.description,
      age_min_year: computedAgeRange.min,
      age_max_year: computedAgeRange.max,
      age_groups: selectedAgeGroups,
    });
  };

  const inputCls = "w-full h-[48px] px-4 bg-[#F8F9FB] border-none rounded-[12px] text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all placeholder:text-[#9EB1D4]";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-[24px] sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Kompleksni tahrirlash" : "Yangi kompleks"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-[80px_1fr] gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#2D3142]">Raqami</label>
              <div className="h-[48px] px-4 bg-[#F0F2F5] rounded-[12px] flex items-center justify-center text-[18px] font-bold text-[#2D3142]">
                {autoNumber}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#2D3142]">Nomi</label>
              <input {...register("name", { required: true })} placeholder="Masalan: Nutq chiqarish" className={inputCls} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#2D3142]">Tavsif</label>
            <textarea {...register("description")} placeholder="Kompleks haqida..." className="w-full h-[80px] p-4 bg-[#F8F9FB] border-none rounded-[12px] text-[14px] outline-none focus:ring-2 focus:ring-[#4D89FF]/10 transition-all placeholder:text-[#9EB1D4] resize-none" />
          </div>

          {ageGroups.length > 0 && (
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#2D3142]">Yosh guruhlari</label>
              <div className="flex flex-wrap gap-2">
                {ageGroups.map((ag) => (
                  <button
                    key={ag.id}
                    type="button"
                    onClick={() => toggleAgeGroup(ag.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all",
                      selectedAgeGroups.includes(ag.id)
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-[#F8F9FB] text-[#6B7A99] border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {ag.name}
                  </button>
                ))}
              </div>
              {selectedAgeGroups.length > 0 && (
                <p className="text-[12px] text-[#9EB1D4] mt-1">
                  Yosh diapazoni: <span className="font-bold text-[#2D3142]">{computedAgeRange.min} — {computedAgeRange.max} yosh</span>
                </p>
              )}
            </div>
          )}

          <DialogFooter className="pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-[12px] text-[14px] font-medium text-[#2D3142] hover:bg-gray-100 transition-colors">Bekor qilish</button>
            <button type="submit" disabled={isPending} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-2.5 rounded-[12px] text-[14px] font-medium disabled:opacity-70 transition-colors">
              {isPending ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
