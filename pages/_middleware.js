import { NextResponse } from 'next/server';
import { getPath } from '../utils';
import { findContextualRoute, PAGE_PATH_QUERY_PARAM } from '../views/routes';

function middleware(request) {

    const middlewarePath = getPath(request.nextUrl?.href);

    if (middlewarePath && findContextualRoute(middlewarePath)) { 
        console.error('2');
        const pagePath = request.nextUrl.searchParams.get(PAGE_PATH_QUERY_PARAM) || '/';
        console.error('3');
        return NextResponse.rewrite(new URL(pagePath, request.nextUrl.url));
    } 

    console.error('4');
    const response = NextResponse.next();
    return response;
}
export default middleware;