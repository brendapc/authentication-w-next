'use server';

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

}