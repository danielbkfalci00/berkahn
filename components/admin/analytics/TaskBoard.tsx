"use client";

import * as React from "react";
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
import { Check, ChevronDown, Lightbulb, Plus, RotateCcw, Trash2, X } from "lucide-react";
import {
  completeTask,
  createTask,
  deleteTask,
  reopenTask,
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
  const [newTitle, setNewTitle] = React.useState("");
  const [newPriority, setNewPriority] = React.useState<TaskPriority>("p1");
  const [completingId, setCompletingId] = React.useState<string | null>(null);
  const [note, setNote] = React.useState("");
  const [showDone, setShowDone] = React.useState(false);

  // Dedup: sugestões já promovidas (origin_signal presente em alguma tarefa)
  const promotedSignals = React.useMemo(
    () => new Set(tasks.map((t) => t.origin_signal).filter(Boolean) as string[]),
    [tasks]
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

  const openTasks = tasks.filter((t) => t.status === "open");
  const doneTasks = tasks.filter((t) => t.status === "done");

  function handleCreate() {
    const title = newTitle.trim();
    if (!title) return;
    startTransition(async () => {
      await createTask({ title, priority: newPriority });
      setNewTitle("");
    });
  }

  function handlePromote(s: { text: string; priority: TaskPriority }) {
    startTransition(async () => {
      await createTask({
        title: s.text,
        priority: s.priority,
        source: "manual",
        origin_signal: s.text,
      });
    });
  }

  function handleComplete(id: string) {
    startTransition(async () => {
      await completeTask(id, note);
      setCompletingId(null);
      setNote("");
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

        {/* Lista de tarefas abertas, agrupadas por prioridade */}
        {openTasks.length === 0 ? (
          <p className="text-sm text-neutral-400">
            Nenhuma tarefa aberta. Crie a primeira acima ou promova uma sugestão.
          </p>
        ) : (
          <div className="space-y-4">
            {PRIORITIES.map((p) => {
              const items = openTasks.filter((t) => t.priority === p);
              if (items.length === 0) return null;
              return (
                <div key={p}>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-xs font-bold tracking-wider",
                        PRIORITY_META[p].badge
                      )}
                    >
                      {PRIORITY_META[p].label}
                    </span>
                    <span className="text-xs text-neutral-500">{PRIORITY_META[p].desc}</span>
                  </div>
                  <ul className="space-y-2">
                    {items.map((task) => (
                      <li
                        key={task.id}
                        className="p-3 bg-white rounded-md border border-neutral-200"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-sm text-neutral-800 leading-snug">
                            {task.title}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              title="Concluir"
                              aria-label="Concluir tarefa"
                              disabled={isPending}
                              onClick={() =>
                                setCompletingId(completingId === task.id ? null : task.id)
                              }
                              className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-neutral-200 text-[#1F6F3D] hover:bg-[#E8F3EC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1"
                            >
                              <Check className="h-4 w-4" strokeWidth={2.5} />
                            </button>
                            <button
                              type="button"
                              title="Excluir"
                              aria-label="Excluir tarefa"
                              disabled={isPending}
                              onClick={() => startTransition(() => void deleteTask(task.id))}
                              className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-neutral-200 text-neutral-400 hover:text-[#B83A3A] hover:bg-[#F8E8E8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1"
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                            </button>
                          </div>
                        </div>

                        {/* Concluir com comentário (inline) */}
                        {completingId === task.id && (
                          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-neutral-100">
                            <Input
                              value={note}
                              onChange={(e) => setNote(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleComplete(task.id);
                              }}
                              placeholder="Comentário de conclusão (opcional)"
                              aria-label="Comentário de conclusão"
                              className="h-8 flex-1 min-w-[200px] bg-white text-sm"
                            />
                            <Button
                              size="sm"
                              className="h-8"
                              disabled={isPending}
                              onClick={() => handleComplete(task.id)}
                            >
                              Concluir
                            </Button>
                            <button
                              type="button"
                              aria-label="Cancelar"
                              onClick={() => {
                                setCompletingId(null);
                                setNote("");
                              }}
                              className="inline-flex items-center justify-center h-8 w-8 rounded-md text-neutral-400 hover:text-neutral-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
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
                        onClick={() => startTransition(() => void reopenTask(task.id))}
                        className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-neutral-200 text-neutral-400 hover:text-neutral-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1"
                      >
                        <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </button>
                      <button
                        type="button"
                        title="Excluir"
                        aria-label="Excluir tarefa"
                        disabled={isPending}
                        onClick={() => startTransition(() => void deleteTask(task.id))}
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
