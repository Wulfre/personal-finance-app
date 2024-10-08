export const centsToDollarString = (cents: number) => {
    const string = cents.toString()
    const sign = string[0] === "-" ? "-" : ""
    const absoluteString = sign === "-" ? string.slice(1) : string

    const wholePart = absoluteString.slice(0, -2).padStart(1, "0")
    const fractionPart = absoluteString.slice(-2).padStart(2, "0")

    return `${sign}$${wholePart}.${fractionPart}`
}
