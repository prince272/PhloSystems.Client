import { NextResponse } from 'next/server';
import { findContextualRoute, PAGE_PATH_QUERY_PARAM } from '../views/routes';

function middleware(request) {

    if (findContextualRoute(request.nextUrl.toString())) { 
        const pagePath = request.nextUrl.searchParams.get(PAGE_PATH_QUERY_PARAM) || '/';
        return NextResponse.rewrite(new URL(pagePath, request.nextUrl));
    } 

    const response = NextResponse.next();
    return response;
}
export default middleware;