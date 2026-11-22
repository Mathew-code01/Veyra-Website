import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FAQContent } from '@/components/marketing/faq-content';

describe('marketing FAQ', () => {
  it('filters questions by category and search text', async () => {
    const user = userEvent.setup();
    render(<FAQContent />);

    await user.click(screen.getByRole('tab', { name: 'Local models' }));
    expect(screen.getByRole('heading', { name: 'Can my computer run local models?' })).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'Is VEYRA a chatbot?' })).not.toBeInTheDocument();

    await user.type(screen.getByRole('searchbox', { name: /search frequently asked questions/i }), 'runtime');
    expect(screen.getByRole('heading', { name: 'Can my computer run local models?' })).toBeVisible();

    await user.clear(screen.getByRole('searchbox', { name: /search frequently asked questions/i }));
    await user.type(screen.getByRole('searchbox', { name: /search frequently asked questions/i }), 'billing');
    expect(screen.getByRole('status')).toHaveTextContent('No questions found');
  });

  it('expands and collapses answers with accessible state', async () => {
    const user = userEvent.setup();
    render(<FAQContent />);

    const question = screen.getByRole('button', { name: /is veyra a chatbot/i });
    expect(question).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/two focused purposes/i)).toBeVisible();

    await user.click(question);
    expect(question).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText(/two focused purposes/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Billing' }));
    const billingQuestion = screen.getByRole('button', { name: /how is billing handled/i });
    expect(billingQuestion).toHaveAttribute('aria-expanded', 'true');
    expect(within(screen.getByRole('tabpanel')).getByText(/verified platform records/i)).toBeVisible();
  });
});
