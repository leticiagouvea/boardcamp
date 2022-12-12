import joi from 'joi';

const categorySchema = joi.object({
  name: joi.string().required()
});

const gameSchema = joi.object({
  name: joi.string().required().min(2),
  image: joi.string().required(),
  stockTotal: joi.number().required().min(0),
  categoryId: joi.number().required().min(0),
  pricePerDay: joi.number().required().min(0)
});

export async function validateCategory (req, res, next) {
  const { name } = req.body;

  const validation = categorySchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const error = validation.error.details.map(detail => detail.message);
    return res.status(400).send(error);
  }

  res.locals.category = { name };
  next();
};

export async function validateGame (req, res, next) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  const validation = gameSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const error = validation.error.details.map(detail => detail.message);
    return res.status(400).send(error);
  }

  res.locals.game = { name, image, stockTotal, categoryId, pricePerDay };
  next();
};