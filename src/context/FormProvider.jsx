import { createContext, useState, useContext } from "react";

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [currentEditingSession, setCurrentEditingSession] = useState(null);

  const openForm = (mode = "add", initialData = null) => {
    setFormMode(mode);
    setCurrentEditingSession(initialData);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setCurrentEditingSession(null);
  };

  return (
    <FormContext.Provider
      value={{
        isFormOpen,
        formMode,
        currentEditingSession,
        openForm,
        closeForm,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => useContext(FormContext);
