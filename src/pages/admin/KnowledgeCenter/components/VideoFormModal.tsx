import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, Link2, AlignLeft, Clock, Wrench, BookOpen, Dumbbell, AlertTriangle } from "lucide-react";
import { CustomSelect } from "@/components/ui/custom-select";
import { useVideos } from "@/hooks/admin/useVideos";
import { useSkills } from "@/hooks/admin/useSkills";
import { videoSchema, type VideoSchema } from "@/schemas/videos";
import type { VideoOut } from "@/types/videos.types";

interface VideoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  video?: VideoOut | null;
}

export function VideoFormModal({ isOpen, onClose, video }: VideoFormModalProps) {
  const isEdit = !!video;
  const [showConfirm, setShowConfirm] = useState(false);
  const { useCreateVideo, useUpdateVideo } = useVideos();
  const { useSections, useAgeGroups, useExercises } = useSkills();

  const createVideo = useCreateVideo();
  const updateVideo = useUpdateVideo();

  const { data: sections } = useSections();
  const { data: ageGroups } = useAgeGroups();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<VideoSchema>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: "",
      video_url: "",
      duration: "",
      equipments: "",
      section_id: "",
      exercise_id: "",
    },
  });

  const selectedSectionId = watch("section_id");
  const { data: exercises } = useExercises(Number(selectedSectionId));

  useEffect(() => {
    if (video) {
      reset({
        title: video.title,
        video_url: video.video_url,
        duration: video.duration || "",
        equipments: video.equipments || "",
        section_id: video.section_id.toString(),
        exercise_id: video.exercise_id?.toString() || "",
      });
    } else {
      reset({
        title: "",
        video_url: "",
        duration: "",
        equipments: "",
        section_id: "",
        exercise_id: "",
      });
    }
  }, [video, reset, isOpen]);

  const onSubmit = (data: VideoSchema) => {
    // age_group_id bo'limdan avtomatik aniqlanadi
    const sectionId = Number(data.section_id);
    const section = sections?.find((s) => s.id === sectionId);
    const ageGroupId = section?.age_group_id ?? ageGroups?.find((ag) =>
      ag.sections?.some((s) => s.id === sectionId)
    )?.id ?? 0;

    const payload = {
      ...data,
      age_group_id: ageGroupId,
      section_id: sectionId,
      exercise_id: data.exercise_id ? Number(data.exercise_id) : null,
    };

    if (isEdit && video) {
      updateVideo.mutate({ videoId: video.id, data: payload }, { onSuccess: onClose });
    } else {
      createVideo.mutate(payload, { onSuccess: onClose });
    }
  };

  const sectionsOptions = useMemo(
    () => ageGroups?.flatMap((ag) =>
      ag.sections.map((s) => ({ label: `${s.name} (${ag.name})`, value: s.id.toString() }))
    ) || sections?.map((s) => ({ label: s.name, value: s.id.toString() })) || [],
    [ageGroups, sections]
  );
  const exercisesOptions = useMemo(
    () => exercises?.map((e) => ({ label: e.name, value: e.id.toString() })) || [],
    [exercises]
  );

  const isLoading = createVideo.isPending || updateVideo.isPending;

  const handleClose = () => {
    if (isDirty) {
      setShowConfirm(true);
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-white rounded-[28px] w-full max-w-[560px] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
          <div>
            <h3 className="text-[20px] font-bold text-[#2D3142]">
              {isEdit ? "Videodarsni tahrirlash" : "Yangi videodars qo'shish"}
            </h3>
            <p className="text-[13px] text-[#9EB1D4] mt-0.5">
              {isEdit ? "Ma'lumotlarni yangilang" : "Bilim markaziga yangi video qo'shing"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-[#9EB1D4]" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-8 py-6 space-y-5 max-h-[60vh] overflow-y-auto">

            {/* Sarlavha */}
            <div>
              <label className="flex items-center gap-1.5 text-[13px] font-bold text-[#2D3142] mb-2">
                <AlignLeft className="w-3.5 h-3.5 text-[#9EB1D4]" />
                Sarlavha
              </label>
              <input
                {...register("title")}
                placeholder="Video sarlavhasini kiriting"
                className="w-full h-[50px] px-4 rounded-[12px] bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-[#4D89FF] focus:outline-none text-[14px] text-[#2D3142] transition-colors placeholder:text-[#9EB1D4]"
              />
              {errors.title && (
                <p className="text-red-500 text-[12px] mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Video URL */}
            <div>
              <label className="flex items-center gap-1.5 text-[13px] font-bold text-[#2D3142] mb-2">
                <Link2 className="w-3.5 h-3.5 text-[#9EB1D4]" />
                Video URL (YouTube / Vimeo)
              </label>
              <input
                {...register("video_url")}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full h-[50px] px-4 rounded-[12px] bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-[#4D89FF] focus:outline-none text-[14px] text-[#2D3142] transition-colors placeholder:text-[#9EB1D4]"
              />
              {errors.video_url && (
                <p className="text-red-500 text-[12px] mt-1">{errors.video_url.message}</p>
              )}
            </div>

            {/* Bo'lim */}
            <div>
              <label className="flex items-center gap-1.5 text-[13px] font-bold text-[#2D3142] mb-2">
                <BookOpen className="w-3.5 h-3.5 text-[#9EB1D4]" />
                Bo'lim
              </label>
              <CustomSelect
                options={sectionsOptions}
                value={watch("section_id")}
                onChange={(val) => {
                  setValue("section_id", val.toString(), { shouldValidate: true });
                  setValue("exercise_id", "");
                }}
                placeholder="Tanlang"
              />
              {errors.section_id && (
                <p className="text-red-500 text-[12px] mt-1">{errors.section_id.message}</p>
              )}
            </div>

            {/* Davomiylik + Mashq */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-[13px] font-bold text-[#2D3142] mb-2">
                  <Clock className="w-3.5 h-3.5 text-[#9EB1D4]" />
                  Davomiyligi
                </label>
                <input
                  {...register("duration")}
                  placeholder="Masalan: 12:45"
                  className="w-full h-[50px] px-4 rounded-[12px] bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-[#4D89FF] focus:outline-none text-[14px] text-[#2D3142] transition-colors placeholder:text-[#9EB1D4]"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[13px] font-bold text-[#2D3142] mb-2">
                  <Dumbbell className="w-3.5 h-3.5 text-[#9EB1D4]" />
                  Mashq{" "}
                  <span className="text-[#9EB1D4] font-normal">(ixtiyoriy)</span>
                </label>
                <CustomSelect
                  options={exercisesOptions}
                  value={watch("exercise_id")}
                  onChange={(val) => setValue("exercise_id", val.toString())}
                  placeholder="Tanlang"
                  disabled={!selectedSectionId}
                />
              </div>
            </div>

            {/* Jihozlar */}
            <div>
              <label className="flex items-center gap-1.5 text-[13px] font-bold text-[#2D3142] mb-2">
                <Wrench className="w-3.5 h-3.5 text-[#9EB1D4]" />
                Kerakli jihozlar{" "}
                <span className="text-[#9EB1D4] font-normal">(ixtiyoriy)</span>
              </label>
              <input
                {...register("equipments")}
                placeholder="Masalan: Koptok, gilamcha..."
                className="w-full h-[50px] px-4 rounded-[12px] bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-[#4D89FF] focus:outline-none text-[14px] text-[#2D3142] transition-colors placeholder:text-[#9EB1D4]"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-8 py-5 border-t border-gray-50">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 h-[48px] rounded-[14px] border border-gray-200 text-[#2D3142] text-[14px] font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-[48px] rounded-[14px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[14px] font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saqlanmoqda...
                </>
              ) : isEdit ? (
                "Saqlash"
              ) : (
                "Qo'shish"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Confirm discard modal */}
      {showConfirm && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="bg-white rounded-[24px] shadow-2xl p-8 w-full max-w-[360px] mx-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                <AlertTriangle className="w-7 h-7 text-amber-500" />
              </div>
              <h4 className="text-[18px] font-bold text-[#2D3142] mb-2">
                O'zgarishlar saqlanmaydi
              </h4>
              <p className="text-[13px] text-[#9EB1D4] leading-relaxed">
                Kiritilgan ma'lumotlar yo'qoladi. Haqiqatan ham chiqmoqchimisiz?
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 h-[44px] rounded-[12px] border border-gray-200 text-[#2D3142] text-[14px] font-bold hover:bg-gray-50 transition-colors"
              >
                Qaytish
              </button>
              <button
                onClick={() => { setShowConfirm(false); onClose(); }}
                className="flex-1 h-[44px] rounded-[12px] bg-red-500 hover:bg-red-600 text-white text-[14px] font-bold transition-colors"
              >
                Ha, chiqish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
