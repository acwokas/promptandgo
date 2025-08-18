import { createContext, useContext, useState } from "react";

interface LoginWidgetContextType {
  isOpen: boolean;
  openLoginWidget: () => void;
  closeLoginWidget: () => void;
}

const LoginWidgetContext = createContext<LoginWidgetContextType | undefined>(undefined);

export const LoginWidgetProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openLoginWidget = () => setIsOpen(true);
  const closeLoginWidget = () => setIsOpen(false);

  return (
    <LoginWidgetContext.Provider value={{ isOpen, openLoginWidget, closeLoginWidget }}>
      {children}
    </LoginWidgetContext.Provider>
  );
};

export const useLoginWidget = () => {
  const context = useContext(LoginWidgetContext);
  if (context === undefined) {
    throw new Error('useLoginWidget must be used within a LoginWidgetProvider');
  }
  return context;
};