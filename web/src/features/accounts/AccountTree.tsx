import { useState } from 'react';
import type { AccountNode } from './types';

interface TreeProps {
  nodes: AccountNode[];
  onDelete: (code: string) => void;
  deletingCode: string | null;
}

export function AccountTree({ nodes, onDelete, deletingCode }: TreeProps) {
  return (
    <ul style={{ listStyle: 'none', paddingLeft: 20 }}>
      {nodes.map((node) => (
        <TreeItem key={node.code} node={node} onDelete={onDelete} deletingCode={deletingCode} />
      ))}
    </ul>
  );
}

interface ItemProps {
  node: AccountNode;
  onDelete: (code: string) => void;
  deletingCode: string | null;
}

function TreeItem({ node, onDelete, deletingCode }: ItemProps) {
  const [open, setOpen] = useState(false);
  const hasChildren = node.children.length > 0;
  const deleting = deletingCode === node.code;

  return (
    <li>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '4px 0' }}>
        <button
          onClick={() => setOpen(!open)}
          disabled={!hasChildren}
          aria-label={open ? 'Colapsar' : 'Expandir'}
        >
          {hasChildren ? (open ? '▼' : '▶') : '•'}
        </button>
        <span>
          <strong>{node.code}</strong> {node.name}
        </span>
        <button onClick={() => onDelete(node.code)} disabled={deleting}>
          {deleting ? 'Eliminando…' : 'Eliminar'}
        </button>
      </div>
      {open && hasChildren && (
        <AccountTree nodes={node.children} onDelete={onDelete} deletingCode={deletingCode} />
      )}
    </li>
  );
}