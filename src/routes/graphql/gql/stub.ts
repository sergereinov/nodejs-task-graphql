import { DBApi } from '../../../utils/DB/DBApi';
import * as usersResolver from './users';

/**
 * Create stub data
 *  - three users
 *  - (1,2) subscribes to (3)
 *  - three profiles
 *  - two posts per user
 */
export const createStub = async (seed: string, adb: DBApi) => {
    // create three users
    const users = await Promise.all(
        [1, 2, 3].map(async (e) => await adb.users.create({
            firstName: `${seed}-firstName${e}`,
            lastName: `${seed}-lastName${e}`,
            email: `mail${e}@a.org`
        }))
    );

    // subscribes to last
    const lastUser = users.pop()!;
    for (let i = 0; i < users.length; i++) {
        await adb.users.subscribeTo(users[i].id, lastUser.id)
    }

    // create three profiles
    await Promise.all([...users, lastUser].map((e, index, arr) =>
        adb.profiles.create({
            avatar: `${seed}-avatar${index + 1}`,
            sex: `${seed}-sex${index + 1}`,
            birthday: index + 1,
            country: `${seed}-country${index + 1}`,
            street: `${seed}-street${index + 1}`,
            city: `${seed}-city${index + 1}`,
            memberTypeId: index < arr.length - 1 ? 'basic' : 'business',
            userId: e.id
        })
    ));

    // create two posts per user
    await Promise.all([...users, lastUser].map(async (e) => {
        await Promise.all([1, 2].map((n) => adb.posts.create({
            title: `${seed}-title-${e.firstName}-${n}`,
            content: `${seed} content by ${e.firstName} of post #${n}`,
            userId: e.id
        })));
    }));

    return usersResolver.users(adb);
}