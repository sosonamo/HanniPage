import membershipConfig from './membership.json';
import aboutConfig from './about.json';
import timelineConfig from './timeline.json';
import faqConfig from './faq.json';
import { formatFee, resolveFeeText } from './feeText';
import type { ClubTimelineItem, FaqItem } from '../types';

export const about = aboutConfig;
export const membership = membershipConfig;
export const faqContent = faqConfig;
export const fees = {
  joining: formatFee(membership.fees.joining),
  monthly: formatFee(membership.fees.monthly),
};
export const timelineTitle = timelineConfig.title;
export const timeline: ClubTimelineItem[] = timelineConfig.items;
export const faqs: FaqItem[] = faqConfig.items.map(item => ({
  ...item,
  question: resolveFeeText(item.question, membership.fees),
  answer: resolveFeeText(item.answer, membership.fees),
}));
