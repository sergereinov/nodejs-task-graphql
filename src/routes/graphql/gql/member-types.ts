import { GraphQLError } from 'graphql/error';
import { DBApi } from "../../../utils/DB/DBApi";
import { ChangeMemberTypeDTO, MemberTypeEntity } from "../../../utils/DB/entities/DBMemberTypes";

/**
 * Member types resolvers and wrappers
 */

/**
 * Wrap memberType object to match GraphQL schema `type MemberType`
 */
export const wrapMemberType = (memberType: MemberTypeEntity) => ({
    ...memberType,
});


export const memberTypes = async (adb: DBApi) =>
    (await adb.memberTypes.getAll()).map((e) => wrapMemberType(e));

export const memberType = async (memberTypeId: string, adb: DBApi) => {
    const mt = await adb.memberTypes.getById(memberTypeId);
    if (!mt) return new GraphQLError('member type not found');
    return wrapMemberType(mt);
}

export const memberTypeByUserId = async (userId: string, adb: DBApi) => {
    const mt = await adb.memberTypes.getByUserId(userId);
    if (!mt) return new GraphQLError('member type not found');
    return wrapMemberType(mt);
}

export const updateMemberType = async (
    memberTypeId: string,
    dto: ChangeMemberTypeDTO,
    adb: DBApi
) =>
    wrapMemberType(await adb.memberTypes.update(memberTypeId, dto));
