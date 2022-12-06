import { NextResponse } from 'next/server';
import { findContextualRoute, PAGE_PATH_QUERY_PARAM } from '../views/routes';

function middleware(request) {

    console.log('1');

    if (findContextualRoute(request.nextUrl.toString())) { 
        console.log('2');
        const pagePath = request.nextUrl.searchParams.get(PAGE_PATH_QUERY_PARAM) || '/';
        console.log('3');
        return NextResponse.rewrite(new URL(pagePath, request.nextUrl));
    } 

    console.log('4');
    const response = NextResponse.next();
    return response;
}
export default middleware;