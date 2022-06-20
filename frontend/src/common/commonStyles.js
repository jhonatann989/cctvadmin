export const styleGetter = (styleCase, columns = null) => {
    let col = 3
    if(!isNaN(Number(columns)) && Number(columns) > 0) { col = Number(columns) }
    switch(styleCase) {
        case "formBox":
            return {width: "100%", display: "grid", gridTemplateColumns: `repeat(${col}, 1fr)`, gridGap: "1vw"}
        default:
            return {}
    }
}

export const classNameGetter = (inputType, classType, columns = null) => {
    let col = 3
    if(!isNaN(Number(columns)) && Number(columns) > 0) { col = Number(columns) }
    
    return `${inputType}-${classType}${columns === null? "" : "-" + col }`

}