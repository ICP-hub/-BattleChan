import React from "react";

import { ConnectButton, ConnectDialog } from "@connect2ic/react";

import { MdArrowOutward } from "react-icons/md";
import darkLogo from "../../../images/dark_logo.png";
import lightLogo from "../../../images/light_logo.png";

const Navbar = () => {
  const className = "Landing__Navbar";
  const theme = "dark";
  const darkColor = theme.includes("dark") ? "dark" : "light";
  const lightColor = !theme.includes("dark") ? "dark" : "light";

  return (
    <nav
      className={
        className +
        ` py-10 px-20 flex-row-center justify-between text-${lightColor}`
      }
    >
      <img
        src={darkColor.includes("dark") ? darkLogo : lightLogo}
        alt="BATTLE CHAN"
        className={className + "__logo w-28 object-contain pointer-events-none"}
      />

      <section
        className={className + "__rightSection flex-row-center gap-8 font-bold"}
      >
        <div
          className={
            className +
            `__timeToken text-${lightColor} gap-2 flex-row-center border border-green p-2 pl-6 rounded-[3rem]`
          }
        >
          1 Time Token:
          <span className={className + "__timeToken__amount text-light-green"}>
            $0.0050
          </span>
          <button
            className={
              className +
              `__timeToken__butButton buy-button bg-${lightColor} text-${darkColor}`
            }
          >
            Buy
          </button>
        </div>

        <button
          className={
            className + "__connectWalletBtn flex-row-center green-button"
          }
        >
          <ConnectButton /> <MdArrowOutward />
        </button>

        <ConnectDialog />
      </section>
    </nav>
  );
};

export default Navbar;