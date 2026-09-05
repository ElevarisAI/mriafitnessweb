import gsap from 'gsap'
import { validate, setError, type Field } from '../form'

/* Final CTA form: one question at a time, typeform-style. The <form> itself is
   unchanged (still a real multi-field Formspree form with novalidate) — this
   only controls which .form-step is visible and animates the swap. Initial
   hidden state is set here, from JS, on init: with JS off every step stays
   visible and the form still works as a plain single-page form.

   Two separate buttons (Next / Send request) rather than one button whose
   `type` gets mutated: flipping a button's type to "submit" inside its own
   click handler still lets that same click's native activation behaviour
   submit the form (the browser re-checks type after listeners run), which
   would fire the request a step early. */

export function initFormStepper(): void {
  const form = document.querySelector<HTMLFormElement>('[data-stepper]')
  if (!form) return

  const steps = [...form.querySelectorAll<HTMLElement>('[data-step]')]
  const backBtn = form.querySelector<HTMLButtonElement>('[data-step-back]')
  const nextBtn = form.querySelector<HTMLButtonElement>('[data-step-next]')
  const submitBtn = form.querySelector<HTMLButtonElement>('[data-step-submit]')
  const fill = form.querySelector<HTMLElement>('[data-step-fill]')
  const label = form.querySelector<HTMLElement>('[data-step-label]')
  if (steps.length < 2 || !backBtn || !nextBtn || !submitBtn || !fill || !label) return

  let index = 0
  for (const [i, step] of steps.entries()) step.hidden = i !== 0

  function fieldsOf(step: HTMLElement): Field[] {
    return [...step.querySelectorAll<Field>('input, textarea')]
  }

  function updateChrome(): void {
    const isLast = index === steps.length - 1
    backBtn!.hidden = index === 0
    nextBtn!.hidden = isLast
    submitBtn!.hidden = !isLast
    fill!.style.width = `${((index + 1) / steps.length) * 100}%`
    label!.textContent = `Question ${index + 1} of ${steps.length}`
  }

  function focusFirst(step: HTMLElement): void {
    step.querySelector<Field>('input, textarea')?.focus()
  }

  function show(nextIndex: number): void {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const prevStep = steps[index]
    const nextStep = steps[nextIndex]
    const dir = nextIndex > index ? 1 : -1
    index = nextIndex
    updateChrome()

    if (reduceMotion) {
      prevStep.hidden = true
      nextStep.hidden = false
      focusFirst(nextStep)
      return
    }

    // sequential, not overlapping: steps sit in normal document flow (not
    // absolutely stacked), so animating both at once would double-stack them.
    gsap.to(prevStep, {
      autoAlpha: 0,
      y: dir * -12,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        prevStep.hidden = true
        gsap.set(prevStep, { clearProps: 'all' })
        nextStep.hidden = false
        gsap.fromTo(
          nextStep,
          { autoAlpha: 0, y: dir * 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.28,
            ease: 'power2.out',
            onComplete: () => {
              gsap.set(nextStep, { clearProps: 'transform' })
              focusFirst(nextStep)
            },
          },
        )
      },
    })
  }

  function attemptAdvance(): void {
    let firstInvalid: Field | null = null
    for (const input of fieldsOf(steps[index])) {
      const message = validate(input)
      setError(input, message)
      if (message && !firstInvalid) firstInvalid = input
    }
    if (firstInvalid) {
      firstInvalid.focus()
      return
    }
    if (index < steps.length - 1) show(index + 1)
  }

  nextBtn.addEventListener('click', attemptAdvance)

  backBtn.addEventListener('click', () => {
    if (index > 0) show(index - 1)
  })

  // Enter key advances to the next question. Only <input> elements get this
  // listener — the one <textarea> (the last step) keeps Enter as a newline.
  for (const step of steps) {
    for (const input of step.querySelectorAll<HTMLInputElement>('input')) {
      input.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return
        event.preventDefault()
        attemptAdvance()
      })
    }
  }

  updateChrome()
}
