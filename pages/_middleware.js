import { NextResponse } from 'next/server';
import { findContextualRoute, PAGE_PATH_QUERY_PARAM } from '../views/routes';

function middleware(request) {

    console.error(request.nextUrl);

    if (findContextualRoute(request.nextUrl.toString())) { 
        console.error('2');
        const pagePath = request.nextUrl.searchParams.get(PAGE_PATH_QUERY_PARAM) || '/';
        console.error('3');
        return NextResponse.rewrite(new URL(pagePath, request.nextUrl));
    } 

    console.error('4');
    const response = NextResponse.next();
    return response;
}
export default middleware;