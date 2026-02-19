import { Brain, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-green-400 to-blue-500 p-1.5 rounded-lg text-white">
              <Brain size={20} />
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
              NEUROLAND
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            Bolalar neyro-rivojlanishini raqamli nazorat qilishning zamonaviy yechimi.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 mb-4">Platforma</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><a href="#" className="hover:text-blue-600">Biz haqimizda</a></li>
            <li><a href="#" className="hover:text-blue-600">Xizmatlar</a></li>
            <li><a href="#" className="hover:text-blue-600">Narxlar</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 mb-4">Yordam</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><a href="#" className="hover:text-blue-600">Bog'lanish</a></li>
            <li><a href="#" className="hover:text-blue-600">F.A.Q</a></li>
            <li><a href="#" className="hover:text-blue-600">Maxfiylik siyosati</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 mb-4">Ijtimoiy tarmoqlar</h4>
          <div className="flex gap-4">
            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><Facebook size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-pink-600 transition-colors"><Instagram size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-sky-500 transition-colors"><Twitter size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-blue-700 transition-colors"><Linkedin size={20} /></a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
        © {new Date().getFullYear()} Neuroland. Barcha huquqlar himoyalangan.
      </div>
    </footer>
  );
};
