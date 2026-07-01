import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const isAdminRoute = /\/[a-z]{2}\/admin/.test(request.nextUrl.pathname)

  // Only check auth for admin routes — skip Supabase call for public pages
  if (!isAdminRoute) {
    return NextResponse.next({ request })
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll()      { return request.cookies.getAll() },
        setAll(pairs) {
          pairs.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          pairs.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = new URL('/lo/auth/login', request.url)
    loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
