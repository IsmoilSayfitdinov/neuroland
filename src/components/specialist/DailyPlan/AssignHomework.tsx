import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Check, Play } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const videos = [
  { id: 1, thumbnail: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=250&fit=crop" },
  { id: 2, thumbnail: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=250&fit=crop" },
];

export default function AssignHomework() {
  const [selectedVideo, setSelectedVideo] = useState(1);

  return (
    <Card className="border-none shadow-xs rounded-[32px] bg-white h-full line">
      <CardContent className="p-10 space-y-8">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">Uyga vazifa belgilash</h3>
          <p className="text-sm text-slate-400">Bilim Markazi'dan video tayinlang</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {videos.map((video) => (
            <div 
              key={video.id}
              onClick={() => setSelectedVideo(video.id)}
              className="relative group cursor-pointer rounded-[24px] overflow-hidden aspect-[1.4]"
            >
              <img 
                src={video.thumbnail} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                alt="Video"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white">
                  <Play size={20} fill="currentColor" />
                </div>
              </div>
              
              <div className={cn(
                "absolute top-3 left-3 w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all",
                selectedVideo === video.id 
                  ? "bg-blue-600 border-blue-600 text-white" 
                  : "bg-white/50 border-white text-transparent"
              )}>
                <Check size={14} strokeWidth={4} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Uy vazifa topshirish muddati</p>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Topshirish kunini belgilang"
                className="w-full h-14 bg-[#F8FAFC] border border-slate-100 rounded-2xl pl-6 pr-12 text-sm text-slate-400 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vaqti</p>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Vaqtini kiriting"
                className="w-full h-14 bg-[#F8FAFC] border border-slate-100 rounded-2xl pl-6 pr-12 text-sm text-slate-400 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <Clock className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kechikkan uy vazifa muddati</p>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Topshirish kunini belgilang"
                className="w-full h-14 bg-[#F8FAFC] border border-slate-100 rounded-2xl pl-6 pr-12 text-sm text-slate-400 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vaqti</p>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Vaqtini kiriting"
                className="w-full h-14 bg-[#F8FAFC] border border-slate-100 rounded-2xl pl-6 pr-12 text-sm text-slate-400 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <Clock className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
            </div>
          </div>
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl text-white font-bold text-base shadow-lg shadow-blue-100 transition-all">
          Yuborish
        </Button>
      </CardContent>
    </Card>
  );
}
