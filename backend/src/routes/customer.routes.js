import { Router } from 'express';
import * as customerController from '../controllers/customer.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { idParamValidator } from '../validators/property.validator.js';

const router = Router();

router.use(protect); // Customers are admin-only (CRM data)

router.post('/', customerController.createCustomer);
router.get('/', customerController.getCustomers);
router.get('/:id', idParamValidator, validate, customerController.getCustomerById);
router.put('/:id', idParamValidator, validate, customerController.updateCustomer);
router.delete('/:id', idParamValidator, validate, customerController.deleteCustomer);

export default router;
