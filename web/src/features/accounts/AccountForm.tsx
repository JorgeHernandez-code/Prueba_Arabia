import { useState } from 'react';
import type { FormEvent } from 'react';
import { ApiError, createAccount } from './api';

type Errors = Partial<Record<'code' | 'name' | 'nature' | 'form', string>>;

const VALID_LENGTHS = [1, 2, 4, 6];

function validate(code: string, name: string, nature: string): Errors {
  const errors: Errors = {};
  if (!/^\d+$/.test(code)) errors.code = 'El código debe ser numérico';
  else if (!VALID_LENGTHS.includes(code.length))
    errors.code = 'El código debe tener 1, 2, 4 o 6 dígitos';
  if (!name.trim()) errors.name = 'El nombre es obligatorio';
  if (code.length === 1 && !nature) errors.nature = 'Elige la naturaleza de la clase';
  return errors;
}

interface Props {
  onCreated: () => void | Promise<void>;
}

export function AccountForm({ onCreated }: Props) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [nature, setNature] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const clientErrors = validate(code.trim(), name, nature);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    setSubmitting(true);
    try {
      await createAccount({
        code: code.trim(),
        name: name.trim(),
        nature: code.trim().length === 1 ? (nature as 'DEBIT' | 'CREDIT') : undefined,
      });
      setCode('');
      setName('');
      setNature('');
      await onCreated();
    } catch (err) {
      if (err instanceof ApiError) {
        const field = (['code', 'name', 'nature'].includes(err.field) ? err.field : 'form') as keyof Errors;
        setErrors({ [field]: err.message });
      } else {
        setErrors({ form: 'No se pudo conectar con la API' });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
      <h2>Crear cuenta</h2>

      <label>
        Código
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Ej: 110510" />
        {errors.code && <small role="alert" style={{ color: 'crimson', display: 'block' }}>{errors.code}</small>}
      </label>

      <label>
        Nombre
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Caja menor" />
        {errors.name && <small role="alert" style={{ color: 'crimson', display: 'block' }}>{errors.name}</small>}
      </label>

      {code.trim().length === 1 && (
        <label>
          Naturaleza
          <select value={nature} onChange={(e) => setNature(e.target.value)}>
            <option value="">Selecciona…</option>
            <option value="DEBIT">Débito</option>
            <option value="CREDIT">Crédito</option>
          </select>
          {errors.nature && <small role="alert" style={{ color: 'crimson', display: 'block' }}>{errors.nature}</small>}
        </label>
      )}

      {errors.form && <p role="alert" style={{ color: 'crimson' }}>{errors.form}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Creando…' : 'Crear cuenta'}
      </button>
    </form>
  );
}