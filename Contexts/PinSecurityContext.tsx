import { createContext, useContext, useEffect, useRef, useState } from "react";
import { router } from "expo-router";

type PinContextType = {
  request: () => Promise<boolean>;
  resolve: (ok: boolean) => void;
};

const PinSecurityContext = createContext<PinContextType | null>(null);

export const PinSecurityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [active, setActive] = useState(false);
  
  const resolverRef = useRef<(ok: boolean) => void | undefined>(undefined);

  useEffect(() => {
    if (active) {
      router.push("/security/usePin");
    }
  }, [active]);

  const request = () => {
    setActive(true);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  };

  const resolve = (ok: boolean) => {
    resolverRef.current?.(ok);
    resolverRef.current = undefined;
    setActive(false);
  };

  return (
    <PinSecurityContext.Provider value={{ request, resolve }}>
      {children}
    </PinSecurityContext.Provider>
  );
};

export const usePinSecurity = () => {
  const ctx = useContext(PinSecurityContext);
  if (!ctx)
    throw new Error("usePinSecurity must be used inside PinSecurityProvider");
  return ctx;
};
