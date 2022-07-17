//This function is used to create an aleatory string with a length determined by the user
export function aleatoryString(length: number): string {
    //Initializing the string
    let text = '';

    //List of possible characters
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    //Looping through the length of the string
    for (let i = 0; i < length; i++) {
        //Adding a random character to the string
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    //Returning the string after the loop
    return text;
}
