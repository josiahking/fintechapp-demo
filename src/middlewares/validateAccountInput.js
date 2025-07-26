const Joi = require('joi');

const accountSchema = Joi.object({
    first_name: Joi.string().trim().required(),
    last_name: Joi.string().trim(),
    email: Joi.string().email().required(),
    phone: Joi.string().trim().required(),
    amount: Joi.number().positive().required()
});

function validateAccountInput(req, res, next) {
    const { error } = accountSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

module.exports = validateAccountInput;