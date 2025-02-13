'use server';

import { createAuthSession } from "@/lib/auth";
import { hashUserPassword } from "@/lib/hash";
import { createUser } from "@/lib/user";
import { redirect } from "next/navigation";

export async function signup(prevState, formData){
    const email = formData.get('email'); //from the name atribute of the input element
    const password = formData.get('password');

    //validate
    let errors = {};

    if(!email.includes('@')){
        errors.email = 'Please enter a valid email';
    }

    if(password.trim().length < 8){
        errors.password = 'Password must be at least 8 characters';
    }

    if(Object.keys(errors).length > 0){ 
        return { errors };
    }

    //store in the database
    const hashedPassword = hashUserPassword(password);
    
    try{
        const userId = createUser(email, hashedPassword);
        await createAuthSession(userId);
        redirect('/training');
    }catch(error){
        if(error.code === 'SQLITE_CONSTRAINT_UNIQUE'){
            errors.email = 'Email already in use';
            return { errors };
        }
        throw error;
    }
}