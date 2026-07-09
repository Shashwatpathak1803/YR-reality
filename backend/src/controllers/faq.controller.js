import { makeCrudController } from './factory.controller.js';
import { faqService } from '../services/faq.service.js';

const base = makeCrudController(faqService, 'FAQ', ['question', 'answer']);

export const createFaq = base.create;
export const getFaqs = base.getAll;
export const getFaqById = base.getById;
export const updateFaq = base.update;
export const deleteFaq = base.remove;
