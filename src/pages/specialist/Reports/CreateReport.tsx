import { useState, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Image, Upload, X, Loader2 } from "lucide-react";
import { useReports } from "@/hooks/specialist/useReports";
import { useGroups } from "@/hooks/admin/useGroups";
import { CustomSelect } from "@/components/ui/custom-select";
import { cn } from "@/lib/utils";

// Topics — fetched from TopicsAPI
import { useQuery } from "@tanstack/react-query";
import { TopicsAPI } from "@/api/topics.api";

export default function CreateReport() {
  const navigate = useNavigate();
  const { useCreateReport } = useReports();
  const { useGroupsList } = useGroups();
  const createReport = useCreateReport();

  const { data: groups } = useGroupsList();
  const { data: topics } = useQuery({
    queryKey: ["topics"],
    queryFn: () => TopicsAPI.listTopics(),
  });

  const [form, setForm] = useState({
    topic_id: "" as string | number,
    game_name: "",
    group_id: "" as string | number,
    notes: "",
  });
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof typeof form, val: string | number) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleFileAdd = (files: FileList | null) => {
    if (!files) return;
    setMediaFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const handleRemoveFile = (idx: number) =>
    setMediaFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleSave = async () => {
    await createReport.mutateAsync({
      topic_id: form.topic_id ? Number(form.topic_id) : null,
      group_id: form.group_id ? Number(form.group_id) : null,
      game_name: form.game_name,
      notes: form.notes,
      media_files: mediaFiles,
    });
    navigate({ to: "/specialist/reports" });
  };

  const inputCls =
    "w-full h-[48px] bg-[#F8F9FB] rounded-[10px] px-4 text-[14px] text-[#2D3142] outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-[#9EB1D4]";

  return (
    <div className="flex flex-col gap-6 pb-10  mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate({ to: "/specialist/reports" })}
          className="w-9 h-9 bg-white border border-gray-200 rounded-[10px] flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-[#2D3142]" />
        </button>
        <h1 className="text-xl font-bold text-[#2D3142]">Hisobot yaratish</h1>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
        <h2 className="text-[15px] font-bold text-[#2D3142]">Yangi hisobot yozish</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Mavzu */}
          <div className="space-y-2">
            <label className="block text-[13px] font-semibold text-[#2D3142]">Mavzu</label>
            <CustomSelect
              options={topics?.map((t) => ({ label: t.title, value: t.id })) ?? []}
              value={form.topic_id}
              onChange={(v) => set("topic_id", v)}
              placeholder="Mavzuni tanlang"
              bgBtnColor="bg-[#F8F9FB]"
            />
          </div>

          {/* O'yin nomi */}
          <div className="space-y-2">
            <label className="block text-[13px] font-semibold text-[#2D3142]">O'yin nomi</label>
            <input
              className={inputCls}
              placeholder="O'yin nomini kiriting"
              value={form.game_name}
              onChange={(e) => set("game_name", e.target.value)}
            />
          </div>

          {/* Guruh */}
          <div className="space-y-2">
            <label className="block text-[13px] font-semibold text-[#2D3142]">Guruh</label>
            <CustomSelect
              options={groups?.map((g) => ({ label: g.name, value: g.id })) ?? []}
              value={form.group_id}
              onChange={(v) => set("group_id", v)}
              placeholder="Guruhni tanlang"
              bgBtnColor="bg-[#F8F9FB]"
            />
          </div>

          {/* Izoh */}
          <div className="space-y-2">
            <label className="block text-[13px] font-semibold text-[#2D3142]">Izoh</label>
            <input
              className={inputCls}
              placeholder="Mashg'ulot haqida izoh yozing..."
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>
        </div>

        {/* Media upload */}
        <div className="space-y-3">
          <label className="block text-[13px] font-semibold text-[#2D3142]">
            Rasm yoki video yuklash
          </label>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => imageRef.current?.click()}
              className="flex items-center gap-2 h-[42px] px-4 border border-gray-200 rounded-[10px] text-[13px] font-semibold text-[#2D3142] hover:bg-gray-50 transition-colors"
            >
              <Image className="w-4 h-4 text-[#9EB1D4]" />
              Rasm yuklash
            </button>
            <button
              type="button"
              onClick={() => videoRef.current?.click()}
              className="flex items-center gap-2 h-[42px] px-4 border border-gray-200 rounded-[10px] text-[13px] font-semibold text-[#2D3142] hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-4 h-4 text-[#9EB1D4]" />
              Video yuklash
            </button>

            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileAdd(e.target.files)}
            />
            <input
              ref={videoRef}
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileAdd(e.target.files)}
            />
          </div>

          {/* Preview */}
          {mediaFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {mediaFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-[#F8F9FB] rounded-[10px] px-3 py-2"
                >
                  <span className="text-[12px] text-[#2D3142] font-medium truncate max-w-[160px]">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    className="text-[#9EB1D4] hover:text-red-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            disabled={createReport.isPending}
            className={cn(
              "h-[44px] px-8 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-bold rounded-[12px] transition-colors",
              createReport.isPending && "opacity-60 cursor-not-allowed"
            )}
          >
            {createReport.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Saqlash"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
