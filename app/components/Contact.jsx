"use client";

import React from "react";
import { motion } from "motion/react";
import { useActionState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

import { submitContact } from "@/app/actions/contact";
import { useToast } from "@/app/components/ToastProvider";

const initialState = {
  success: false,
  message: "",
  fields: { name: "", email: "", message: "" },
  errors: {},
};

const Contact = () => {
  const [state, formAction, isPending] = useActionState(
    submitContact,
    initialState,
  );

  const { success: toastSuccess, error: toastError } = useToast();

  const formRef = useRef(null);
  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state?.success]);

  useEffect(() => {
    const message =
      typeof state?.message === "string" ? state.message.trim() : "";
    if (!message) return;

    if (state?.success) {
      toastSuccess(message);
    } else {
      toastError(message);
    }
  }, [state, toastSuccess, toastError]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      id="contact"
      className="w-full px-[12%] py-10 scroll-mt-20 contactBg"
    >
      <motion.h4
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center mb-2 text-lg Ovo"
      >
        Connect with me
      </motion.h4>
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center text-5xl Ovo"
      >
        Get in touch
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="text-center max-w-2xl mx-auto mt-5 mb-12 Ovo"
      >
        I&apos;d love to hear from you! If you have any questions, comments, or
        feedback, please use the form below.
      </motion.p>

      <motion.form
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        action={formAction}
        ref={formRef}
        noValidate
        className="max-w-2xl mx-auto"
      >
        {state?.message ? (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 Ovo ${
              state?.success
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
            role="status"
            aria-live="polite"
          >
            {state.message}
          </div>
        ) : null}

        <div className="grid gridAuto gap-6 mt-10 mb-8">
          <motion.input
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            type="text"
            placeholder="Enter your name"
            className={`flex-1 p-3 outline-none border-[0.5px] rounded-md bg-white ${
              state?.errors?.name?.[0] ? "border-red-400" : "border-gray-400"
            }`}
            name="name"
          />
          {state?.errors?.name?.[0] && (
            <p className="-mt-4 text-sm text-red-600 Ovo">
              {state.errors.name[0]}
            </p>
          )}
          <motion.input
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            type="email"
            placeholder="Enter your email"
            className={`flex-1 p-3 outline-none border-[0.5px] rounded-md bg-white ${
              state?.errors?.email?.[0] ? "border-red-400" : "border-gray-400"
            }`}
            name="email"
          />
          {state?.errors?.email?.[0] && (
            <p className="-mt-4 text-sm text-red-600 Ovo">
              {state.errors.email[0]}
            </p>
          )}
        </div>
        <motion.textarea
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          rows="6"
          placeholder="Enter your message"
          className={`w-full p-4 outline-none border-[0.5px] rounded-md bg-white mb-2 ${
            state?.errors?.message?.[0] ? "border-red-400" : "border-gray-400"
          }`}
          name="message"
        />
        {state?.errors?.message?.[0] && (
          <p className="mb-4 text-sm text-red-600 Ovo">
            {state.errors.message[0]}
          </p>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          type="submit"
          disabled={isPending}
          className="py-3 px-8 w-max flex items-center justify-between gap-2 bg-black/80 text-white rounded-full mx-auto darkHover duration-500 cursor-pointer"
        >
          {isPending ? "Sending...." : "Submit now"}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default Contact;
