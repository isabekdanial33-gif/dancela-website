import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Check, X } from 'lucide-react';

interface EditableTextProps {
  value: string;
  onSave: (val: string) => void;
  editorMode: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

export default function EditableText({
  value,
  onSave,
  editorMode,
  as: Tag = 'span',
  className = '',
  multiline = false,
  placeholder = 'Введите текст...',
}: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => { setDraft(value); }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  const commit = () => {
    if (draft.trim()) onSave(draft.trim());
    else setDraft(value);
    setEditing(false);
  };

  const cancel = () => { setDraft(value); setEditing(false); };

  const handleKey = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') { e.preventDefault(); commit(); }
    if (e.key === 'Escape') cancel();
  };

  if (!editorMode) {
    return <Tag className={className}>{value}</Tag>;
  }

  if (editing) {
    return (
      <span className="inline-flex items-start gap-1.5 group w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKey}
            rows={3}
            className={`${className} bg-amber-500/8 border border-amber-500/40 rounded-lg px-2 py-1 outline-none resize-y w-full text-inherit font-inherit`}
            placeholder={placeholder}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKey}
            className={`${className} bg-amber-500/8 border border-amber-500/40 rounded-lg px-2 py-0.5 outline-none w-full text-inherit font-inherit`}
            placeholder={placeholder}
          />
        )}
        <span className="flex flex-col gap-0.5 shrink-0 mt-0.5">
          <button onClick={commit} className="p-1 bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/30 text-emerald-400 rounded-md transition-all" title="Сохранить">
            <Check className="w-3 h-3" />
          </button>
          <button onClick={cancel} className="p-1 bg-red-500/10 hover:bg-red-500/30 border border-red-500/20 text-red-400 rounded-md transition-all" title="Отмена">
            <X className="w-3 h-3" />
          </button>
        </span>
      </span>
    );
  }

  return (
    <Tag
      className={`${className} relative group/editable cursor-pointer`}
      onClick={() => setEditing(true)}
      title="Нажмите для редактирования"
    >
      {value}
      <span className="inline-flex items-center gap-1 ml-1.5 opacity-0 group-hover/editable:opacity-100 transition-opacity align-middle">
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded text-[9px] font-bold uppercase tracking-wider">
          <Edit2 className="w-2.5 h-2.5" />
          изменить
        </span>
      </span>
    </Tag>
  );
}
