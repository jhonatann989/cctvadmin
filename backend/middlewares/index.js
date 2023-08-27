const getPermission = require("../helperFunctions/getPermitions")

/**
 * 
 * @param {*} req ExpressJS req param
 * @param {*} res ExpressJS res param
 * @param {*} next ExpressJS next param
 * @param {*} opt {module, permission} module => Module Name, permission => CRUD permission
 */
const isAccessEnabledMiddleare  = async (req, res, opt, next = undefined) => {
    if (await getPermission(opt.module, opt.permission, req.header("Authorization"))) {
        if (typeof next == "function") {
            next()
        } else {
            return
        }
    } else {
        res.status(403).send({msg: `[${opt.permission}] action forbidden on module [${opt.module}]`})
    }
}

/**
 * 
 * @param {*} targetHeader header obtained by req.header("Authorization")
 * @param {*} opt {module, permission} module => Module Name, permission => CRUD permission
 * @returns 
 */
const isAccessEnabled = async (targetHeader, opt) =>  await getPermission(opt.module, opt.permission, targetHeader)

module.exports = {
    isAccessEnabled,
    checkAccess: isAccessEnabledMiddleare,
    isAccessEnabledMiddleare
}
