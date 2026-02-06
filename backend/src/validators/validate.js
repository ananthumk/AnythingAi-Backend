const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            // Handle Zod validation errors
            if (error.errors && Array.isArray(error.errors)) {
                const errors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                
                return res.status(400).json({ 
                    message: "Validation failed",
                    errors 
                });
            }
            
            // Handle other errors
            return res.status(400).json({ 
                message: "Validation failed",
                errors: [error.message || 'Unknown validation error']
            });
        }
    };
};

module.exports = { validate };