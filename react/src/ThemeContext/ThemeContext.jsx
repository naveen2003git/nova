import React, { createContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from '../../Utlies/firebase';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "colors", "activeTheme"), (docSnap) => {
      if (docSnap.exists()) {
        setTheme(docSnap.data());
        console.log("🎨 Theme updated:", docSnap.data());
      }
    });

    return () => unsub(); // Cleanup the listener
  }, []);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
