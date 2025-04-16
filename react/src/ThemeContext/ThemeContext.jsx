import React, { createContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from '../Utlies/firebase';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState([]);

  useEffect(() => {

    const siteId = "novazon"; // set this dynamically per site
    const themeDocRef = doc(db, "colors", `${siteId}_activeTheme`);
    
    const unsub = onSnapshot(themeDocRef, (docSnap) => {
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
