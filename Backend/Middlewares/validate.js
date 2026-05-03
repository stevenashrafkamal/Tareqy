export const validate = (schema) => {
    return (req, res, next) => {
        try {
            const validationResult = schema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true
            });

            if (validationResult.error) {
                const errorMessage = validationResult.error.details.map(mes => mes.message);
                return res.status(422).send({ err: errorMessage });
            }
            
            req.body = validationResult.value;
            next();
        } catch (err) {
            next(err);
        }
    };
};
