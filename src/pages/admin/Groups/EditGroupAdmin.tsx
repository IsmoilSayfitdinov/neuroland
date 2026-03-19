import { ChevronLeft, Search, Loader2, Users, Check } from "lucide-react";
import { useNavigate, useParams, useBlocker } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useSpecialists } from "@/hooks/admin/useSpecialists";
import { useSkills } from "@/hooks/admin/useSkills";
import { useGroups } from "@/hooks/admin/useGroups";
import { toast } from "sonner";
import { CustomSelect } from "@/components/ui/custom-select";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { groupSchema, type GroupSchema } from "@/schemas/groups";
import { GROUP_SHIFTS, SPECIALIST_ROLES, DEFAULT_MAX_CHILDREN } from "@/constants/groups";

export default function EditGroupAdmin() {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });
  const groupId = Number(id);

  const { useSpecialistsList } = useSpecialists();
  const { useAgeGroups } = useSkills();
  const { useGroupDetail, useUpdateGroup, useUnassignedPatients } = useGroups();

  const { data: specialists, isLoading: isLoadingSpecialists } = useSpecialistsList();
  const { data: ageGroups, isLoading: isLoadingAgeGroups } = useAgeGroups();
  const { data: group, isLoading: isLoadingGroup } = useGroupDetail(groupId);
  const { data: unassignedChildren, isLoading: isLoadingUnassigned } = useUnassignedPatients();
  const { mutate: updateGroup, isPending: isUpdating } = useUpdateGroup();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChildren, setSelectedChildren] = useState<number[]>([]);
  const [originalChildren, setOriginalChildren] = useState<number[]>([]);
  const [startDate, setStartDate] = useState("");
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [isSubmittingInternal, setIsSubmittingInternal] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<GroupSchema>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      shift: "morning",
      age_group_id: "",
      max_children: String(DEFAULT_MAX_CHILDREN),
      start_date: "",
      Logoped: "", Neyropsixolog: "", AFK: "", Defektolog: "", Koordinator: "",
    },
  });

  const selectedShift = watch("shift");
  const selectedAgeGroupId = watch("age_group_id");

  // Populate form when group data loads
  useEffect(() => {
    if (group) {
      const originalIds = group.children.map((c) => c.id);
      setSelectedChildren(originalIds);
      setOriginalChildren(originalIds);
      setStartDate(group.start_date || "");

      const roleMap: Record<string, string> = {};
      group.specialists.forEach((spec) => {
        const foundRole = SPECIALIST_ROLES.find((r) =>
          spec.specialist_type_title?.toLowerCase().includes(r.toLowerCase())
        );
        if (foundRole) {
          roleMap[foundRole] = spec.id.toString();
        }
      });

      // Map legacy shift values ("1"/"2") to new format
      const shiftMap: Record<string, string> = { "1": "morning", "2": "afternoon" };
      const normalizedShift = shiftMap[group.shift] || group.shift || "morning";

      reset({
        name: group.name,
        shift: normalizedShift,
        age_group_id: group.age_group_id.toString(),
        max_children: String(group.max_children || DEFAULT_MAX_CHILDREN),
        Logoped: roleMap["Logoped"] || "",
        Neyropsixolog: roleMap["Neyropsixolog"] || "",
        AFK: roleMap["AFK"] || "",
        Defektolog: roleMap["Defektolog"] || "",
        Koordinator: roleMap["Koordinator"] || "",
      });
    }
  }, [group, reset]);

  const childrenDirty =
    JSON.stringify([...selectedChildren].sort()) !==
    JSON.stringify([...originalChildren].sort());

  const isFormDirty = isDirty || childrenDirty;

  const blocker = useBlocker({
    shouldBlockFn: ({ next, current }: { next: any; current: any }) => {
      if (isSubmittingInternal || !isFormDirty) return false;
      return next.pathname !== current.pathname;
    },
    withResolver: true,
  }) as any;

  useEffect(() => {
    if (blocker.status === "blocked") {
      setShowLeaveModal(true);
    }
  }, [blocker.status]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isFormDirty && !isSubmittingInternal) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isFormDirty, isSubmittingInternal]);

  const handleConfirmLeave = () => {
    blocker.proceed();
    setShowLeaveModal(false);
  };

  const handleCancelLeave = () => {
    blocker.reset();
    setShowLeaveModal(false);
  };

  const combinedChildren = [
    ...(group?.children || []),
    ...(unassignedChildren || []),
  ].filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);

  const filteredChildren = combinedChildren.filter((c) =>
    c.fio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleChildSelection = (id: number) => {
    setSelectedChildren((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    );
  };

  const maxChildren = Number(watch("max_children")) || DEFAULT_MAX_CHILDREN;

  const onSubmit = (data: GroupSchema) => {
    const specialistIds = SPECIALIST_ROLES
      .map((role) => data[role])
      .filter((id): id is string => !!id)
      .map(Number);

    setIsSubmittingInternal(true);

    updateGroup(
      {
        id: groupId,
        data: {
          name: data.name,
          shift: data.shift,
          age_group_id: Number(data.age_group_id),
          max_children: Number(data.max_children) || DEFAULT_MAX_CHILDREN,
          start_date: startDate || undefined,
          specialist_ids: specialistIds,
          child_ids: selectedChildren,
        },
      },
      {
        onSuccess: () => navigate({ to: "/admin/groups" }),
        onError: () => {
          setIsSubmittingInternal(false);
          toast.error("Xatolik yuz berdi");
        },
      }
    );
  };

  const isLoading =
    isLoadingSpecialists || isLoadingAgeGroups || isLoadingGroup || isLoadingUnassigned;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto pb-10">
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => navigate({ to: "/admin/groups" })}
          className="w-10 h-10 bg-white border border-gray-200 rounded-[12px] flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-[#2D3142]" />
        </button>
        <h1 className="text-[24px] font-bold text-[#2D3142]">Guruhni tahrirlash</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit, (errs) => {
        const firstErr = Object.values(errs)[0];
        if (firstErr?.message) toast.error(String(firstErr.message));
      })}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
              <h2 className="text-[18px] font-bold text-[#2D3142] mb-1">Guruh ma'lumotlari</h2>
              <div className="space-y-5 mt-6">
                <div>
                  <label className="block text-[14px] font-medium text-[#2D3142] mb-2">Guruh nomi</label>
                  <input
                    {...register("name")}
                    type="text"
                    className={cn(
                      "w-full h-[46px] px-4 rounded-[12px] bg-[#F8F9FB] border focus:bg-white focus:border-[#4D89FF] focus:outline-none transition-colors text-[14px]",
                      errors.name ? "border-red-400" : "border-transparent"
                    )}
                  />
                  {errors.name && (
                    <p className="mt-1 text-[12px] text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[14px] font-medium text-[#2D3142] mb-2">Smena tanlang</label>
                  <div className="space-y-3">
                    {GROUP_SHIFTS.map((shift) => (
                      <label key={shift.value}
                        className={cn("flex items-center gap-3 p-4 rounded-[12px] border cursor-pointer transition-colors",
                          selectedShift === shift.value ? "border-[#4D89FF] bg-[#F0F5FF]/50" : "border-gray-200 hover:border-gray-300")}>
                        <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                          selectedShift === shift.value ? "border-[#4D89FF]" : "border-gray-300")}>
                          {selectedShift === shift.value && <div className="w-2.5 h-2.5 bg-[#4D89FF] rounded-full" />}
                        </div>
                        <span className="text-[14px] font-medium text-[#2D3142]">{shift.label}</span>
                        <input type="radio" className="hidden" {...register("shift")} value={shift.value} />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[14px] font-medium text-[#2D3142] mb-2">Max bolalar soni</label>
                    <input {...register("max_children")} type="number" placeholder="15"
                      className="w-full h-[46px] px-4 rounded-[12px] bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-[#4D89FF] focus:outline-none transition-colors text-[14px]" />
                  </div>
                  <div>
                    <label className="block text-[14px] font-medium text-[#2D3142] mb-2">Boshlanish sanasi</label>
                    <CustomDatePicker value={startDate} onChange={setStartDate} placeholder="Sanani tanlang" className="bg-[#F8F9FB] border-none rounded-[12px]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] font-medium text-[#2D3142] mb-2">Yosh toifasi</label>
                  <CustomSelect
                    options={
                      ageGroups?.map((group) => ({
                        label: group.name,
                        value: group.id.toString(),
                      })) || []
                    }
                    value={selectedAgeGroupId}
                    onChange={(val) =>
                      setValue("age_group_id", val.toString(), { shouldDirty: true })
                    }
                    placeholder="Tanlang..."
                  />
                  {errors.age_group_id && (
                    <p className="mt-1 text-[12px] text-red-500">{errors.age_group_id.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
              <h2 className="text-[18px] font-bold text-[#2D3142] mb-1">Mutaxassislarni biriktirish</h2>
              <div className="space-y-5 mt-6">
                {SPECIALIST_ROLES.map((role) => (
                  <div key={role}>
                    <label className="block text-[14px] font-medium text-[#2D3142] mb-2">{role}</label>
                    <CustomSelect
                      options={
                        specialists?.map((spec) => ({
                          label: `${spec.fio} (${spec.specialist_type_title})`,
                          value: spec.id.toString(),
                        })) || []
                      }
                      value={watch(role) || ""}
                      onChange={(val) => setValue(role, val.toString(), { shouldDirty: true })}
                      placeholder="Tanlang..."
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate({ to: "/admin/groups" })}
                className="px-8 py-3 bg-white border border-gray-200 text-[#2D3142] text-[13px] font-bold rounded-[12px] hover:bg-gray-50 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-8 py-3 bg-[#2563EB] text-white text-[13px] font-bold rounded-[12px] hover:bg-[#1D4ED8] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                Saqlash
              </button>
            </div>
          </div>

          <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm h-fit">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[18px] font-bold text-[#2D3142]">Bolalarni biriktirish</h2>
              <div className="flex items-center gap-2 text-[14px] text-[#6B7A99]">
                <Users className="w-4 h-4" />
                <span>Tanlandi: {selectedChildren.length} / {maxChildren}</span>
              </div>
            </div>

            <div className="relative my-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9EB1D4]" />
              <input
                type="text"
                placeholder="Bolalarni qidiring..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[46px] pl-10 pr-4 rounded-[12px] bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-[#4D89FF] focus:outline-none transition-colors text-[14px]"
              />
            </div>

            <div className="border border-gray-100 rounded-[12px] overflow-hidden">
              {filteredChildren.map((child, idx) => {
                const isSelected = selectedChildren.includes(child.id);
                return (
                  <div
                    key={child.id}
                    onClick={() => toggleChildSelection(child.id)}
                    className={cn(
                      "flex items-center justify-between p-4 cursor-pointer transition-all",
                      isSelected ? "bg-[#F0F5FF]/50" : "hover:bg-gray-50",
                      idx !== filteredChildren.length - 1 ? "border-b border-gray-100" : ""
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("w-5 h-5 rounded-[6px] border-2 flex items-center justify-center shrink-0 transition-colors",
                        isSelected ? "bg-[#4D89FF] border-[#4D89FF]" : "border-gray-300")}>
                        {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                      </div>
                      <span className="text-[13px] font-bold text-[#2D3142]">{child.fio}</span>
                      <span className="text-[11px] text-[#9EB1D4]">
                        {new Date().getFullYear() - new Date(child.birth_date).getFullYear()} yosh
                      </span>
                    </div>
                    <div className="px-3 py-1 rounded-full border border-gray-200 text-[#2D3142] text-[10px] font-bold tracking-wider uppercase bg-white">
                      {child.diagnosis || "Tashxis yo'q"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </form>

      <ConfirmModal
        isOpen={showLeaveModal}
        onClose={handleCancelLeave}
        onConfirm={handleConfirmLeave}
        title="Sahifadan chiqish"
        description="Sizda saqlanmagan ma'lumotlar bor. Haqiqatan ham chiqib ketmoqchimisiz? Kiritilgan ma'lumotlar saqlanmaydi."
        confirmText="Chiqish"
        cancelText="Qolish"
        variant="danger"
      />
    </div>
  );
}
