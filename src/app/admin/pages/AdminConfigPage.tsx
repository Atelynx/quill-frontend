import { useMemo, useState } from "react";
import { useAdminConfigs } from "../../../shared/api/hooks";
import { admin } from "../../../shared/content/strings";
import { surface } from "../../../shared/design-system/surfaces";
import { loadingScreen } from "../../../shared/design-system/layout";
import { table } from '../../../shared/design-system';
import { textSoft, textMuted } from '../../../shared/design-system/typography';
import { SectionCard } from "../../../shared/components/SectionCard";
import { QueryErrorState } from "../../../shared/components/QueryErrorState";
import { ConfigEditModal } from "../components/ConfigEditModal";
import { ConfigHistoryView } from "../components/ConfigHistoryView";
import type { AdminConfig } from "../../../shared/api/validators";

export function AdminConfigPage() {
  const configsQuery = useAdminConfigs();
  const { data: configs, isLoading } = configsQuery;
  const [editTarget, setEditTarget] = useState<AdminConfig | null>(null);
  const [historyTarget, setHistoryTarget] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState("all");

  const allTags = useMemo(() => {
    if (!configs) return [];
    const tags = new Set<string>();
    configs.forEach((cfg) => cfg.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [configs]);

  const filteredConfigs = useMemo(() => {
    if (!configs) return [];
    if (selectedTag === "all") return configs;
    return configs.filter((cfg) => cfg.tags?.includes(selectedTag));
  }, [configs, selectedTag]);

  if (isLoading) {
    return <div className={loadingScreen}>Cargando configuraciones...</div>;
  }

  if (configsQuery.isError) {
    return (
      <QueryErrorState
        message="No fue posible cargar las configuraciones administrativas."
        onRetry={() => {
          void configsQuery.refetch();
        }}
      />
    );
  }

  return (
    <>
      <SectionCard
        title={admin.config.title}
        description={admin.config.description}
      >
        {allTags.length > 0 ? (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={`rounded-full px-3 py-1 text-[0.78rem] font-medium transition-colors ${
                selectedTag === "all"
                  ? "bg-[var(--main-page-accent-soft)] text-[var(--main-page-accent-strong)]"
                  : `bg-[var(--main-page-surface-muted)] ${textSoft} hover:bg-[var(--main-page-accent-soft)]`
              }`}
              onClick={() => setSelectedTag("all")}
            >
              Todas
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`rounded-full px-3 py-1 text-[0.78rem] font-medium transition-colors ${
                  selectedTag === tag
                    ? "bg-[var(--main-page-accent-soft)] text-[var(--main-page-accent-strong)]"
                    : `bg-[var(--main-page-surface-muted)] ${textSoft} hover:bg-[var(--main-page-accent-soft)]`
                }`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        ) : null}

        <div className={`${surface.tableWrapper}`}>
          <table className="w-full min-w-[640px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className={`${table.header}`}>
                  {admin.config.fields.name}
                </th>
                <th className={`${table.header}`}>
                  {admin.config.fields.tags}
                </th>
                <th className={`${table.header}`}>
                  {admin.config.fields.value}
                </th>
                <th className={`${table.header}`}>
                  {admin.config.fields.status}
                </th>
                <th className={`${table.header}`}>
                  {admin.config.fields.lastUsed}
                </th>
                <th className={`p-[0.85rem_0.75rem] text-right text-[0.86rem] font-semibold ${textSoft}`}>
                  {admin.config.fields.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {!filteredConfigs.length ? (
                <tr>
                  <td
                    colSpan={6}
                    className={`p-[0.85rem_0.75rem] text-center ${textSoft}`}
                  >
                    {admin.config.empty}
                  </td>
                </tr>
              ) : (
                filteredConfigs.map((cfg) => (
                  <tr
                    key={cfg.key}
                    className="border-b border-[var(--main-page-border)] transition-colors"
                  >
                    <td className="p-[0.85rem_0.75rem] text-text">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {cfg.name ?? cfg.key}
                        </span>
                      </div>

                      {cfg.name ? (
                        <div className={`mt-0.5 font-mono text-[0.75rem] ${textMuted}`}>
                          {cfg.key}
                        </div>
                      ) : null}
                      {cfg.appliesOn === "restart" ? (
                        <span className="inline-flex items-center bg-amber-500/15 px-2 py-0.5 text-[0.7rem] font-medium text-amber-600">
                          {admin.config.restartWarning}
                        </span>
                      ) : null}
                    </td>
                    <td className="p-[0.85rem_0.75rem]">
                      {cfg.tags?.length ? (
                        <div className="flex flex-wrap gap-1">
                          {cfg.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`inline-flex items-center rounded-full bg-[var(--main-page-surface-muted)] px-2 py-0.5 text-[0.7rem] font-medium ${textMuted}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className={`${textMuted}`}>
                          —
                        </span>
                      )}
                    </td>
                    <td className="p-[0.85rem_0.75rem] font-mono text-[0.88rem] text-text">
                      <span>{String(cfg.value)}</span>
                      {cfg.appliesOn === "restart" &&
                      cfg.effectiveValue !== undefined &&
                      String(cfg.value) !== String(cfg.effectiveValue) ? (
                        <span className={`ml-2 text-[0.75rem] ${textMuted}`}>
                          ({admin.config.fields.effectiveValue}:{" "}
                          {String(cfg.effectiveValue)})
                        </span>
                      ) : null}
                    </td>
                    <td className="p-[0.85rem_0.75rem]">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.78rem] font-medium ${cfg.inUse ? "bg-[var(--main-page-accent-soft)] text-[var(--main-page-accent-strong)]" : `bg-[var(--main-page-surface-muted)] ${textMuted}`}`}
                      >
                        {cfg.inUse
                          ? admin.config.tags.active
                          : admin.config.tags.inactive}
                      </span>
                    </td>
                    <td className={`p-[0.85rem_0.75rem] text-[0.85rem] ${textSoft}`}>
                      {cfg.lastUsedAt
                        ? new Date(cfg.lastUsedAt).toLocaleString("es-CL")
                        : "—"}
                    </td>
                    <td className="p-[0.85rem_0.75rem] text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="rounded-[var(--main-page-radius-md)] px-3 py-1.5 text-[0.82rem] font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--main-page-accent-soft)]"
                          onClick={() => setEditTarget(cfg)}
                        >
                          {admin.actions.edit}
                        </button>
                        <button
                          type="button"
                          className={`rounded-[var(--main-page-radius-md)] px-3 py-1.5 text-[0.82rem] font-medium ${textSoft} transition-colors hover:bg-[var(--main-page-surface-muted)]`}
                          onClick={() => setHistoryTarget(cfg.key)}
                        >
                          {admin.actions.history}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {editTarget ? (
        <ConfigEditModal
          config={editTarget}
          onClose={() => setEditTarget(null)}
        />
      ) : null}

      {historyTarget ? (
        <ConfigHistoryView
          keyName={historyTarget}
          onClose={() => setHistoryTarget(null)}
        />
      ) : null}
    </>
  );
}
