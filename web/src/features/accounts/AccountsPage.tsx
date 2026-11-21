import { useCallback, useEffect, useState } from "react";
import { ApiError, deleteAccount, fetchTree } from "./api";
import type { AccountNode } from "./types";
import { AccountTree } from "./AccountTree";
import { AccountForm } from "./AccountForm";

export function AccountsPage() {
  const [tree, setTree] = useState<AccountNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingCode, setDeletingCode] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setTree(await fetchTree());
    } catch {
      setLoadError(
        "No se pudo cargar el catálogo. Revisa que la API esté corriendo.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(code: string) {
    if (!window.confirm(`¿Eliminar la cuenta ${code}?`)) return;
    setDeleteError(null);
    setDeletingCode(code);
    try {
      await deleteAccount(code);
      await load();
    } catch (e) {
      setDeleteError(
        e instanceof ApiError ? e.message : "No se pudo eliminar la cuenta",
      );
    } finally {
      setDeletingCode(null);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1>Catálogo de cuentas</h1>
      <AccountForm onCreated={load} />
      {deleteError && (
        <p role="alert" style={{ color: "crimson" }}>
          {deleteError}
        </p>
      )}

      {loading && tree.length === 0 && <p>Cargando catálogo…</p>}
      {loadError && (
        <div role="alert" style={{ color: "crimson" }}>
          <p>{loadError}</p>
          <button onClick={load}>Reintentar</button>
        </div>
      )}
      {!loadError && (
        <AccountTree
          nodes={tree}
          onDelete={handleDelete}
          deletingCode={deletingCode}
        />
      )}
    </main>
  );
}
