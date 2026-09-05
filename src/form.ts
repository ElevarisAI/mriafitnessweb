// Lead-capture forms. Custom inline validation on required fields, then an AJAX
// POST to the form's Formspree action so the visitor stays on the page and the
// form is swapped for a confirmation message.
export type Field = HTMLInputElement | HTMLTextAreaElement

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validate(input: Field): string {
  const value = input.value.trim()
  if (input.hasAttribute('required') && !value) return 'This field is required.'
  if (input.type === 'email' && value && !EMAIL_RE.test(value)) return 'Please enter a valid email address.'
  return ''
}

export function setError(input: Field, message: string): void {
  const error = input.closest('.field')?.querySelector<HTMLElement>('[data-error]')
  if (error) error.textContent = message
  input.setAttribute('aria-invalid', message ? 'true' : 'false')
}

// Validate, then submit to the form's action (Formspree) over fetch. On success
// the form hides and the confirmation shows; on failure the error line appears.
function wireAjaxSubmit(form: HTMLFormElement, fields: Field[], confirm: HTMLElement): void {
  const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]')
  const errorEl = form.querySelector<HTMLElement>('[data-form-error]')

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    let firstInvalid: Field | null = null
    for (const input of fields) {
      const message = validate(input)
      setError(input, message)
      if (message && !firstInvalid) firstInvalid = input
    }
    if (firstInvalid) {
      firstInvalid.focus()
      return
    }

    if (errorEl) errorEl.hidden = true
    const label = submitBtn?.textContent ?? 'Send'
    if (submitBtn) {
      submitBtn.disabled = true
      submitBtn.textContent = 'Sending…'
    }
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
      if (!response.ok) throw new Error(`Formspree responded ${response.status}`)
      form.hidden = true
      confirm.hidden = false
      confirm.focus()
    } catch {
      if (errorEl) errorEl.hidden = false
      if (submitBtn) {
        submitBtn.disabled = false
        submitBtn.textContent = label
      }
    }
  })

  // Clear a field's error as soon as the user fixes it.
  for (const input of fields) {
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') setError(input, validate(input))
    })
  }
}

// Main coaching enquiry form on the final CTA section.
export function initForm(): void {
  const form = document.querySelector<HTMLFormElement>('#lockForm')
  const confirm = document.querySelector<HTMLElement>('[data-form-confirm]')
  if (!form || !confirm) return
  const fields = [...form.querySelectorAll<Field>('input:not([type="hidden"]), textarea')]
  wireAjaxSubmit(form, fields, confirm)
}

// Waitlist email capture on the plan section: the "NOTIFY ME" button reveals a
// small name + email form; it submits to Formspree the same way.
export function initWaitlist(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-waitlist-toggle]')
  const form = document.querySelector<HTMLFormElement>('[data-waitlist]')
  const confirm = document.querySelector<HTMLElement>('[data-waitlist-confirm]')
  if (!toggle || !form || !confirm) return

  const fields = [...form.querySelectorAll<Field>('input:not([type="hidden"])')]

  toggle.addEventListener('click', () => {
    form.hidden = false
    toggle.hidden = true
    toggle.setAttribute('aria-expanded', 'true')
    fields[0]?.focus()
  })

  wireAjaxSubmit(form, fields, confirm)
}
