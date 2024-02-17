import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function POST(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname.endsWith("get")) {
        const token = cookies().has('Authentication') ? cookies().get('Authentication').value : ''
        return Response.json({ token: token })
    } else if (pathname.endsWith("delete")) {
        cookies().has('Authentication') && cookies().delete('Authentication')
        return Response.json({})
    }

}