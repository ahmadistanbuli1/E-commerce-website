import type { ReactNode } from "react";

import { Link } from "react-router-dom";

import { motion } from "framer-motion";

import { Store } from "lucide-react";

import { Card } from "../ui/Card";

import { fadeUp, staggerContainer } from "../../utils/motion";



export function AuthLayout({

  title,

  subtitle,

  footer,

  children

}: {

  title: string;

  subtitle?: ReactNode;

  footer?: ReactNode;

  children: ReactNode;

}) {

  return (

    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50/50 px-4 py-10">

      <motion.div

        initial="hidden"

        animate="visible"

        variants={staggerContainer(0.1, 0.05)}

        className="flex w-full max-w-md flex-col items-center"

      >

        <motion.div variants={fadeUp}>

          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-lg font-bold text-slate-900">

            <motion.span

              className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/25"

              whileHover={{ scale: 1.05, rotate: -3 }}

              transition={{ type: "spring", stiffness: 400, damping: 14 }}

            >

              <Store className="h-5 w-5" />

            </motion.span>

            E-Commerce

          </Link>

        </motion.div>



        <motion.div variants={fadeUp} className="w-full">

          <Card className="w-full" padding="lg">

            <h1 className="heading-3">{title}</h1>

            {subtitle ? <div className="mt-2 body-text">{subtitle}</div> : null}

            <div className="mt-6">{children}</div>

            {footer ? (

              <div className="mt-6 border-t border-slate-100 pt-4 text-center text-sm">{footer}</div>

            ) : null}

          </Card>

        </motion.div>

      </motion.div>

    </div>

  );

}

