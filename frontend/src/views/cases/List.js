import * as React from "react"
import { Datagrid, List, NumberField, ReferenceField, FunctionField, SimpleList
} from "react-admin"
import { useMediaQuery } from '@mui/material';
import { PostBulkActionButtons, ListActions } from "../../common/components"

export const ListCases = () => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('md'))
    return(
        <List>
            {isSmall?
                <SimpleList
                    primaryText={() => (
                        <ReferenceField source="id_user" reference="users" link={false} >
                            <FunctionField render={record => record && `${record.cc} - ${record.name}`} />
                        </ReferenceField>
                    )}
                    secondaryText={record => {
                        let secondaryText = []
                        if(record.CaseTechnicalStudies.length) {
                            secondaryText.push(`Estudio: ${record.CaseTechnicalStudies[0].state}`)
                        }

                        if(record.CaseSales.length) {
                            secondaryText.push(`Venta: ${record.CaseSales[0].state}`)
                        }

                        if(record.CaseInstallations.length) {
                            secondaryText.push(`Instalación: ${record.CaseInstallations[0].state}`)
                        }

                        return secondaryText.join(" - ")
                    }}
                    tertiaryText={record => {
                        if(record.CaseTechnicalStudies.length) {
                            return(
                                <ReferenceField source="CaseTechnicalStudies[0].id_responsible" reference="users" link={false} >
                                    <FunctionField render={record => record && `Responsable: ${record.name}`} />
                                </ReferenceField>
                            )
                        }else if(record.CaseSales.length) {
                            return(
                                <ReferenceField source="CaseSales[0].id_responsible" reference="users" link={false} >
                                    <FunctionField render={record => record && `Responsable: ${record.name}`} />
                                </ReferenceField>
                            )
                        }else if(record.CaseInstallations.length) {
                            return(
                                <ReferenceField source="CaseInstallations[0].id_responsible" reference="users" link={false} >
                                    <FunctionField render={record => record && `Responsable: ${record.name}`} />
                                </ReferenceField>
                            )
                        }

                    }}
                    linkType="show"
                />
                :
                <Datagrid bulkActionButtons={<PostBulkActionButtons url="cases" /> }>
                    <NumberField source="id" fullWidth />
                    <ReferenceField source="id_user" reference="users">
                        <FunctionField render={record => record && `${record.cc} - ${record.name}`} />
                    </ReferenceField>
                    {/* <SelectField 
                        source="state" 
                        choices={[
                            { id: "technical_study", name: "Technical Study" },
                            { id: "quotation_request", name: "Quotation Request" },
                            { id: "sale", name: "Sale" },
                            { id: "installation", name: "Instalation" },
                        ]}
                    /> */}
                    <ListActions url="cases" />
                </Datagrid>

            }
        </List>
    )
}