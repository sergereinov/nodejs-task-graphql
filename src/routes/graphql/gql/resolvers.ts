import { DBApi } from '../../../utils/DB/DBApi';
import { CreateUserDTO, UserEntity } from '../../../utils/DB/entities/DBUsers';
import { GraphQLError } from 'graphql/error';

const wrapUser = (user: UserEntity, abd: DBApi) => ({
    ...user,
    subscribedToUser: async ({ }, adb: DBApi) =>
        user.subscribedToUserIds.map(async (userId) => await adb.users.getById(userId))
});

export const rootResolver = {
    users: async ({ }, adb: DBApi) =>
        (await adb.users.getAll()).map((u) => wrapUser(u, adb)),

    user: async ({ id }: { id: string }, adb: DBApi) => {
        const u = await adb.users.getById(id);
        if (!u) return new GraphQLError('user not found');
        return wrapUser(u, adb);
    },

    createUser: async ({ input }: { input: CreateUserDTO }, adb: DBApi) => {
        return wrapUser(await adb.users.create(input), adb);
    },
};
