import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function AccordionSection({
  id,
  title,
  icon: Icon,
  count,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  icon: typeof ChevronDown;
  count?: number;
  open: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/[0.03]"
      >
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/15 text-brand-400">
          <Icon size={16} />
        </span>
        <span className="flex-1 text-sm font-bold text-slate-100">{title}</span>
        {typeof count === "number" && count > 0 && (
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-slate-300">
            {count}
          </span>
        )}
        <ChevronDown
          size={18}
          className={`text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/5 px-4 py-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
