export class User {
    jwtToken: string;
    userInfo: {
        firstname: string;
        lastname: string;
        email: string;
        phone: string;
        id: string;
        expireTime: string
    }
}