import { MousePointer, Hand, Square, Circle, Pencil, Trash2, Type, Slash, X } from "lucide-react";

interface InstructionProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Instruction = ({ isOpen, onClose }: InstructionProps) => {
  if (!isOpen) return null;

  const steps = [
    {
      icon: <Hand className="w-4 h-4" />,
      title: "Pan Canvas",
      shortcut: "1",
      desc: "Select the Grab tool → double click + drag anywhere to move the whole canvas."
    },
    {
      icon: <MousePointer className="w-4 h-4" />,
      title: "Select & Move Shapes",
      shortcut: "2", 
      desc: "Hover near a shape's edge → cursor changes → click to select (purple highlight). Double click + drag to move shape."
    },
    {
      icon: <Square className="w-4 h-4" />,
      title: "Draw Rectangle",
      shortcut: "3",
      desc: "Double click + drag to create a rectangle."
    },
    {
      icon: <Circle className="w-4 h-4" />,
      title: "Draw Ellipse", 
      shortcut: "4",
      desc: "Double click + drag to create an ellipse."
    },
    {
      icon: <Slash className="w-4 h-4" />,
      title: "Draw Line",
      shortcut: "5",
      desc: "Double click + drag to create a line."
    },
    {
      icon: <Pencil className="w-4 h-4" />,
      title: "Freehand Drawing",
      shortcut: "6", 
      desc: "Double click + drag to draw freely."
    },
    {
      icon: <Type className="w-4 h-4" />,
      title: "Add Text",
      shortcut: "7",
      desc: "Click anywhere to type → press Enter or click outside to place text. (Double click with cursor tool also opens text)."
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      title: "Delete Shape", 
      shortcut: "Del",
      desc: "With a shape selected (purple highlight), press Delete to remove it."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-default">
      {/* Simple backdrop */}
      <div 
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      
      {/* Clean modal */}
      <div className="relative bg-zinc-900 rounded-lg shadow-xl max-w-lg w-full max-h-[85vh] overflow-hidden border border-zinc-700">
        
        {/* Simple header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700">
          <h2 className="text-lg font-semibold text-zinc-100">How to use</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                {/* Simple icon */}
                <div className="w-8 h-8 bg-zinc-800 rounded flex items-center justify-center text-zinc-300 flex-shrink-0 mt-0.5">
                  {step.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-zinc-200 text-sm">
                      {step.title}
                    </span>
                    <kbd className="px-2 py-0.5 text-xs bg-zinc-800 text-zinc-400 rounded border border-zinc-700">
                      {step.shortcut}
                    </kbd>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Simple footer */}
        <div className="px-6 py-4 border-t border-zinc-700">
          <button
            onClick={onClose}
            className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded transition-colors"
          >
            Got it
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #27272a;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #52525b;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #71717a;
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: #27272a;
        }
      `}</style>
    </div>
  );
};