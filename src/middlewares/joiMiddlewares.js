import joi from 'joi';

const categorySchema = joi.object({
  name: joi.string().required()
});

async function validateCategory (req, res, next) {
  const { name } = req.body;

  const validation = categorySchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const error = validation.error.details.map(detail => detail.message);
    return res.status(400).send(error);
  }

  res.locals.category = { name };
  next();
}

export { validateCategory };