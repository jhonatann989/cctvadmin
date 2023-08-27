export const BACKEND_URL = "http://localhost:4000"

export const LANGUAJE = "es"

export const modules = [
    { id: "users", name: "Users" },
    { id: "cases", name: "Cases" },
]

export const modulePermissions = [
    { id: "list", name: "Listar" },
    { id: "show", name: "Mostrar" },
    { id: "edit", name: "Editar" },
    { id: "create", name: "Crear" },
    { id: "delete", name: "Borrar" },
]

export const cc_types = [
    { id: "CC", name: "Cedula de Ciudadanía" },
    { id: "CE", name: "Cedula de Extrangería" },
    { id: "PP", name: "Pasaporte" },
    { id: "PE", name: "Permiso Especial de Permanencia" },
    { id: "OT", name: "Otro" }
]

export const roles = [
    { id: "customer", name: "Cliente Final" },
    { id: "reseller", name: "Mayorista" },
    { id: "technical", name: "Técnico" },
    { id: "seller", name: "Vendedor" },
    { id: "administrator", name: "Administrador" },
    { id: "owner", name: "Propietario" },
]

export const hiring_type = [
    { id: "worker_by_contract", name: "Trabajador por Contrato" },
    { id: "worker_internal", name: "Trabajador Interno" },
    { id: "worker_external", name: "Externo" },
]

export const states = [
    { id: "pending", name: "Pendiente" },
    { id: "ongoing", name: "En Curso" },
    { id: "done", name: "Listo" },
]

export const quotation_states = [
    { id: "pending", name: "En Redacción" },
    { id: "ongoing", name: "Pendiente" },
    { id: "done", name: "Aprobada por el cliente" },
]
