// import React, { Suspense, lazy, useState, useEffect } from "react";

// import "./App.css";
// import "./Connect2ic/Connect2ic.scss";

// import { PlugWallet } from "@connect2ic/core/providers";
// import { InternetIdentity } from "@connect2ic/core/providers";
// import { Connect2ICProvider } from "@connect2ic/react";
// import { createClient } from "@connect2ic/core";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Provider } from "react-redux";
// // import store from "../src/redux/store/store.js"

// // Lazy load pages
// const Landing = lazy(() => import("./pages/Landing/Landing"));
// const DashboardRoutes = lazy(() => import("./pages/Routes"));

// import Loader from "./components/Loader/Loader";

// import { backend } from "../../declarations/backend/index"
// import { IoMdRocket } from "react-icons/io";

// type Theme = "dark" | "light";

// function App() {
//   const [theme, setTheme] = useState<Theme>("light");
//   const [dark, setDark] = React.useState(false);

//   const [light, setLight] = React.useState(true);
//   const darkColor: string = dark ? "dark" : "light";
//   const lightColor: string = !dark ? "dark" : "light";

//   useEffect(() => {
//     const storedTheme = localStorage.getItem("theme");
//     if (storedTheme === "dark") {
//       setTheme("dark");
//       setDark(true);
//       document.documentElement.classList.add("dark");
//     }
//   }, []);

//   function handleThemeSwitch() {
//     setDark(!dark);
//     setLight(!light);
//     const newTheme = theme === "dark" ? "light" : "dark";
//     setTheme(newTheme);
//     localStorage.setItem("theme", newTheme);
//     if (newTheme === "dark") {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }

//   return (
//     // <Provider store={store}>
//     <Router>
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <Suspense fallback={<Loader />}>
//               <Landing
//                 darkColor={darkColor}
//                 lightColor={lightColor}
//                 handleThemeSwitch={handleThemeSwitch}
//               />
//             </Suspense>
//           }
//         />

//         <Route
//           path="/dashboard/*"
//           element={
//             <Suspense fallback={<Loader />}>
//               <DashboardRoutes
//                 darkColor={darkColor}
//                 lightColor={lightColor}
//                 handleThemeSwitch={handleThemeSwitch}
//               />
//             </Suspense>
//           }
//         />
//       </Routes>
//     </Router>
//     // </Provider>
//   );
// }

// const client = createClient({
//   canisters: {},
//   providers: [new InternetIdentity(), new PlugWallet()],
// });

// export default () => (
//   <Connect2ICProvider client={client}>
//     <App />
//   </Connect2ICProvider>
// );

// App.tsx


import React, { Suspense, lazy, useState, useEffect } from "react";
import "./App.css";
import "./Connect2ic/Connect2ic.scss";
import { Connect2ICProvider } from "@connect2ic/react";
import { createClient } from "@connect2ic/core";
import { PlugWallet } from "@connect2ic/core/providers";
import { InternetIdentity } from "@connect2ic/core/providers";
import { BrowserRouter as Router } from "react-router-dom";
import {  } from "react-redux";
// import store from "../src/redux/store/store.js";
import AppRoutes from './AppRoutes'; // Make sure the path is correct

import { backend } from "../../declarations/backend/index";
import { IoMdRocket } from "react-icons/io";

type Theme = "dark" | "light";

function App() {
  const [theme, setTheme] = useState<Theme>("light");
  const [dark, setDark] = React.useState(false);
  const [light, setLight] = React.useState(true);
  const darkColor: string = dark ? "dark" : "light";
  const lightColor: string = !dark ? "dark" : "light";

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setTheme("dark");
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  function handleThemeSwitch() {
    setDark(!dark);
    setLight(!light);
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  return (
    // <Provider store={store}>
      <Router>
        <AppRoutes darkColor={darkColor} lightColor={lightColor} handleThemeSwitch={handleThemeSwitch} />
      </Router>
    // </Provider>
  );
}

const client = createClient({
  canisters: {},
  providers: [new InternetIdentity(), new PlugWallet()],

});

export default () => (
  <Connect2ICProvider client={client}>
    <App />
  </Connect2ICProvider>
);
