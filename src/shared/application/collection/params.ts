export type Order = Array<string> | { [key: string]: string[] }

export type Filter = Array<string> | { [key: string]: any }

export type Query = string

export type Pagination = { page: number; limit: number; total?: number }
