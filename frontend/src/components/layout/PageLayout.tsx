import type { ReactNode } from "react";

import { motion } from "framer-motion";

import { NavBar } from "./NavBar";

import { pageEnter } from "../../utils/motion";



export function PageLayout({

  children,

  className = ""

}: {

  children: ReactNode;

  className?: string;

}) {

  return (

    <div className="min-h-screen bg-slate-50/50">

      <NavBar />

      <motion.main

        initial="hidden"

        animate="visible"

        variants={pageEnter}

        className={`mx-auto max-w-7xl px-4 py-8 sm:py-10 ${className}`}

      >

        {children}

      </motion.main>

    </div>

  );

}

