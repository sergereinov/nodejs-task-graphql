import DB from "./DB";
import { CreateUserDTO, UserEntity } from "./entities/DBUsers";
import { CreatePostDTO, PostEntity } from "./entities/DBPosts";
import { CreateProfileDTO, ProfileEntity } from './entities/DBProfiles';
import { MemberTypeEntity } from "./entities/DBMemberTypes";

export class DBApi {
    constructor(
        private db: DB
    ) { };

    users = {
        getAll: async (): Promise<UserEntity[]> => this.db.users.findMany(),
        getById: async (id: string): Promise<UserEntity | null> =>
            this.db.users.findOne({ key: 'id', equals: id }),
        getSubscribedTo: async (userId: string): Promise<UserEntity[]> =>
            this.db.users.findMany({ key: 'subscribedToUserIds', inArray: userId }),
        create: async (dto: CreateUserDTO) => this.db.users.create(dto),

        subscribeTo: async (userId: string, subscribesToUserId: string): Promise<UserEntity | null> => {
            const user = await this.db.users.findOne({ key: 'id', equals: subscribesToUserId });
            if (!user) return null;
            const idx = user.subscribedToUserIds.findIndex((id) => id === userId);
            if (idx < 0) user.subscribedToUserIds.push(userId);
            const upd = await this.db.users.change(subscribesToUserId, user);
            console.log('subscribeTo', upd);
            return upd;
        },
    }

    posts = {
        getAll: async () => this.db.posts.findMany(),
        getById: async (id: string): Promise<PostEntity | null> =>
            this.db.posts.findOne({ key: 'id', equals: id }),
        getByUserId: async (userId: string) =>
            this.db.posts.findMany({ key: 'userId', equals: userId }),
        create: async (dto: CreatePostDTO) => this.db.posts.create(dto),
    }

    profiles = {
        getAll: async () => this.db.profiles.findMany(),
        getById: async (id: string): Promise<ProfileEntity | null> =>
            this.db.profiles.findOne({ key: 'id', equals: id }),
        getByUserId: async (userId: string): Promise<ProfileEntity | null> =>
            this.db.profiles.findOne({ key: 'userId', equals: userId }),
        create: async (dto: CreateProfileDTO) => this.db.profiles.create(dto)
    }

    memberTypes = {
        getAll: async () => this.db.memberTypes.findMany(),
        getById: async (id: string): Promise<MemberTypeEntity | null> =>
            this.db.memberTypes.findOne({ key: 'id', equals: id }),
        getByUserId: async (userId: string): Promise<MemberTypeEntity | null> => {
            const profile = await this.db.profiles.findOne({ key: 'userId', equals: userId });
            if (!profile) return null;
            return this.memberTypes.getById(profile.memberTypeId);
        },
    }
};
