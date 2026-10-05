import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface CartCtx {
  items: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "salus-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setItems(JSON.parse(raw) as string[]);
  }, []);

  const update = (next: string[]) => {
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  return (
    <Ctx.Provider
      value={{
        items,
        add: (id) => !items.includes(id) && update([...items, id]),
        remove: (id) => update(items.filter((x) => x !== id)),
        clear: () => update([]),
        has: (id) => items.includes(id),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
