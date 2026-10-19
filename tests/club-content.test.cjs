require('tsx/cjs');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { formatFee, resolveFeeText } = require('../src/data/feeText.ts');
const { membership, fees, faqs, timeline } = require('../src/data/clubContent.ts');
const faqConfig = require('../src/data/faq.json');

test('different joining and monthly amounts propagate to FAQ templates', () => {
  const amounts = { joining: 45000, monthly: 27500 };
  const answers = faqConfig.items.map(item => resolveFeeText(item.answer, amounts));
  assert.ok(answers.some(answer => answer.includes('45,000원')));
  assert.ok(answers.some(answer => answer.includes('27,500원')));
  assert.ok(answers.every(answer => !answer.includes('{{') && !answer.includes('3만원')));
  assert.equal(resolveFeeText('{{monthlyFee}} / {{joiningFee}} / {{monthlyFee}}', amounts), '27,500원 / 45,000원 / 27,500원');
});

test('current section content shares fees and valid FAQ categories', () => {
  assert.equal(fees.joining, formatFee(membership.fees.joining));
  assert.equal(fees.monthly, formatFee(membership.fees.monthly));
  assert.ok(faqs.some(item => item.answer.includes(fees.joining)));
  assert.ok(timeline.length > 0);
  assert.equal(new Set(faqs.map(item => item.id)).size, faqs.length);
  assert.ok(faqs.every(item => faqConfig.categories.includes(item.category)));
});

test('invalid fee values and misspelled placeholders fail explicitly', () => {
  for (const value of [-1, 1.5, NaN]) assert.throws(() => formatFee(value));
  assert.equal(formatFee(0), '0원');
  assert.throws(() => resolveFeeText('{{monthyFee}}', { joining: 0, monthly: 0 }), /monthyFee/);
});
