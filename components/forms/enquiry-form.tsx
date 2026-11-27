"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { ErrorSummary, Field, describedBy } from "@/components/forms/fields";
import { SuccessStub } from "@/components/forms/success-stub";
import { Action } from "@/components/ui/button";
import { Alert, ArrowRight } from "@/components/ui/icons";
import { programs } from "@/data/programs";
import { leadWhatsappHref } from "@/lib/contact";
import { enquirySchema } from "@/lib/lead-schema";
import { cn } from "@/lib/utils";

type Values = z.input<typeof enquirySchema>;

type SubmitState =
  | { status: "idle" }
  | { status: "success"; reference: string; name: string; track: string; whatsappLink: string }
  | { status: "error"; message: string };

const trackOptions = [
  ...programs.map((program) => ({ value: program.slug, label: program.name })),
  { value: "not-sure", label: "Not sure yet — advise me" },
];

function trackLabel(slug: string | undefined): string {
  if (!slug) return "To be decided at counselling";
  return trackOptions.find((option) => option.value === slug)?.label ?? "To be decided at counselling";
}

/**
 * ENQUIRY FORM (brief §19)
 * Short by design: five visible fields, one optional message, one explicit
 * consent. Validation runs client-side for speed and again on the server for
 * truth. Every state — idle, submitting, success, error — is designed.
 */
export function EnquiryForm({
  defaultProgram,
  className,
  idPrefix = "enquiry",
}: {
  defaultProgram?: string;
  className?: string;
  idPrefix?: string;
}) {
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<Values>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      kind: "enquiry",
      fullName: "",
      phone: "",
      email: "",
      programSlug: (defaultProgram as Values["programSlug"]) ?? "not-sure",
      location: "",
      message: "",
      consent: false,
      company: "",
    },
  });

  const fieldErrors = Object.entries(errors)
    .filter(([key]) => key !== "company")
    .map(([key, error]) => ({
      id: `${idPrefix}-${key}`,
      message: typeof error?.message === "string" ? error.message : "Please check this field.",
    }));

  const onSubmit = handleSubmit(async (values) => {
    setState({ status: "idle" });
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = (await response.json()) as {
        ok: boolean;
        reference?: string;
        error?: string;
        issues?: Array<{ field: string; message: string }>;
      };

      if (payload.ok && payload.reference) {
        const track = trackLabel(values.programSlug);
        setState({
          status: "success",
          reference: payload.reference,
          name: values.fullName,
          track,
          whatsappLink: leadWhatsappHref({
            kind: "enquiry",
            reference: payload.reference,
            name: values.fullName,
            phone: values.phone,
            track,
            location: values.location,
            message: values.message,
          }),
        });
        reset();
        return;
      }

      if (payload.issues?.length) {
        for (const issue of payload.issues) {
          const field = issue.field.split(".").pop() as keyof Values | undefined;
          if (field && field !== "company") {
            setError(field, { type: "server", message: issue.message });
          }
        }
      }

      setState({
        status: "error",
        message:
          payload.error ??
          "We could not record your enquiry just now. Please call or WhatsApp the admissions desk.",
      });
    } catch {
      setState({
        status: "error",
        message:
          "Your connection dropped while sending. Please try again, or call the admissions desk directly.",
      });
    }
  });

  if (state.status === "success") {
    return (
      <SuccessStub
        reference={state.reference}
        name={state.name}
        track={state.track}
        kind="enquiry"
        whatsappLink={state.whatsappLink}
        className={className}
      />
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={cn("space-y-6", className)}>
      {state.status === "error" ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-alert/45 bg-[#fff4f1] p-4"
        >
          <Alert className="mt-0.5 text-[#c0432a]" />
          <p className="text-[0.9375rem] text-ink">{state.message}</p>
        </div>
      ) : null}

      <ErrorSummary errors={fieldErrors} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Full name"
          htmlFor={`${idPrefix}-fullName`}
          required
          error={errors.fullName?.message}
        >
          <input
            id={`${idPrefix}-fullName`}
            className="field"
            type="text"
            autoComplete="name"
            placeholder="As it should appear on your application"
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={describedBy(`${idPrefix}-fullName`, { error: errors.fullName?.message })}
            {...register("fullName")}
          />
        </Field>

        <Field
          label="Phone / WhatsApp"
          htmlFor={`${idPrefix}-phone`}
          required
          error={errors.phone?.message}
          hint="We call once, and follow up on WhatsApp if you prefer."
        >
          <input
            id={`${idPrefix}-phone`}
            className="field tnum"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+91 00000 00000"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy(`${idPrefix}-phone`, {
              hint: "We call once, and follow up on WhatsApp if you prefer.",
              error: errors.phone?.message,
            })}
            {...register("phone")}
          />
        </Field>

        <Field label="Email" htmlFor={`${idPrefix}-email`} error={errors.email?.message}>
          <input
            id={`${idPrefix}-email`}
            className="field"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy(`${idPrefix}-email`, { error: errors.email?.message })}
            {...register("email")}
          />
        </Field>

        <Field label="Programme of interest" htmlFor={`${idPrefix}-programSlug`}>
          <select
            id={`${idPrefix}-programSlug`}
            className="field"
            {...register("programSlug")}
          >
            {trackOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="City / location"
          htmlFor={`${idPrefix}-location`}
          error={errors.location?.message}
          hint="Helps us plan batch and travel advice."
          className="sm:col-span-1"
        >
          <input
            id={`${idPrefix}-location`}
            className="field"
            type="text"
            autoComplete="address-level2"
            placeholder="Kolkata"
            {...register("location")}
          />
        </Field>

        <Field
          label="Anything we should know"
          htmlFor={`${idPrefix}-message`}
          error={errors.message?.message}
          className="sm:col-span-2"
        >
          <textarea
            id={`${idPrefix}-message`}
            className="field min-h-[7rem] resize-y"
            placeholder="Questions about eligibility, batch dates, fees or documentation."
            {...register("message")}
          />
        </Field>
      </div>

      {/* Honeypot: hidden from users and assistive tech, tempting to bots. */}
      <div aria-hidden className="hidden">
        <label htmlFor={`${idPrefix}-company`}>Company</label>
        <input id={`${idPrefix}-company`} tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <div className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-hairline-light bg-white/60 p-4">
        <input
          id={`${idPrefix}-consent`}
          type="checkbox"
          className="mt-1 h-5 w-5 shrink-0 accent-[#0A1222]"
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={describedBy(`${idPrefix}-consent`, { error: errors.consent?.message })}
          {...register("consent")}
        />
        <div>
          <label htmlFor={`${idPrefix}-consent`} className="text-[0.9375rem] leading-[1.6] text-ink">
            I agree to be contacted by the admissions team about my enquiry.
          </label>
          <p className="mt-1 text-[0.8125rem] leading-[1.6] text-graphite">
            Your details are used only to respond to this enquiry. See the{" "}
            <Link href="/legal/privacy-policy" className="underline underline-offset-4">
              privacy policy
            </Link>
            .
          </p>
          {errors.consent?.message ? (
            <p role="alert" className="mt-2 text-[0.8125rem] font-medium text-[#c0432a]">
              {errors.consent.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Action type="submit" size="lg" disabled={isSubmitting} icon={<ArrowRight />}>
          {isSubmitting ? "Sending…" : "Send enquiry"}
        </Action>
        <p className="mono-label text-graphite">
          Submission does not confirm admission. Placement assistance only.
        </p>
      </div>
    </form>
  );
}
