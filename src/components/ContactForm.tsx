import { useState } from 'react';

interface ContactFormProps {
  formType?: 'rfq' | 'sample';
}

export default function ContactForm({ formType = 'rfq' }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isRFQ = formType === 'rfq';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Web3Forms integration — replace with your access key
    formData.append('access_key', 'YOUR_WEB3FORMS_ACCESS_KEY');
    formData.append('subject', isRFQ
      ? `RFQ from ${formData.get('company') || formData.get('name')}`
      : `Sample Request from ${formData.get('company') || formData.get('name')}`
    );

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        form.reset();
      } else {
        setError('Submission failed. Please email us directly.');
      }
    } catch {
      setError('Network error. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-accent-green)]/30 rounded-xl p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
        <p className="text-[var(--color-text-secondary)] mb-4">
          {isRFQ
            ? 'Your RFQ has been submitted. Our engineering team will respond within 24 hours.'
            : 'Your sample request has been submitted. We will confirm availability and shipping within 24 hours.'
          }
        </p>
        <p className="text-sm text-[var(--color-text-muted)]">
          For urgent inquiries, contact us directly at <a href="mailto:info@yukun-drive.com" className="text-[var(--color-brand-light)]">info@yukun-drive.com</a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-[var(--color-accent-red)]/10 border border-[var(--color-accent-red)]/30 rounded-lg p-4 text-sm text-[var(--color-accent-red)]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-colors"
            placeholder="John Smith"
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            Company *
          </label>
          <input
            type="text"
            id="company"
            name="company"
            required
            className="w-full px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-colors"
            placeholder="Acme Corp"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-colors"
            placeholder="john@acmecorp.com"
          />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            Country *
          </label>
          <input
            type="text"
            id="country"
            name="country"
            required
            className="w-full px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-colors"
            placeholder="Germany"
          />
        </div>
      </div>

      <div>
        <label htmlFor="product_interest" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
          Product Interest
        </label>
        <select
          id="product_interest"
          name="product_interest"
          className="w-full px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-colors"
        >
          <option value="">Select product category</option>
          <option value="Gear Motors">Gear Motors (N20, 370, 520)</option>
          <option value="BLDC Motors">BLDC Motors</option>
          <option value="Micro Pumps">Micro Pumps (TF30A, TM30A)</option>
          <option value="Micro Switches">Micro Switches</option>
          <option value="Custom Solution">Custom Solution — Please specify below</option>
          <option value="Multiple">Multiple Products</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
          {isRFQ ? 'Your Requirements *' : 'Sample Details *'}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-colors resize-y"
          placeholder={
            isRFQ
              ? 'Please describe your application, required torque, speed, voltage, quantity, and target lead time...'
              : 'Which product(s)? Quantity needed? Ship to which country? Any special requirements?'
          }
        />
      </div>

      {/* Honeypot — anti-spam */}
      <div className="hidden" aria-hidden="true">
        <input type="checkbox" name="botcheck" />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-light)] rounded-lg transition-colors shadow-lg shadow-[var(--color-brand)]/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : isRFQ ? 'Submit RFQ →' : 'Request Samples →'}
      </button>

      <p className="text-xs text-[var(--color-text-muted)]">
        We respect your privacy. Your information will only be used to respond to your inquiry.
      </p>
    </form>
  );
}
