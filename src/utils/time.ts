export const MS_PER_SECOND = 1000
export const MS_PER_MINUTE = MS_PER_SECOND * 60
export const MS_PER_HOUR = MS_PER_MINUTE * 60
export const MS_PER_DAY = MS_PER_HOUR * 24
export const MS_PER_WEEK = MS_PER_DAY * 7
const MS_PER_MONTH = MS_PER_DAY * 30.44 // average length of month
const MS_PER_YEAR = MS_PER_DAY * 365.25 // accounting for leap year

export const reduceDuration = (
    {
        milliseconds = 0,
        seconds = 0,
        minutes = 0,
        hours = 0,
        days = 0,
        weeks = 0,
        months = 0,
        years = 0,
    },
    output: "seconds" | "milliseconds",
) => {
    let total = 0
    total += milliseconds
    total += seconds * MS_PER_SECOND
    total += minutes * MS_PER_MINUTE
    total += hours * MS_PER_HOUR
    total += days * MS_PER_DAY
    total += weeks * MS_PER_WEEK
    total += months * MS_PER_MONTH
    total += years * MS_PER_YEAR

    switch (output) {
        case "milliseconds":
            return total
        case "seconds":
            return total / MS_PER_SECOND
    }
}
