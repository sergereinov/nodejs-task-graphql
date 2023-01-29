import DB from "./DB";
import { UserEntity, CreateUserDTO } from "./entities/DBUsers";

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
};
