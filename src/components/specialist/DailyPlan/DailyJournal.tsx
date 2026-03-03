import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Image as ImageIcon, Upload } from "lucide-react";

export default function DailyJournal() {
  return (
    <Card className="border-none shadow-xs rounded-[32px] bg-white h-full">
      <CardContent className="p-10 space-y-10">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">Kunlik jurnal</h3>
          <p className="text-sm text-slate-400">Mashg'ulot natijalarini qayd eting</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mashg'ulot nomi</p>
            <p className="text-sm font-bold text-slate-800">Kognitiv</p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bajarilgan mashqlar</p>
            <p className="text-sm font-bold text-slate-800">Sakrash</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Izohlar</p>
          <textarea 
            placeholder="Bugungi mashg'ulot natijalarini yozing..."
            className="w-full h-32 bg-[#F8FAFC] border border-slate-100 rounded-[24px] p-6 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="border-2 border-dashed border-slate-100 rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-blue-200 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all">
              <Video size={24} />
            </div>
            <p className="text-xs font-bold text-slate-500">Video yuklash</p>
            <Button variant="ghost" className="h-9 px-4 rounded-xl flex items-center gap-2 text-[10px] font-bold bg-slate-50 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Upload size={12} />
              Tanlash
            </Button>
          </div>

          <div className="border-2 border-dashed border-slate-100 rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-blue-200 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all">
              <ImageIcon size={24} />
            </div>
            <p className="text-xs font-bold text-slate-500">Rasm yuklash</p>
            <Button variant="ghost" className="h-9 px-4 rounded-xl flex items-center gap-2 text-[10px] font-bold bg-slate-50 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Upload size={12} />
              Tanlash
            </Button>
          </div>
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl text-white font-bold text-base shadow-lg shadow-blue-100 transition-all">
          Saqlash
        </Button>
      </CardContent>
    </Card>
  );
}
