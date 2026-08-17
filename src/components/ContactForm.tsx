import { useRef, useState } from 'react';

interface ContactFormProps {
  formType?: 'rfq' | 'sample';
  entryContent?: string;
}

export default function ContactForm({ formType = 'rfq', entryContent }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const hasStarted = useRef(false);
  const isRFQ = formType === 'rfq';
  const accessKey = import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY?.trim();
  const labelClass = 'block mb-1.5 text-sm font-medium text-[var(--color-ink)]';
  const fieldClass = 'w-full border border-[var(--color-border)] bg-white px-4 py-2.5 text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] transition-colors focus:border-[var(--color-technical)] focus:outline-none focus:ring-1 focus:ring-[var(--color-technical)]';
  const fieldId = (name: string) => `${formType}-${name}`;

  const attribution = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      entry_content: params.get('entry')?.trim() || entryContent || 'contact',
      utm_source: params.get('utm_source')?.trim() || undefined,
      utm_medium: params.get('utm_medium')?.trim() || undefined,
      utm_campaign: params.get('utm_campaign')?.trim() || undefined,
    };
  };

  const trackFitCheckStart = () => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    window.gtag?.('event', 'fit_check_start', { form_type: formType, ...attribution() });
  };

  const trackEmailRequirementClick = () => {
    window.gtag?.('event', 'email_requirement_click', { form_type: formType, ...attribution() });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!accessKey) {
      setError('Online submission is not configured. Please email chinajpq@outlook.com.');
      setLoading(false);
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append('access_key', accessKey);
    formData.append('subject', isRFQ
      ? `RFQ from ${formData.get('company') || formData.get('name')}`
      : `Sample Request from ${formData.get('company') || formData.get('name')}`);

    const {
      entry_content: entryContentValue,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
    } = attribution();

    if (entryContentValue) formData.append('entry_content', entryContentValue);
    if (utmSource) formData.append('utm_source', utmSource);
    if (utmMedium) formData.append('utm_medium', utmMedium);
    if (utmCampaign) formData.append('utm_campaign', utmCampaign);

    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        window.gtag?.('event', 'fit_check_submit', {
          form_type: formType,
          entry_content: entryContentValue,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
        });
        window.gtag?.('event', 'generate_lead', {
          form_type: formType,
          entry_content: entryContentValue,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
        });
        setSubmitted(true);
        form.reset();
      } else {
        setError('Submission failed. Please email chinajpq@outlook.com.');
      }
    } catch {
      setError('Network error. Please email chinajpq@outlook.com.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="border border-[var(--color-technical)] bg-white p-8 text-center">
        <div className="tech-mono mb-4 text-sm uppercase tracking-[0.16em] text-[var(--color-technical)]">Received</div>
        <h3 className="mb-2 text-xl font-semibold text-[var(--color-ink)]">Thank you.</h3>
        <p className="mb-4 text-[var(--color-ink-muted)]">
          Your inquiry has been received. Product specifications, availability, lead time, and commercial terms are confirmed for each inquiry.
        </p>
        <p className="text-sm text-[var(--color-ink-muted)]">
          You can also email: <a href="mailto:chinajpq@outlook.com" onClick={trackEmailRequirementClick} className="text-[var(--color-technical)] hover:text-[var(--color-technical-light)]">chinajpq@outlook.com</a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onFocus={trackFitCheckStart} className="space-y-6">
      {error && (
        <div className="border border-[var(--color-accent-red)] bg-red-50 p-4 text-sm text-[var(--color-accent-red)]">{error}</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={fieldId('name')} className={labelClass}>Full Name *</label>
          <input type="text" id={fieldId('name')} name="name" required className={fieldClass} placeholder="John Smith" />
        </div>
        <div>
          <label htmlFor={fieldId('company')} className={labelClass}>Company *</label>
          <input type="text" id={fieldId('company')} name="company" required className={fieldClass} placeholder="Acme Corp" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={fieldId('email')} className={labelClass}>Email *</label>
          <input type="email" id={fieldId('email')} name="email" required className={fieldClass} placeholder="john@acmecorp.com" />
        </div>
        <div>
          <label htmlFor={fieldId('country')} className={labelClass}>Country *</label>
          <input type="text" id={fieldId('country')} name="country" required className={fieldClass} placeholder="Germany" />
        </div>
      </div>
      <div>
        <label htmlFor={fieldId('product_summary')} className={labelClass}>Product summary *</label>
        <textarea id={fieldId('product_summary')} name="product_summary" required rows={4} className={`${fieldClass} resize-y`} placeholder="What are you building, who will use it, and what must move, pump, switch, or sense?" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={fieldId('development_stage')} className={labelClass}>Development stage *</label>
          <select id={fieldId('development_stage')} name="development_stage" required className={fieldClass}><option value="">Select stage</option><option>Concept</option><option>Engineering design</option><option>Prototype</option><option>Pilot build</option><option>Production transfer</option></select>
        </div>
        <div><label htmlFor={fieldId('target_market')} className={labelClass}>Target market *</label><input type="text" id={fieldId('target_market')} name="target_market" required className={fieldClass} placeholder="United States" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label htmlFor={fieldId('cad_available')} className={labelClass}>CAD available?</label><select id={fieldId('cad_available')} name="cad_available" className={fieldClass}><option value="">Select</option><option>Yes</option><option>No</option><option>In progress</option></select></div>
        <div><label htmlFor={fieldId('bom_available')} className={labelClass}>BOM available?</label><select id={fieldId('bom_available')} name="bom_available" className={fieldClass}><option value="">Select</option><option>Yes</option><option>No</option><option>In progress</option></select></div>
        <div><label htmlFor={fieldId('prototype_available')} className={labelClass}>Prototype available?</label><select id={fieldId('prototype_available')} name="prototype_available" className={fieldClass}><option value="">Select</option><option>Yes</option><option>No</option><option>In progress</option></select></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label htmlFor={fieldId('target_quantity')} className={labelClass}>Target quantity</label><input type="text" id={fieldId('target_quantity')} name="target_quantity" className={fieldClass} placeholder="Prototype and annual estimate" /></div>
        <div><label htmlFor={fieldId('budget_range')} className={labelClass}>Working budget range</label><input type="text" id={fieldId('budget_range')} name="budget_range" className={fieldClass} placeholder="Optional; helps route the next step" /></div>
        <div><label htmlFor={fieldId('target_date')} className={labelClass}>Target date</label><input type="date" id={fieldId('target_date')} name="target_date" className={fieldClass} /></div>
      </div>
      <div>
        <label htmlFor={fieldId('message')} className={labelClass}>Constraints or questions</label>
        <textarea id={fieldId('message')} name="message" rows={4} className={`${fieldClass} resize-y`} placeholder="Share technical constraints, known risks, or the decision you need help making." />
      </div>
      <div className="hidden" aria-hidden="true"><input type="checkbox" name="botcheck" /></div>
      <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center bg-[var(--color-action)] px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[var(--color-action-hover)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
        {loading ? 'Submitting...' : isRFQ ? 'Start a Project Fit Check ->' : 'Discuss Sample Needs ->'}
      </button>
      <p className="text-xs text-[var(--color-ink-muted)]">We respect your privacy. Your information will only be used to respond to your inquiry.</p>
    </form>
  );
}
