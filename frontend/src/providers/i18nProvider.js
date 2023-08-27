import polyglotI18nProvider from 'ra-i18n-polyglot';
import es from '@blackbox-vision/ra-language-spanish'
import { LANGUAJE } from '../common/configs';

export const resourcesTranslations = {
    es: {
    userauths: {
        name: 'Acceso |||| Accesos',
        fields: {
            UserId: 'ID del usuario',
            username: 'Nombre',
            password:"Contraseña",
            password2: "Repita la Contraseña",
            UserPermissions: "Permisos del Usuario",
            module: "Módulo",
            view: "Vista",
            can_view: "Con Acceso"
        }
    },
    users: {
        name: 'Usuario |||| Usuarios',
        fields: {
            id: 'ID',
            cc:"Cédula",
            cc_type: "Tipo de Cédula",
            name: 'Nombre',
            email: "E-Mail",
            role: "Rol",
            UserDatas: "Datos Adicionales",
            dataKey:"Tipo de Dato",
            dataValue: "valor",
            UserStaffs: "Rol en el Staff"
        }
    },
    cases: {
        name: 'Caso |||| Casos',
        fields: {
            id: 'ID del usuario',
            id_user:"Cédula del Cliente",
            CaseTechnicalStudies:"Estudio Técnico",
            id_responsible: "Responzable",
            evaluation: 'Evaluación de viabilidad',
            state: "Estado",
            isFeasable: "¿La instalación es viable?",
            CaseQuotationRequests: "Solicitud de Cotización",
            quotation_doc: "Documento de Cotización",
            CaseSales: "Venta",
            id_bill: "Código de la Factura",
            sales_doc: "Documento de la Factura",
            CaseInstallations: "Instalación",
            installation_report: "Reporte de Instalación",
            has_been_installed: "¿Instalación Finalizada?"
        }
    }
}
}

let formatSpanish = (resources) => ({ ...es, resources: resources })

export const i18nProvider = polyglotI18nProvider(() => formatSpanish(resourcesTranslations[LANGUAJE]), 'es');

export const resources = resourcesTranslations[LANGUAJE]