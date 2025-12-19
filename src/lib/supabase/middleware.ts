import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // PROTECTED ROUTES: specific paths that require login
    const protectedPaths = ['/admin', '/tutor', '/problems']
    const isProtected = protectedPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    )

    // AUTH ROUTES: paths only for non-logged-in users (login, signup)
    const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')

    // 1. If trying to access protected route without user -> Redirect to /auth
    if (isProtected && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth'
        // Add ?next= param to redirect back after login
        url.searchParams.set('next', request.nextUrl.pathname)
        return NextResponse.redirect(url)
    }

    // 2. If logged in and trying to access auth pages -> Redirect to dashboard
    if (isAuthRoute && user) {
        const url = request.nextUrl.clone()
        url.pathname = '/tutor'
        return NextResponse.redirect(url)
    }

    return response
}
