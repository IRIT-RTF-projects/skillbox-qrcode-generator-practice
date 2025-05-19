import { configDotenv } from "dotenv";

configDotenv({ path: '/var/www/unified.env' })

const CONFIG = {
    URL: {
        SAVEDB_PORT: process.env["SAVEDB_PORT"],
        SAVEDB_HOST: process.env["SAVEDB_HOST"],
    }
}

type anyObj = {
    [key: string]: anyObj | string | undefined
}

const ERROR_LIST: string[] = []

function validateRecursively(obj: anyObj, fullPath: string = ''): void {
    for (const key of Object.keys(obj)) {
        const pathToValue = fullPath + '.' + key
        const value = obj[key]
        if (typeof value == 'object') {
            validateRecursively(value, pathToValue)
        }
        else if (typeof value == 'undefined') {
            ERROR_LIST.push(`Value is undefined under key ${pathToValue}`)
        }
    }
}

validateRecursively(CONFIG)

if (ERROR_LIST.length !== 0) {
    for (const err of ERROR_LIST) {
        console.warn(err);
    }
    throw new Error('CONFIG is not valid')
}

type DeepRequired<T> = T extends object ? {
    [K in keyof T]-?: NonNullable<DeepRequired<T[K]>>
} : NonNullable<T>;

export default Object.freeze(CONFIG as DeepRequired<typeof CONFIG>)