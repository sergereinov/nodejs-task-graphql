<code style="color: green">You can use COPY functionality in web view of readme</code>

##Run app:

``npm run start``

## 1. Add logic to the restful endpoints (users, posts, profiles, member-types folders in ./src/routes).

``npm run test`` <code style="color: green">100%</code>

---
## 2. Add logic to the graphql endpoint (graphql folder in ./src/routes).

For testing you can use [mock data](./src/utils/DB/mockData).
You just need uncomment all comments at following files:
[here](./src/utils/DB/entities/DBUsers.ts),
[here](./src/utils/DB/entities/DBProfiles.ts) and
[here](./src/utils/DB/entities/DBPosts.ts).

<code style="color: orange">Be careful, uncomment only after checking 1 task. It affects tests because of changing initial state of DB</code>
## Query examples:
### 2.1 Get users, profiles, posts, memberTypes - 4 operations in one query.
```graphql
query {
   users {
      id,
      firstName
   }
   profiles {
      id,
      birthday,
      memberTypeId,
   }
   posts {
      id,
      title
   }
   memberTypes {
      id,
      monthPostsLimit
   }
}
```
---
### 2.2 Get user, profile, post, memberType by id - 4 operations in one query.
```json
{
  "userId": "f3bcd21e-de39-44be-8d1f-37e4fecb1943",
  "profileId": "c35b4768-148a-4dfc-aaff-89887da786cb",
  "postId": "746dcf4b-32f7-44b8-a76b-ea4f42323e05",
  "memberTypeId": "basic"
}
```

```graphql
query($userId: ID,  $profileId: ID, $postId: ID, $memberTypeId: String) {
    user(id: $userId) {
        id,
        firstName
    }
    profile(id: $profileId) {
        id,
        birthday,
        memberTypeId,
    }
    post(id: $postId) {
        id,
        title
    }
    memberType(id: $memberTypeId) {
        id,
        discount,
        monthPostsLimit
    }
}
```
---
### 2.3. Get users with their posts, profiles, memberTypes.
```graphql
query {
    users {
        id,
        firstName,
        posts {
            id
        },
        profile {
            id
        },
        memberType {
            id,
        }
    }
}
```
---
### 2.4. Get user by id with his posts, profile, memberType.
```json
{
  "userId": "add0ece3-74ca-477c-8e02-21aa7be0aba5"
}
```

```graphql
query($userId: ID) {
    user(id: $userId) {
        id,
        firstName,
        posts {
            id,
            title
        }
        profile {
            id,
            memberTypeId
        }
        memberType {
            id,
            discount,
        }
    }
}
```
---
### 2.5. Get users with their userSubscribedTo, profile.
```graphql
query {
   users {
      id,
      firstName,
      profile {
         id,
         memberTypeId
      },
      userSubscribedTo  {
         id,
         firstName,
      }
   }
}
```
---
### 2.6. Get user by id with his subscribedToUser, posts.
```json
{
    "userId": "add0ece3-74ca-477c-8e02-21aa7be0aba5"
}
```
```graphql
query($userId: ID) {
    user(id: $userId) {
        id,
        firstName,
        posts {
            id,
            title
        },
        subscribedToUser {
            id,
            firstName,
        }
    }
}
```
---
### 2.7. Get users with their userSubscribedTo, subscribedToUser
```graphql
query {
    users {
      id,
      firstName,
      userSubscribedTo {
          id,
          firstName,
          userSubscribedTo {
              id,
              firstName,
          },
          subscribedToUser {
              id,
              firstName,
          },
      },
      subscribedToUser {
          id,
          firstName,
          userSubscribedTo {
              id,
              firstName,
          },
          subscribedToUser {
              id,
              firstName,
          },
      },
    }
}
```
---
## Mutation examples:
### 2.8. Create user.
```json
{
  "payload": {
    "firstName": "444",
    "lastName": "444",
    "email": "444"
  }
}
```
```graphql
mutation($payload: UserCreateInputType) {
    createUser(payload: $payload) {
        id,
        firstName,
        email,
    }
}
```
---
### 2.9. Create profile.

```json
{
  "payload": {
    "avatar": "",
    "sex": "f",
    "birthday": 100,
    "country": "asfa",
    "street": "",
    "city": "zsadfsdf",
    "memberTypeId": "basic",
    "userId": "dc8281b7-26ab-4616-b724-10da7b93b64c"
  }
}
```
```graphql
mutation ($payload: ProfileCreateInputType){
    createProfile(payload: $payload) {
        id,
        userId,
        memberTypeId,
    }
}
```
---
### 2.10. Create post.

```json
{
  "payload": {
    "title": "777",
    "content": "dgfjsfg",
    "userId": "add0ece3-74ca-477c-8e02-21aa7be0aba5"
  }
}
```
```graphql
mutation($payload: PostCreateInputType) {
    createPost(payload: $payload) {
        id,
        userId,
        content,
    }
}
```
---
### 2.11. InputObjectType for DTOs.

[link to types](./src/routes/graphql/types/inputTypes.ts)

---
### 2.12. Update user.

```json
{
  "payload": {
    "id": "f3bcd21e-de39-44be-8d1f-37e4fecb1943",
    "firstName": "vasia"
  }
}
```
```graphql
mutation($payload: UserUpdateInputType) {
    updateUser(payload: $payload) {
        id,
        firstName,
    }
}
```
---
### 2.13. Update profile.

```json
{
  "payload": {
    "id": "c35b4768-148a-4dfc-aaff-89887da786cb",
    "country": "USA"
  }
}
```
```graphql
mutation($payload: ProfileUpdateInputType) {
    updateProfile(payload: $payload) {
        id,
        country,
    }
}
```
---
### 2.14. Update post.

```json
{
  "payload": {
    "id": "746dcf4b-32f7-44b8-a76b-ea4f42323e05",
    "title": "test title"
  }
}
```
```graphql
mutation($payload: PostUpdateInputType) {
    updatePost(payload: $payload) {
        id,
        title,
    }
}
```
---
### 2.15. Update memberType.

```json
{
  "payload": {
    "id": "basic",
    "discount": 30
  }
}
```
```graphql
mutation($payload: MemberTypeUpdateInputType) {
    updateMemberType(payload: $payload) {
        id,
        discount,
    }
}
```
---
### 2.16.1 Unsubscribe from.
<code style="color: orange">response entity: the user that the current user was subscribed to</code>
```json
{
    "currentUser": "f3bcd21e-de39-44be-8d1f-37e4fecb1943",
    "userId": "add0ece3-74ca-477c-8e02-21aa7be0aba5"
}
```
```graphql
mutation($currentUser: ID, $userId: ID) {
    userUnsubscribeFrom(id: $currentUser, userId: $userId) {
        id,
        subscribedToUserIds,
    }
}
```
---
---
### 2.16.2 Subscribe to.
<code style="color: orange">response entity: the user that the current user has just subscribed</code>
```json
{
    "currentUser": "f3bcd21e-de39-44be-8d1f-37e4fecb1943",
    "userId": "add0ece3-74ca-477c-8e02-21aa7be0aba5"
}
```
```graphql
mutation($currentUser: ID, $userId: ID) {
    userSubscribeTo(id: $currentUser, userId: $userId) {
        id,
        subscribedToUserIds,
    }
}
```
---
### 2.17. InputObjectType for DTOs.

[link to types](./src/routes/graphql/types/inputTypes.ts)

---
### 3. Solve n+1 graphql problem with dataloader package in all places where it should be used.
[code here (line 30)](./src/routes/graphql/index.ts) and 
[useDataLoader here (line 61-63)](./src/routes/graphql/types/userDataType.ts)

Count and type of queries you can check using console
(there are messages like `` DB request findMany of DBProfiles``)

UseDataLoader was used to optimize DB queries. For example, send the following request:
```graphql
query {
    users {
        profile {
            id
        }
    }
}
```

You can see only 2 db requests:

``
DB request findMany of DBUsers
``

``
DB request findMany of DBProfiles
``

Without dataLoader:

````ts
    profile: {
      type: profileType,
      resolve: async ({ id }, _, { fastify }) =>
        await fastify.db.profiles.findOne({ key: "userId", equals: id }),
    }
````

``
DB request findMany of DBUsers
``

``
DB request findOne of DBProfiles
`` x 3 (depends on count of users)

---
### 4. Limit the complexity of the graphql queries by their depth with graphql-depth-limit package.
[code here (line 21-25)](./src/routes/graphql/index.ts)

For current example: ``DEPTH_LIMIT_VALUE = 3;``

You can check depth limit error with gql request:

```graphql
query {
    users {
        subscribedToUser {
            subscribedToUser {
                subscribedToUser {
                    firstName
                },
            },
        },
    }
}
```

Expected error:

```json
{
"errors": "Error: exceeds maximum operation depth of 3"
}
```