/**
 * Wrapper para funciones asíncronas que captura errores y los envía a next().
 * Elimina la necesidad de try/catch en cada controlador.
 */
export const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
