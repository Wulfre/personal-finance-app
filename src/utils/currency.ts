export const centsToDollarString = (cents: number) => {
    const string = cents.toString()
    const sign = string[0] === "-" ? "-" : ""
    const absoluteString = sign === "-" ? string.slice(1) : string

    return `${sign}$${absoluteString.slice(0, -2)}.${absoluteString.slice(-2)}`
}
