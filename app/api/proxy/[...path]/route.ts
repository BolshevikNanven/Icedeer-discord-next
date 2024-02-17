import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = "http://" + process.env.NEXT_PUBLIC_SERVER_URL

const TOKENLESS_URL = ['/sign']

export async function POST(req: NextRequest, { params }) {
    const { pathname, searchParams } = req.nextUrl;

    const path = '/' + params.path.join('/')
    const isTokenless = TOKENLESS_URL.some(premix => pathname.startsWith('/api/proxy' + premix))
    const body = await new Response(req.body).text()

    let header = {}

    const searchParamString = getSearchParamsAsString(searchParams)

    if (!isTokenless) {
        header['Authentication'] = cookies().has('Authentication') ? cookies().get('Authentication').value : ''
    }


    const res = await fetch(BACKEND_URL + path + searchParamString, {
        body: body,
        headers: header,
        credentials: 'omit',
        method: 'POST',
    })
    const data = await res.json()

    //登录成功写入Cookies
    if (pathname.startsWith('/api/proxy/sign') && data.success) {
        cookies().set('Authentication', data.data, {
            httpOnly: true,
            sameSite: 'lax',
        })
    }

    return Response.json(data)
}

function getSearchParamsAsString(searchParams: URLSearchParams) {
    let searchParamString: string[] = [];
    searchParams.forEach((value, key) => searchParamString.push(key + '=' + value))

    return searchParamString.length > 0 ? '?' + searchParamString.join('&') : ''
}
