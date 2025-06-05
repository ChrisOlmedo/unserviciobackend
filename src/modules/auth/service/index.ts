import { OAuth2Client } from 'google-auth-library'
import { createUser, getUser } from '@modules/user/service'; // Ajusta la ruta según la estructura de tu proyecto
import { IUserDocument } from '@modules/user/types'; // Asegúrate de que este modelo esté correctamente definido

// You may want to import the correct type returned by userFormatter, e.g. UserFormatted
// import { UserFormatted } from '../utils/userFormatter';

export const authGoogleService = async (token: string): Promise<IUserDocument> => {
    const CLIENT_ID = process.env.GOOGLE_AUTH_CLIENT_ID;
    const client = new OAuth2Client(CLIENT_ID);
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.name) {
        throw new Error('Token inválido o incompleto');
    }

    const { email, name } = payload;

    let user = await getUser({ email: email });

    if (!user) {
        const newId = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
        user = await createUser({ userId: newId, name, email });
        if (!user) throw new Error('No se pudo crear el usuario');
    }

    return user;
}