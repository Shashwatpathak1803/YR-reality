import { Router } from 'express';

import authRoutes from './auth.routes.js';
import propertyRoutes from './property.routes.js';
import categoryRoutes from './category.routes.js';
import offerRoutes from './offer.routes.js';
import testimonialRoutes from './testimonial.routes.js';
import faqRoutes from './faq.routes.js';
import enquiryRoutes from './enquiry.routes.js';
import siteVisitRoutes from './siteVisit.routes.js';
import customerRoutes from './customer.routes.js';
import settingsRoutes from './settings.routes.js';
import mediaRoutes from './media.routes.js';

const router = Router();

router.get('/health', (req, res) => res.status(200).json({ success: true, message: 'API is healthy' }));

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/categories', categoryRoutes);
router.use('/offers', offerRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/faqs', faqRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/site-visits', siteVisitRoutes);
router.use('/customers', customerRoutes);
router.use('/settings', settingsRoutes);
router.use('/media', mediaRoutes);

export default router;
