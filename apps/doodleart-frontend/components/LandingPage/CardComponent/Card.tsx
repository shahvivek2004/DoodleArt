import { LucideIcon } from "lucide-react";
interface CardProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100">
    <div className="bg-linear-to-br from-purple-100 to-green-100 p-4 rounded-full mb-4">
      <Icon className="w-8 h-8 text-purple-600" />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{children}</p>
  </div>
);
