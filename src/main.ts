import QRCode from "qrcode";


type ParsedArgs = {
    text: string,
    size?: number
}

function parseArgv(): ParsedArgs {
    const { argv } = process

    if (argv[2] != 'generate') throw new Error('unknown command')
    const text = argv[3]
    if (text == null || text == '') throw new Error('please provide text')

    if (argv[4] == null) return { text }

    if (argv[4] !== '--size') throw new Error('unknown parameter: ' + argv[4])

    const size = Number(argv[5])
    if (Number.isNaN(size) || size < 1 || size > 40) throw new Error('bad size param, needs to be a number beetween 1 and 40')

    return { text, size }
}


async function generateQr(text: string, size: number | undefined) {
    try {
        console.log(await QRCode.toString(
            text,
            { version: size }
        ))
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message)
        }
    }
}

async function main() {
    try {
        const { text, size } = parseArgv()
        await generateQr(text, size)
    } catch (err) {
        console.log(err)
    }
}

main()