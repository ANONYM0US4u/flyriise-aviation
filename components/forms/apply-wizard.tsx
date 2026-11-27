"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { ErrorSummary, Field, describedBy } from "@/components/forms/fields";
import { SuccessStub } from "@/components/forms/success-stub";
import { Action } from "@/components/ui/button";
import { Alert, ArrowRight, Check } from "@/components/ui/icons";
import { programs } from "@/data/programs";
import { leadWhatsappHref } from "@/lib/contact";
import { applicationSchema } from "@/lib/lead-schema";
import { cn } from "@/lib/utils";

type Values = z.input<typeof applicationSchema>;

type SubmitState =
  | { status: "idle" }
  | { status: "success"; reference: string; name: string; track: string; whatsappLink: string }
  | { status: "error"; message: string };

const STEPS = [
  { code: "01", label: "Track" },
  { code: "02", label: "Details" },
  { code: "03", label: "Confirm" },
] as const;

const qualificationOptions = [
  { value: "10th", label: "10th standard" },
  { value: "12th", label: "12th / Higher Secondary" },
  { value: "diploma", label: "Diploma" },
  { value: "graduate", label: "Graduate" },
  { value: "postgraduate", label: "Postgraduate" },
] as const;

const startOptions = [
  "As soon as possible",
  "Within one month",
  "Within three months",
  "Still exploring",
] as const;

function trackLabel(slug: string | undefined): string {
  if (!slug || slug === "not-sure") return "To be decided at counselling";
  return programs.find((program) => program.slug === slug)?.name ?? "To be decided at counselling";
}

/**
 * SIGNATURE MOMENT 3 — "The Boarding Pass" (brief §04A)
 * Application is a three-step boarding sequence: choose the track, give the
 * details, confirm. Progress is a flight line with three stations, and the
 * confirmation returns a real reference ID from the server.
 */
export function ApplyWizard({ className }: { className?: string }) {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      kind: "application",
      fullName: "",
      phone: "",
      email: "",
      programSlug: "not-sure",
      location: "",
      message: "",
      highestQualification: undefined,
      preferredStart: "",
      consent: false,
      company: "",
    },
  });

  const values = watch();

  const stepFields: Array<Array<keyof Values>> = [
    ["programSlug", "preferredStart"],
    ["fullName", "phone", "email", "location", "highestQualification"],
    ["consent"],
  ];

  const next = async () => {
    const valid = await trigger(stepFields[step] as never);
    if (valid) setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const fieldErrors = Object.entries(errors)
    .filter(([key]) => key !== "company")
    .map(([key, error]) => ({
      id: `apply-${key}`,
      message: typeof error?.message === "string" ? error.message : "Please check this field.",
    }));

  const onSubmit = handleSubmit(async (submitted) => {
    setState({ status: "idle" });
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(submitted),
      });
      const payload = (await response.json()) as {
        ok: boolean;
        reference?: string;
        error?: string;
        issues?: Array<{ field: string; message: string }>;
      };

      if (payload.ok && payload.reference) {
        const track = trackLabel(submitted.programSlug);
        setState({
          status: "success",
          reference: payload.reference,
          name: submitted.fullName,
          track,
          whatsappLink: leadWhatsappHref({
            kind: "application",
            reference: payload.reference,
            name: submitted.fullName,
            phone: submitted.phone,
            track,
            location: submitted.location,
            message: submitted.message,
          }),
        });
        return;
      }

      if (payload.issues?.length) {
        for (const issue of payload.issues) {
          const field = issue.field.split(".").pop() as keyof Values | undefined;
          if (field && field !== "company") setError(field, { type: "server", message: issue.message });
        }
      }

      setState({
        status: "error",
        message:
          payload.error ??
          "The application could not be recorded. Please try again, or apply by phone with the admissions desk.",
      });
    } catch {
      setState({
        status: "error",
        message: "Your connection dropped while sending. Please try again.",
      });
    }
  });

  if (state.status === "success") {
    return (
      <SuccessStub
        reference={state.reference}
        name={state.name}
        track={state.track}
        kind="application"
        whatsappLink={state.whatsappLink}
        className={className}
      />
    );
  }

  return (
    <div className={cn("board overflow-hidden rounded-[var(--radius-md)] text-cirrus", className)}>
      {/* Boarding sequence header */}
      <div className="border-b border-hairline p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="mono-label text-amber">Application · 3 steps</p>
          <p className="mono-label text-steel-deep">Reference issued on submission</p>
        </div>
        <ol className="mt-5 grid grid-cols-3 gap-3" aria-label="Application progress">
          {STEPS.map((item, index) => {
            const done = index < step;
            const active = index === step;
            return (
              <li key={item.code} className="relative">
                <div
                  className={cn(
                    "h-px w-full",
                    done || active ? "bg-amber" : "bg-hairline",
                  )}
                />
                <div className="mt-3 flex items-baseline gap-2">
                  <span
                    className={cn(
                      "mono-label",
                      active ? "text-amber" : done ? "text-verified" : "text-steel-deep",
                    )}
                  >
                    {done ? <Check className="inline h-3 w-3" /> : item.code}
                  </span>
                  <span
                    className={cn(
                      "mono-label",
                      active ? "text-cirrus" : "text-steel-deep",
                    )}
                    aria-current={active ? "step" : undefined}
                  >
                    {item.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <form onSubmit={onSubmit} noValidate className="p-5 sm:p-6">
        {state.status === "error" ? (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-[var(--radius-sm)] border border-alert/50 bg-alert/10 p-4"
          >
            <Alert className="mt-0.5 text-alert" />
            <p className="text-[0.9375rem] text-cirrus">{state.message}</p>
          </div>
        ) : null}

        {step === 0 ? (
          <fieldset className="space-y-6">
            <legend className="mono-label text-steel">Step 1 · Choose your track</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {[...programs.map((p) => ({ value: p.slug, label: p.name, hint: p.kicker })), {
                value: "not-sure",
                label: "Not sure yet",
                hint: "Admissions will advise at counselling",
              }].map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "group flex cursor-pointer flex-col gap-1 rounded-[var(--radius-sm)] border p-4 transition-colors",
                    values.programSlug === option.value
                      ? "border-amber bg-amber/10"
                      : "border-hairline hover:border-hairline-strong",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      value={option.value}
                      className="h-4 w-4 accent-[#FFB224]"
                      {...register("programSlug")}
                    />
                    <span className="text-[0.9375rem] text-cirrus">{option.label}</span>
                  </span>
                  <span className="mono-label pl-7 text-steel-deep">{option.hint}</span>
                </label>
              ))}
            </div>

            <Field label="When would you like to start?" htmlFor="apply-preferredStart">
              <select id="apply-preferredStart" className="field" {...register("preferredStart")}>
                <option value="">No preference</option>
                {startOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>
          </fieldset>
        ) : null}

        {step === 1 ? (
          <fieldset className="space-y-5">
            <legend className="mono-label text-steel">Step 2 · Your details</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" htmlFor="apply-fullName" required error={errors.fullName?.message}>
                <input
                  id="apply-fullName"
                  className="field"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={describedBy("apply-fullName", { error: errors.fullName?.message })}
                  {...register("fullName")}
                />
              </Field>
              <Field label="Phone / WhatsApp" htmlFor="apply-phone" required error={errors.phone?.message}>
                <input
                  id="apply-phone"
                  className="field tnum"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={describedBy("apply-phone", { error: errors.phone?.message })}
                  {...register("phone")}
                />
              </Field>
              <Field label="Email" htmlFor="apply-email" error={errors.email?.message}>
                <input
                  id="apply-email"
                  className="field"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={describedBy("apply-email", { error: errors.email?.message })}
                  {...register("email")}
                />
              </Field>
              <Field label="City / location" htmlFor="apply-location">
                <input id="apply-location" className="field" autoComplete="address-level2" {...register("location")} />
              </Field>
              <Field
                label="Highest qualification"
                htmlFor="apply-highestQualification"
                hint="Used only to check eligibility for your track."
              >
                <select
                  id="apply-highestQualification"
                  className="field"
                  {...register("highestQualification")}
                >
                  <option value="">Prefer not to say</option>
                  {qualificationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Anything we should know" htmlFor="apply-message" className="sm:col-span-2">
                <textarea
                  id="apply-message"
                  className="field min-h-[6rem] resize-y"
                  {...register("message")}
                />
              </Field>
            </div>
          </fieldset>
        ) : null}

        {step === 2 ? (
          <fieldset className="space-y-6">
            <legend className="mono-label text-steel">Step 3 · Confirm</legend>
            <dl className="divide-y divide-[color:var(--color-hairline)] border-y border-hairline">
              {[
                { label: "Candidate", value: values.fullName || "—" },
                { label: "Phone", value: values.phone || "—" },
                { label: "Email", value: values.email || "—" },
                { label: "Track", value: trackLabel(values.programSlug) },
                { label: "Preferred start", value: values.preferredStart || "No preference" },
                {
                  label: "Qualification",
                  value:
                    qualificationOptions.find((option) => option.value === values.highestQualification)?.label ??
                    "Prefer not to say",
                },
              ].map((row) => (
                <div key={row.label} className="grid grid-cols-3 gap-4 py-3">
                  <dt className="mono-label text-steel-deep">{row.label}</dt>
                  <dd className="col-span-2 text-[0.9375rem] text-cirrus">{row.value}</dd>
                </div>
              ))}
            </dl>

            <ErrorSummary errors={fieldErrors} />

            <div className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-hairline bg-white/[0.03] p-4">
              <input
                id="apply-consent"
                type="checkbox"
                className="mt-1 h-5 w-5 shrink-0 accent-[#FFB224]"
                aria-invalid={Boolean(errors.consent)}
                aria-describedby={describedBy("apply-consent", { error: errors.consent?.message })}
                {...register("consent")}
              />
              <div>
                <label htmlFor="apply-consent" className="text-[0.9375rem] leading-[1.6] text-cirrus">
                  I confirm the details above are mine, and I agree to be contacted about this application.
                </label>
                {errors.consent?.message ? (
                  <p role="alert" className="mt-2 text-[0.8125rem] font-medium text-alert">
                    {errors.consent.message}
                  </p>
                ) : null}
              </div>
            </div>

            <p className="text-[0.8125rem] leading-[1.65] text-steel">
              Submitting an application does not confirm a seat or guarantee employment. Admissions will
              verify eligibility and contact you.
            </p>
          </fieldset>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {step > 0 ? (
            <Action variant="secondary" onClick={() => setStep((current) => Math.max(0, current - 1))}>
              Back
            </Action>
          ) : null}
          {step < STEPS.length - 1 ? (
            <Action variant="primary" size="lg" onClick={next} icon={<ArrowRight />}>
              Continue
            </Action>
          ) : (
            <Action type="submit" variant="primary" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Submitting…" : "Submit application"}
            </Action>
          )}
          <p className="mono-label text-steel-deep">
            Step {step + 1} of {STEPS.length}
          </p>
        </div>
      </form>
    </div>
  );
}
