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

  const trackFitCheckEvent = (eventName: string, parameters: Record<string, string | undefined>) => {
    window.dataLayer?.push(['event', eventName, parameters]);
  };

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
    trackFitCheckEvent('fit_check_start', { form_type: formType, ...attribution() });
  };

  const trackEmailRequirementClick = () => {
    trackFitCheckEvent('email_requirement_click', { form_type: formType, ...attribution() });
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
        trackFitCheckEvent('fit_check_submit', {
          form_type: formType,
          entry_content: entryContentValue,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
        });
        trackFitCheckEvent('generate_lead', {
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
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-accent-green)]/30 rounded-xl p-8 text-center">
        <div className="text-5xl mb-4">OK</div>
        <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
        <p className="text-[var(--color-text-secondary)] mb-4">
          Your inquiry has been received. Product specifications, availability, lead time, and commercial terms are confirmed for each inquiry.
        </p>
        <p className="text-sm text-[var(--color-text-muted)]">
          You can also email: <a href="mailto:chinajpq@outlook.com" onClick={trackEmailRequirementClick} className="text-[var(--color-brand-light)]">chinajpq@outlook.com</a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onFocus={trackFitCheckStart} className="space-y-6">
      {error && (
        <div className="bg-[var(--color-accent-red)]/10 border border-[var(--color-accent-red)]/30 rounded-lg p-4 text-sm text-[var(--color-accent-red)]">{error}</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Full Name *</label>
          <input type="text" id="name" name="name" required className="w-full px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-colors" placeholder="John Smith" />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Company *</label>
          <input type="text" id="company" name="company" required className="w-full px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-colors" placeholder="Acme Corp" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Email *</label>
          <input type="email" id="email" name="email" required className="w-full px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-colors" placeholder="john@acmecorp.com" />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Country *</label>
          <input type="text" id="country" name="country" required className="w-full px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-colors" placeholder="Germany" />
        </div>
      </div>
      <div>
        <label htmlFor="product_summary" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Product summary *</label>
        <textarea id="product_summary" name="product_summary" required rows={4} className="w-full px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-colors resize-y" placeholder="What are you building, who will use it, and what must move, pump, switch, or sense?" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="development_stage" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Development stage *</label>
          <select id="development_stage" name="development_stage" required className="w-full px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-colors"><option value="">Select stage</option><option>Concept</option><option>Engineering design</option><option>Prototype</option><option>Pilot build</option><option>Production transfer</option></select>
        </div>
        <div><label htmlFor="target_market" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Target market *</label><input type="text" id="target_market" name="target_market" required className="w-full px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-colors" placeholder="United States" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label htmlFor="cad_available" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">CAD available?</label><select id="cad_available" name="cad_available" className="w-full px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)]"><option value="">Select</option><option>Yes</option><option>No</option><option>In progress</option></select></div>
        <div><label htmlFor="bom_available" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">BOM available?</label><select id="bom_available" name="bom_available" className="w-full px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)]"><option value="">Select</option><option>Yes</option><option>No</option><option>In progress</option></select></div>
        <div><label htmlFor="prototype_available" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Prototype available?</label><select id="prototype_available" name="prototype_available" className="w-full px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)]"><option value="">Select</option><option>Yes</option><option>No</option><option>In progress</option></select></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label htmlFor="target_quantity" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Target quantity</label><input type="text" id="target_quantity" name="target_quantity" className="w-full px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)]" placeholder="Prototype and annual estimate" /></div>
        <div><label htmlFor="budget_range" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Working budget range</label><input type="text" id="budget_range" name="budget_range" className="w-full px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)]" placeholder="Optional; helps route the next step" /></div>
        <div><label htmlFor="target_date" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Target date</label><input type="date" id="target_date" name="target_date" className="w-full px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)]" /></div>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Constraints or questions</label>
        <textarea id="message" name="message" rows={4} className="w-full px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-colors resize-y" placeholder="Share technical constraints, known risks, or the decision you need help making." />
      </div>
      <div className="hidden" aria-hidden="true"><input type="checkbox" name="botcheck" /></div>
      <button type="submit" disabled={loading} className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-light)] rounded-lg transition-colors shadow-lg shadow-[var(--color-brand)]/20 disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? 'Submitting...' : isRFQ ? 'Start a Project Fit Check ->' : 'Discuss Sample Needs ->'}
      </button>
      <p className="text-xs text-[var(--color-text-muted)]">We respect your privacy. Your information will only be used to respond to your inquiry.</p>
    </form>
  );
}
