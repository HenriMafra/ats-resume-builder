import { useId } from "react";
import clsx from "clsx";

// ── Campo de texto rotulado ────────────────────────────────────────────────
export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  invalid,
  hint,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  invalid?: boolean;
  hint?: string;
  maxLength?: number;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        className={clsx("field", invalid && "field-invalid")}
      />
      {invalid && hint && <p className="text-[11px] text-rose-400">{hint}</p>}
    </div>
  );
}

// ── Área de texto rotulada ─────────────────────────────────────────────────
export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  maxLength,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        rows={rows}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field resize-y leading-relaxed"
      />
    </div>
  );
}

// ── Select rotulado ────────────────────────────────────────────────────────
export function Select<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="field cursor-pointer appearance-none bg-[length:1rem] pr-8"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.6rem center",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-ink-850 text-slate-100">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── Botão de ícone (acessível) ─────────────────────────────────────────────
export function IconButton({
  onClick,
  title,
  children,
  disabled,
  danger,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      disabled={disabled}
      className={clsx(
        "grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none",
        danger && "hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
      )}
    >
      {children}
    </button>
  );
}

// ── Cabeçalho de cada item de lista CRUD (com reordenar/remover) ────────────
export function ItemCard({
  title,
  index,
  count,
  onUp,
  onDown,
  onRemove,
  children,
}: {
  title: string;
  index: number;
  count: number;
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-ink-900/50 p-3">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="truncate text-sm font-semibold text-slate-200">{title}</span>
        <div className="ml-auto flex items-center gap-1">
          <IconButtonArrow dir="up" onClick={onUp} disabled={index === 0} />
          <IconButtonArrow dir="down" onClick={onDown} disabled={index === count - 1} />
          <RemoveButton onClick={onRemove} />
        </div>
      </div>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";

function IconButtonArrow({
  dir,
  onClick,
  disabled,
}: {
  dir: "up" | "down";
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      title={dir === "up" ? "Mover para cima" : "Mover para baixo"}
    >
      {dir === "up" ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
    </IconButton>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <IconButton onClick={onClick} title="Remover" danger>
      <Trash2 size={14} />
    </IconButton>
  );
}
