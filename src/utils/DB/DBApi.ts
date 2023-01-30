import DB from "./DB";
import { UserEntity, CreateUserDTO } from "./entities/DBUsers";
import { CreatePostDTO, PostEntity } from "./entities/DBPosts";

export class DBApi {
    constructor(
        private db: DB
    ) { };

    users = {
        getAll: async (): Promise<UserEntity[]> => this.db.users.findMany(),
        getById: async (id: string): Promise<UserEntity | null> =>
            this.db.users.findOne({ key: 'id', equals: id }),
        create: async (dto: CreateUserDTO) => this.db.users.create(dto),
    }

    posts = {
        getAll: async () => this.db.posts.findMany(),
        getById: async (id: string): Promise<PostEntity | null> =>
            this.db.posts.findOne({ key: 'id', equals: id }),
        getByUserId: async (userId: string) =>
            this.db.posts.findMany({ key: 'userId', equals: userId }),
        create: async (dto: CreatePostDTO) => this.db.posts.create(dto),
    }
};
