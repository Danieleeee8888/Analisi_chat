import type { ContextFormData } from "./context-form-types";

/** Dati da tenere fino a pagamento + generazione report (MVP: solo RAM del processo). */
export type CheckoutBundle = {
  anonymizedChat: string;
  metrics: unknown;
  formData: ContextFormData;
  participantMap: string[];
  paid: boolean;
  createdAt: number;
};

const store = new Map<string, CheckoutBundle>();

const MAX_ENTRIES = 500;
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

function prune() {
  const now = Date.now();
  for (const [id, v] of store) {
    if (now - v.createdAt > MAX_AGE_MS) store.delete(id);
  }
  while (store.size > MAX_ENTRIES) {
    const first = store.keys().next().value;
    if (first === undefined) break;
    store.delete(first);
  }
}

export function putCheckoutBundle(data: Omit<CheckoutBundle, "paid" | "createdAt">): string {
  prune();
  const id = crypto.randomUUID();
  store.set(id, {
    ...data,
    paid: false,
    createdAt: Date.now()
  });
  return id;
}

export function getCheckoutBundle(internalId: string): CheckoutBundle | undefined {
  const v = store.get(internalId);
  if (!v) return undefined;
  if (Date.now() - v.createdAt > MAX_AGE_MS) {
    store.delete(internalId);
    return undefined;
  }
  return v;
}

export function markCheckoutPaid(internalId: string): boolean {
  const v = store.get(internalId);
  if (!v) return false;
  v.paid = true;
  return true;
}

/** Rimuove il bundle dopo report consegnato con successo. */
export function deleteCheckoutBundle(internalId: string): void {
  store.delete(internalId);
}
