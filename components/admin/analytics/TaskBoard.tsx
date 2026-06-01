"use client";

import * as React from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  Check,
  ChevronDown,
  GripVertical,
  Lightbulb,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import {
  completeTask,
  createTask,
  deleteTask,
  reopenTask,
  reorderTasks,
  updateTask,
} from "@/app/admin/analytics/actions";
import { cn } from "@/lib/utils";
import type { ActionItem, AnalyticsTask, TaskPriority } from "@/types/analytics";

interface TaskBoardProps {
  tasks: AnalyticsTask[];
  systemActions: { p0: ActionItem[]; p1: ActionItem[]; p2: ActionItem[] };
}

const PRIORITY_META: Record<
  TaskPriority,
  { label: string; desc: string; badge: string }
> = {
  p0: { label: "P0", desc: "Urgente · esta semana", badge: "bg-[#B83A3A] text-white" },
  p1: { label: "P1", desc: "Importante · 2-3 semanas", badge: "bg-neutral-900 text-white" },
  p2: { label: "P2", desc: "Backlog · mês seguinte", badge: "bg-neutral-400 text-white" },
};

const PRIORITIES: TaskPriority[] = ["p0", "p1", "p2"];

export function TaskBoard({ tasks, systemActions }: TaskBoardProps) {
  const [isPending, startTransition] = React.useTransition();
  const [localTasks, setLocalTasks] = React.useState<AnalyticsTask[]>(tasks);
  const [newTitle, setNewTitle] = React.useState("");
  const [newPriority, setNewPriority] = React.useState<TaskPriority>("p1");
  const [completingId, setCompletingId] = React.useState<string | null>(null);
  const [note, setNote] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [showDone, setShowDone] = React.useState(false);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Reconcilia o estado otimista quando o server revalida (create/complete/delete) ou no refresh.
  React.useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const promotedSignals = React.useMemo(
    () => new Set(localTasks.map((t) => t.origin_signal).filter(Boolean) as string[]),
    [localTasks]
  );

  const systemSuggestions = React.useMemo(() => {
    const tag = (items: ActionItem[], priority: TaskPriority) =>
      items.map((a) => ({ text: a.text, priority }));
    return [
      ...tag(systemActions.p0, "p0"),
      ...tag(systemActions.p1, "p1"),
      ...tag(systemActions.p2, "p2"),
    ].filter((s) => !promotedSignals.has(s.text));
  }, [systemActions, promotedSignals]);

  const openTasks = localTasks.filter((t) => t.status === "open");
  const doneTasks = localTasks.filter((t) => t.status === "done");
  const activeTask = activeId ? localTasks.find((t) => t.id === activeId) ?? null : null;

  function flashError(message: string) {
    setErrorMsg(message);
    setLocalTasks(tasks); // reverte otimista
    window.setTimeout(() => setErrorMsg(null), 4000);
  }

  /** Aplica mutação otimista no localTasks e persiste; reverte em erro. */
  function runOptimistic(
    optimistic: (prev: AnalyticsTask[]) => AnalyticsTask[],
    action: () => Promise<{ error: string | null }>
  ) {
    setLocalTasks(optimistic);
    startTransition(async () => {
      const res = await action();
      if (res?.error) flashError(res.error);
    });
  }

  function handleCreate() {
    const title = newTitle.trim();
    if (!title) return;
    const priority = newPriority;
    setNewTitle("");
    startTransition(async () => {
      const res = await createTask({ title, priority });
      if (res.error) flashError(res.error);
    });
  }

  function handlePromote(s: { text: string; priority: TaskPriority }) {
    startTransition(async () => {
      const res = await createTask({
        title: s.text,
        priority: s.priority,
        source: "manual",
        origin_signal: s.text,
      });
      if (res.error) flashError(res.error);
    });
  }

  function handleComplete(id: string) {
    const n = note;
    setCompletingId(null);
    setNote("");
    runOptimistic(
      (prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, status: "done", completion_note: n.trim() || null }
            : t
        ),
      () => completeTask(id, n)
    );
  }

  function handleReopen(id: string) {
    runOptimistic(
      (prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: "open", completion_note: null } : t
        ),
      () => reopenTask(id)
    );
  }

  function handleDelete(id: string) {
    runOptimistic((prev) => prev.filter((t) => t.id !== id), () => deleteTask(id));
  }

  function handleSaveEdit(id: string) {
    const title = editTitle.trim();
    setEditingId(null);
    if (!title) return;
    runOptimistic(
      (prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)),
      () => updateTask(id, { title })
    );
  }

  function handleChangePriority(id: string, priority: TaskPriority) {
    runOptimistic(
      (prev) => prev.map((t) => (t.id === id ? { ...t, priority } : t)),
      () => updateTask(id, { priority })
    );
  }

  // ---- Drag and drop ----
  function findContainer(id: string): TaskPriority | null {
    if (id.startsWith("col-")) return id.slice(4) as TaskPriority;
    const t = localTasks.find((x) => x.id === id);
    return t ? t.priority : null;
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    const activeC = findContainer(activeId);
    const overC = findContainer(overId);
    if (!activeC || !overC || activeC === overC) return;

    setLocalTasks((prev) => {
      const next = [...prev];
      const activeIdx = next.findIndex((t) => t.id === activeId);
      if (activeIdx === -1) return prev;
      const moved = { ...next[activeIdx], priority: overC };
      next.splice(activeIdx, 1);
      let overIdx = next.findIndex((t) => t.id === overId);
      if (overIdx === -1) {
        // soltou sobre o cabeçalho/área vazia do container: insere no fim do grupo
        const lastInContainer = next
          .map((t, i) => ({ t, i }))
          .filter((x) => x.t.status === "open" && x.t.priority === overC)
          .pop();
        overIdx = lastInContainer ? lastInContainer.i + 1 : next.length;
      }
      next.splice(overIdx, 0, moved);
      return next;
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;

    setLocalTasks((prev) => {
      const activeIdx = prev.findIndex((t) => t.id === activeId);
      if (activeIdx === -1) return prev;
      let overIdx = prev.findIndex((t) => t.id === overId);
      if (overIdx === -1) overIdx = activeIdx;
      const moved = arrayMove(prev, activeIdx, overIdx);

      // Recalcula sort_order sequencial para todas as open tasks (ordem do array).
      let order = 0;
      const withOrder = moved.map((t) =>
        t.status === "open" ? { ...t, sort_order: order++ } : t
      );
      const updates = withOrder
        .filter((t) => t.status === "open")
        .map((t) => ({ id: t.id, sort_order: t.sort_order, priority: t.priority }));

      startTransition(async () => {
        const res = await reorderTasks(updates);
        if (res?.error) flashError(res.error);
      });

      return withOrder;
    });
  }

  return (
    <div className="space-y-6">
      {/* Zona: sugestões do sistema */}
      {systemSuggestions.length > 0 && (
        <Card className="p-6 bg-[#FAF8F2] border-neutral-200">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-4 w-4 text-neutral-500" strokeWidth={1.75} />
            <h3 className="text-sm uppercase tracking-wider font-medium text-neutral-500">
              Recomendado pelo sistema
            </h3>
          </div>
          <ul className="space-y-2">
            {systemSuggestions.map((s, i) => (
              <li
                key={i}
                className="flex items-start justify-between gap-3 p-3 bg-white rounded-md border border-neutral-200"
              >
                <div className="flex items-start gap-2 min-w-0">
                  <span
                    className={cn(
                      "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider shrink-0",
                      PRIORITY_META[s.priority].badge
                    )}
                  >
                    {PRIORITY_META[s.priority].label}
                  </span>
                  <span className="text-sm text-neutral-800 leading-snug">{s.text}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 shrink-0 bg-white text-xs"
                  disabled={isPending}
                  onClick={() => handlePromote(s)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Adicionar
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Zona: tarefas do time */}
      <Card className="p-6 bg-white border-neutral-200">
        <h3 className="text-sm uppercase tracking-wider font-medium text-neutral-500 mb-4">
          Tarefas do time
        </h3>

        {errorMsg && (
          <div className="flex items-center gap-2 mb-4 p-3 rounded-md bg-[#F8E8E8] text-[#B83A3A] text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2} />
            {errorMsg}
          </div>
        )}

        {/* Form nova tarefa */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
            }}
            placeholder="Nova tarefa para o time"
            aria-label="Título da nova tarefa"
            className="h-9 flex-1 min-w-[200px] bg-white"
          />
          <Select value={newPriority} onValueChange={(v) => setNewPriority(v as TaskPriority)}>
            <SelectTrigger className="h-9 w-[90px] bg-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => (
                <SelectItem key={p} value={p} className="text-xs">
                  {PRIORITY_META[p].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            className="h-9"
            disabled={isPending || !newTitle.trim()}
            onClick={handleCreate}
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>

        {/* Board com drag-and-drop */}
        {openTasks.length === 0 ? (
          <p className="text-sm text-neutral-400">
            Nenhuma tarefa aberta. Crie a primeira acima ou promova uma sugestão.
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="space-y-4">
              {PRIORITIES.map((p) => (
                <PriorityColumn
                  key={p}
                  priority={p}
                  tasks={openTasks.filter((t) => t.priority === p)}
                  isCompleting={completingId}
                  note={note}
                  editingId={editingId}
                  editTitle={editTitle}
                  isPending={isPending}
                  onSetNote={setNote}
                  onStartComplete={(id) =>
                    setCompletingId(completingId === id ? null : id)
                  }
                  onConfirmComplete={handleComplete}
                  onCancelComplete={() => {
                    setCompletingId(null);
                    setNote("");
                  }}
                  onDelete={handleDelete}
                  onStartEdit={(t) => {
                    setEditingId(t.id);
                    setEditTitle(t.title);
                  }}
                  onChangeEdit={setEditTitle}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={() => setEditingId(null)}
                  onChangePriority={handleChangePriority}
                />
              ))}
            </div>
            <DragOverlay>
              {activeTask ? (
                <div className="p-3 bg-white rounded-md border border-neutral-300 shadow-lg">
                  <span className="text-sm text-neutral-800">{activeTask.title}</span>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}

        {/* Concluídas (colapsável) */}
        {doneTasks.length > 0 && (
          <div className="mt-5 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setShowDone((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              <ChevronDown
                className={cn("h-3.5 w-3.5 transition-transform", showDone && "rotate-180")}
              />
              {doneTasks.length} concluída{doneTasks.length === 1 ? "" : "s"}
            </button>
            {showDone && (
              <ul className="mt-3 space-y-2">
                {doneTasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-start justify-between gap-3 p-3 bg-neutral-50 rounded-md border border-neutral-100"
                  >
                    <div className="min-w-0">
                      <span className="text-sm text-neutral-500 line-through">{task.title}</span>
                      {task.completion_note && (
                        <p className="text-xs text-neutral-400 mt-0.5">{task.completion_note}</p>
                      )}
                      {task.completed_by && (
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          Concluída por {task.completed_by}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        title="Reabrir"
                        aria-label="Reabrir tarefa"
                        disabled={isPending}
                        onClick={() => handleReopen(task.id)}
                        className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-neutral-200 text-neutral-400 hover:text-neutral-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1"
                      >
                        <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </button>
                      <button
                        type="button"
                        title="Excluir"
                        aria-label="Excluir tarefa"
                        disabled={isPending}
                        onClick={() => handleDelete(task.id)}
                        className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-neutral-200 text-neutral-400 hover:text-[#B83A3A] hover:bg-[#F8E8E8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

interface PriorityColumnProps {
  priority: TaskPriority;
  tasks: AnalyticsTask[];
  isCompleting: string | null;
  note: string;
  editingId: string | null;
  editTitle: string;
  isPending: boolean;
  onSetNote: (v: string) => void;
  onStartComplete: (id: string) => void;
  onConfirmComplete: (id: string) => void;
  onCancelComplete: () => void;
  onDelete: (id: string) => void;
  onStartEdit: (t: AnalyticsTask) => void;
  onChangeEdit: (v: string) => void;
  onSaveEdit: (id: string) => void;
  onCancelEdit: () => void;
  onChangePriority: (id: string, p: TaskPriority) => void;
}

function PriorityColumn(props: PriorityColumnProps) {
  const { priority, tasks } = props;
  const { setNodeRef, isOver } = useDroppable({ id: `col-${priority}` });

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-2">
        <span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded text-xs font-bold tracking-wider",
            PRIORITY_META[priority].badge
          )}
        >
          {PRIORITY_META[priority].label}
        </span>
        <span className="text-xs text-neutral-500">{PRIORITY_META[priority].desc}</span>
      </div>
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul
          ref={setNodeRef}
          className={cn(
            "space-y-2 min-h-[8px] rounded-md transition-colors",
            isOver && tasks.length === 0 && "min-h-[44px] bg-neutral-50 border border-dashed border-neutral-200"
          )}
        >
          {tasks.length === 0 ? (
            <li className="px-3 py-2 text-xs text-neutral-300 select-none">
              Arraste tarefas para cá
            </li>
          ) : (
            tasks.map((task) => (
              <SortableTaskRow key={task.id} task={task} {...props} />
            ))
          )}
        </ul>
      </SortableContext>
    </div>
  );
}

function SortableTaskRow({
  task,
  isCompleting,
  note,
  editingId,
  editTitle,
  isPending,
  onSetNote,
  onStartComplete,
  onConfirmComplete,
  onCancelComplete,
  onDelete,
  onStartEdit,
  onChangeEdit,
  onSaveEdit,
  onCancelEdit,
  onChangePriority,
}: PriorityColumnProps & { task: AnalyticsTask }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const isEditing = editingId === task.id;

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="p-3 bg-white rounded-md border border-neutral-200"
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          aria-label="Arrastar tarefa"
          className="mt-0.5 cursor-grab touch-none text-neutral-300 hover:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1 rounded"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" strokeWidth={1.75} />
        </button>

        {isEditing ? (
          <Input
            value={editTitle}
            autoFocus
            onChange={(e) => onChangeEdit(e.target.value)}
            onBlur={() => onSaveEdit(task.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSaveEdit(task.id);
              if (e.key === "Escape") onCancelEdit();
            }}
            className="h-7 flex-1 text-sm bg-white"
            aria-label="Editar título"
          />
        ) : (
          <button
            type="button"
            onClick={() => onStartEdit(task)}
            className="flex-1 text-left text-sm text-neutral-800 leading-snug hover:text-neutral-950 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1"
          >
            {task.title}
          </button>
        )}

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            title="Concluir"
            aria-label="Concluir tarefa"
            disabled={isPending}
            onClick={() => onStartComplete(task.id)}
            className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-neutral-200 text-[#1F6F3D] hover:bg-[#E8F3EC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1"
          >
            <Check className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                title="Mais ações"
                aria-label="Mais ações"
                className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-neutral-200 text-neutral-400 hover:text-neutral-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem className="text-xs" onClick={() => onStartEdit(task)}>
                <Pencil className="h-3.5 w-3.5 mr-2" />
                Editar título
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-neutral-400">
                Mover para
              </DropdownMenuLabel>
              {PRIORITIES.map((p) => (
                <DropdownMenuItem
                  key={p}
                  className="text-xs"
                  disabled={p === task.priority}
                  onClick={() => onChangePriority(task.id, p)}
                >
                  {PRIORITY_META[p].label} · {PRIORITY_META[p].desc}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-xs text-[#B83A3A] focus:text-[#B83A3A]"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Concluir com comentário (inline) */}
      {isCompleting === task.id && (
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-neutral-100">
          <Input
            value={note}
            onChange={(e) => onSetNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onConfirmComplete(task.id);
            }}
            placeholder="Comentário de conclusão (opcional)"
            aria-label="Comentário de conclusão"
            className="h-8 flex-1 min-w-[200px] bg-white text-sm"
          />
          <Button
            size="sm"
            className="h-8"
            disabled={isPending}
            onClick={() => onConfirmComplete(task.id)}
          >
            Concluir
          </Button>
          <button
            type="button"
            aria-label="Cancelar"
            onClick={onCancelComplete}
            className="inline-flex items-center justify-center h-8 w-8 rounded-md text-neutral-400 hover:text-neutral-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </li>
  );
}
