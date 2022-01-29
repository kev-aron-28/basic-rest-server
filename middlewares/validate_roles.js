const { response, request } = require("express");

const validateRole = (req = request, res = response, next) => {
    if(!req.user) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token'
        });
    }
    const { role, name } = req.user;
    if(role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${name} is not admin - cannot`
        })
    }

    next();
}   

const hasRole = (...roles ) => {
    return (req, res, next) => {
        if(!req.user) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token'
            });
        }

        if(!roles.includes(req.user.role)){
            return res.status(401).json({
                msg: 'No tiene permiso para esta accion'
            })
        }
        
        next();
    }
}

module.exports = {
    validateRole,
    hasRole
};