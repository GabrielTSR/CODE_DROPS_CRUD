/*This function check if the password is valid with the following rules:
- Must be at least 8 characters long
- Must contain at least one number
- Must contain at least one uppercase letter
- Must contain at least one lowercase letter
- Must contain at least one special character
*/
export function isPasswordValid(password: string) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}
