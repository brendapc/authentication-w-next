import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import db from "./db";
import { cookies } from "next/headers";

const adapter = new BetterSqlite3Adapter(db, {
    user: 'users',
    session: 'sessions'
});

const lucia = new Lucia(adapter, {
    sessionCookie: {
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === 'production',
        }
    }
})

export async function createAuthSession(userId){
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}

export async function verifyAuthSession(){
    const sessionCookie = (await cookies()).get(lucia.sessionCookieName);
   
    if(!sessionCookie){
        return {
            user: null,
            session: null
        }
    }

    const sessionId = sessionCookie.value;

    if(!sessionId){
        return {
            user: null,
            session: null
        }
    }

    const result = await lucia.validateSession(sessionId);

    try {
        if(result.session && result.session.fresh){
            const sessionCookie = lucia.createSessionCookie(result.session.id);
            (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        }

        if(!result.session){
            const sessionCookie = lucia.createBlankSessionCookie();
            (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        }

    } catch (err) {} //if the operation fails due to page redering, ignore it


    return result;
}

export async function destroyAuthSession(){
    const { session } = await verifyAuthSession();
    if(!session){
        return {
            error: "Unauthorized"
        }
    }

    await lucia.invalidateSession(session.id); //delete from db

    const sessionCookie = lucia.createBlankSessionCookie();
    (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    
}