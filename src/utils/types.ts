export type Nullable<T> = T extends object
    ? {
          [K in keyof T]: Nullable<T[K]> | null | undefined
      }
    : T | null | undefined
