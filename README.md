# nodejs-remote-control

Educational project for rs.school (NodeJS)

## Task #4

Implement Graphql backend.

Assignments: [Graphql](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/graphql-service/assignment.md)

[Scoring](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/graphql-service/score.md)

Time limits: start `2023-01-24 03:00` end `2023-01-31 03:00` (UTC+3)

## Installation

Prerequisites:
* nodejs 18 LTS
* git

How to install:
1. Clone the repo `git clone https://github.com/sergereinov/nodejs-task-graphql.git`
2. Switch to dev branch with `git checkout development`
3. Install dependencies with `npm install`

## Subtasks

Cross-check sequence is as follows.

### 1. Restful endpoints & tests
Tests can be used to test all required rest endpoints.
If the original command `npm run test` fails due to a timeout, then you can use the command without time limit `npm run test:timeless`.

### 2. Graphql logic
There is a collection of postman scripts `RSS-GraphQL.postman_collection.json` to simplify the verification of all the subtasks pinned below.

And there is a helper GQL mutation `createStub`, which creates several entities of each type in the database.

<details>
<summary>createStub syntax</summary>
<br/>

`createStub` creates:
 - three users
 - (1,2) subscribes to (3)
 - three profiles
 - two posts per user
 
Schema:
```graphql
type Mutation {
    createStub(seed: String): [User]
}
```
Where `seed` is a parameter that allows you to vary the resulting data.

</details>

<details>
<summary>Full gql schema</summary>

```graphql
type User {
  id: ID!
  firstName: String
  lastName: String
  email: String
  subscribedToUser: [User]
  userSubscribedTo: [User]
  posts: [Post]
  profile: Profile
  memberType: MemberType  
}

type Post {
  id: ID!
  title: String
  content: String
  user: User!
}

type Profile {
  id: ID!
  avatar: String
  sex: String
  birthday: Int
  country: String
  street: String
  city: String
  memberType: MemberType
  user: User
}

type MemberType {
  id: String
  discount: Int
  monthPostsLimit: Int
}

type Query {
  users: [User]
  user(id: ID!): User
  posts: [Post]
  post(id: ID!): Post
  profiles: [Profile]
  profile(id: ID!): Profile
  memberTypes: [MemberType]
  memberType(id: String): MemberType
}

input UserInput {
  firstName: String
  lastName: String
  email: String
}

input ProfileInput {
  avatar: String
  sex: String
  birthday: Int
  country: String
  street: String
  city: String
  memberTypeId: String
  userId: ID!
}

input ProfileUpdateInput {
  avatar: String
  sex: String
  birthday: Int
  country: String
  street: String
  city: String
  memberTypeId: String
}

input PostInput {
  title: String
  content: String
  userId: String
}

input PostUpdateInput {
  title: String
  content: String
}

input MemberTypeUpdateInput {
  discount: Int
  monthPostsLimit: Int
}

type Mutation {
  createStub(seed: String): [User]
  createUser(input: UserInput): User
  createProfile(input: ProfileInput): Profile
  createPost(input: PostInput): Post
  updateUser(userId: ID!, input: UserInput): User
  updateProfile(profileId: ID!, input: ProfileUpdateInput): Profile
  updatePost(postId: ID!, input: PostUpdateInput): Post
  updateMemberType(memberTypeId: String, input: MemberTypeUpdateInput): MemberType
  subscribeTo(userId: ID!, subscribesToUserId: ID!): User
  unsubscribeFrom(userId: ID!, unsubscribesFromUserId: ID!): User
}

schema {
  query: Query
  mutation: Mutation
}
```
</details>

#### Get gql requests:

<details>
<summary>2.1. Get users, profiles, posts, memberTypes - 4 operations in one query.</summary>

GraphQL query:
```graphql
query {
    users { id }
    profiles { id }
    posts { id }
    memberTypes { id }
}
```
Should return something like
```json
{
    "data": {
        "users": [
            {
                "id": "acaf3397-a92a-412d-93e5-9f9fd9c7bf82"
            },
            {
                "id": "412b6be0-4e40-4107-8355-21ce859496a2"
            },
            {
                "id": "dce72b67-a034-47ee-b77e-cd901b5b1e21"
            }
        ],
        "profiles": [
            {
                "id": "e2ba912b-6f7a-4d8d-8276-58a7acf495ef"
            },
            {
                "id": "1e85213f-f5f7-4769-a46f-d8638a190426"
            },
            {
                "id": "18967ee5-39a9-4f8f-82f3-b234f8573775"
            }
        ],
        "posts": [
            {
                "id": "9f66c088-52c2-44ba-8579-6083c1e9284a"
            },
            {
                "id": "cea210bd-3444-4ffa-b08d-5f06ec5c463a"
            },
            {
                "id": "25a27a2c-c811-4129-9098-cd01927eeff8"
            },
            {
                "id": "6a5ff634-3f82-4057-8818-fd36b346cb27"
            },
            {
                "id": "fbf2c3c2-9dd3-467c-8228-bbaca22c0008"
            },
            {
                "id": "2afbdded-a052-469f-b8ab-642efdb565a2"
            }
        ],
        "memberTypes": [
            {
                "id": "basic"
            },
            {
                "id": "business"
            }
        ]
    }
}
```
</details>


<details><summary>2.2. Get user, profile, post, memberType by id - 4 operations in one query.</summary>

GraphQL query:
```graphql
query (
    $userId: ID!,
    $profileId: ID!,
    $postId: ID!,
    $memberTypeId: String
){
    user(id:$userId) {id}
    profile(id:$profileId) {id}
    post(id:$postId) {id}
    memberType(id:$memberTypeId) {id}
}
```
GraphQL variables:
```json
{
    "userId":"acaf3397-a92a-412d-93e5-9f9fd9c7bf82",
    "profileId":"e2ba912b-6f7a-4d8d-8276-58a7acf495ef",
    "postId": "9f66c088-52c2-44ba-8579-6083c1e9284a",
    "memberTypeId": "basic"
}
```
Returns
```json
{
    "data": {
        "user": {
            "id": "acaf3397-a92a-412d-93e5-9f9fd9c7bf82"
        },
        "profile": {
            "id": "e2ba912b-6f7a-4d8d-8276-58a7acf495ef"
        },
        "post": {
            "id": "9f66c088-52c2-44ba-8579-6083c1e9284a"
        },
        "memberType": {
            "id": "basic"
        }
    }
}
```
</details>

<details><summary>2.3. Get users with their posts, profiles, memberTypes.</summary>

GraphQL query:
```graphql
query {
    users {
        posts {id}
        profile {id}
        memberType {id}
    }
}
```
Returns something like
```json
{
    "data": {
        "users": [
            {
                "posts": [
                    {
                        "id": "9f66c088-52c2-44ba-8579-6083c1e9284a"
                    },
                    {
                        "id": "cea210bd-3444-4ffa-b08d-5f06ec5c463a"
                    }
                ],
                "profile": {
                    "id": "e2ba912b-6f7a-4d8d-8276-58a7acf495ef"
                },
                "memberType": {
                    "id": "basic"
                }
            },
            {
                "posts": [
                    {
                        "id": "25a27a2c-c811-4129-9098-cd01927eeff8"
                    },
                    {
                        "id": "6a5ff634-3f82-4057-8818-fd36b346cb27"
                    }
                ],
                "profile": {
                    "id": "1e85213f-f5f7-4769-a46f-d8638a190426"
                },
                "memberType": {
                    "id": "basic"
                }
            },
            {
                "posts": [
                    {
                        "id": "fbf2c3c2-9dd3-467c-8228-bbaca22c0008"
                    },
                    {
                        "id": "2afbdded-a052-469f-b8ab-642efdb565a2"
                    }
                ],
                "profile": {
                    "id": "18967ee5-39a9-4f8f-82f3-b234f8573775"
                },
                "memberType": {
                    "id": "business"
                }
            }
        ]
    }
}
```
</details>

<details><summary>2.4. Get user by id with his posts, profile, memberType.</summary>

GraphQL query:
```graphql
query($userId:ID!) {
    user(id:$userId) {
        posts{id}
        profile{id}
        memberType{id}
    }
}
```
GraphQL variables:
```json
{
    "userId": "acaf3397-a92a-412d-93e5-9f9fd9c7bf82"
}
```
Returns
```json
{
    "data": {
        "user": {
            "posts": [
                {
                    "id": "9f66c088-52c2-44ba-8579-6083c1e9284a"
                },
                {
                    "id": "cea210bd-3444-4ffa-b08d-5f06ec5c463a"
                }
            ],
            "profile": {
                "id": "e2ba912b-6f7a-4d8d-8276-58a7acf495ef"
            },
            "memberType": {
                "id": "basic"
            }
        }
    }
}
```
</details>

<details><summary>2.5. Get users with their userSubscribedTo, profile.</summary>

GraphQL query:
```graphql
query {
    users {
        id
        userSubscribedTo {
            id
            profile {id}
        }
    }
}
```
Returns
```json
{
    "data": {
        "users": [
            {
                "id": "acaf3397-a92a-412d-93e5-9f9fd9c7bf82",
                "userSubscribedTo": [
                    {
                        "id": "dce72b67-a034-47ee-b77e-cd901b5b1e21",
                        "profile": {
                            "id": "18967ee5-39a9-4f8f-82f3-b234f8573775"
                        }
                    }
                ]
            },
            {
                "id": "412b6be0-4e40-4107-8355-21ce859496a2",
                "userSubscribedTo": [
                    {
                        "id": "dce72b67-a034-47ee-b77e-cd901b5b1e21",
                        "profile": {
                            "id": "18967ee5-39a9-4f8f-82f3-b234f8573775"
                        }
                    }
                ]
            },
            {
                "id": "dce72b67-a034-47ee-b77e-cd901b5b1e21",
                "userSubscribedTo": []
            }
        ]
    }
}
```
</details>

<details><summary>2.6. Get user by id with his subscribedToUser, posts.</summary>

GraphQL query:
```graphql
query($userId:ID!) {
    user(id:$userId) {
        id
        subscribedToUser {
            id
            posts {id}
        }
    }
}
```
GraphQL variables:
```json
{
    "userId": "dce72b67-a034-47ee-b77e-cd901b5b1e21"
}
```
Returns
```json
{
    "data": {
        "user": {
            "id": "dce72b67-a034-47ee-b77e-cd901b5b1e21",
            "subscribedToUser": [
                {
                    "id": "acaf3397-a92a-412d-93e5-9f9fd9c7bf82",
                    "posts": [
                        {
                            "id": "9f66c088-52c2-44ba-8579-6083c1e9284a"
                        },
                        {
                            "id": "cea210bd-3444-4ffa-b08d-5f06ec5c463a"
                        }
                    ]
                },
                {
                    "id": "412b6be0-4e40-4107-8355-21ce859496a2",
                    "posts": [
                        {
                            "id": "25a27a2c-c811-4129-9098-cd01927eeff8"
                        },
                        {
                            "id": "6a5ff634-3f82-4057-8818-fd36b346cb27"
                        }
                    ]
                }
            ]
        }
    }
}
```
</details>

<details><summary>2.7. Get users with their userSubscribedTo, subscribedToUser (additionally for each user in userSubscribedTo, subscribedToUser add their userSubscribedTo, subscribedToUser).</summary>

GraphQL query:
```graphql
query {
    users {
        id
        userSubscribedTo {
            id
            userSubscribedTo {
                id
            }
            subscribedToUser {
                id
            }
        }
        subscribedToUser {
            id
            userSubscribedTo {
                id
            }
            subscribedToUser {
                id
            }
        }
    }
}
```
Returns
```json
{
    "data": {
        "users": [
            {
                "id": "51eda44f-2aa4-47d3-a1a7-1e569942ed29",
                "userSubscribedTo": [
                    {
                        "id": "128ad5a6-c262-4e62-aec8-ebba1eb60cb8",
                        "userSubscribedTo": [],
                        "subscribedToUser": [
                            {
                                "id": "51eda44f-2aa4-47d3-a1a7-1e569942ed29"
                            },
                            {
                                "id": "2b5ee614-9348-410a-ba92-439dc42ffff3"
                            }
                        ]
                    }
                ],
                "subscribedToUser": []
            },
            {
                "id": "2b5ee614-9348-410a-ba92-439dc42ffff3",
                "userSubscribedTo": [
                    {
                        "id": "128ad5a6-c262-4e62-aec8-ebba1eb60cb8",
                        "userSubscribedTo": [],
                        "subscribedToUser": [
                            {
                                "id": "51eda44f-2aa4-47d3-a1a7-1e569942ed29"
                            },
                            {
                                "id": "2b5ee614-9348-410a-ba92-439dc42ffff3"
                            }
                        ]
                    }
                ],
                "subscribedToUser": []
            },
            {
                "id": "128ad5a6-c262-4e62-aec8-ebba1eb60cb8",
                "userSubscribedTo": [],
                "subscribedToUser": [
                    {
                        "id": "51eda44f-2aa4-47d3-a1a7-1e569942ed29",
                        "userSubscribedTo": [
                            {
                                "id": "128ad5a6-c262-4e62-aec8-ebba1eb60cb8"
                            }
                        ],
                        "subscribedToUser": []
                    },
                    {
                        "id": "2b5ee614-9348-410a-ba92-439dc42ffff3",
                        "userSubscribedTo": [
                            {
                                "id": "128ad5a6-c262-4e62-aec8-ebba1eb60cb8"
                            }
                        ],
                        "subscribedToUser": []
                    }
                ]
            }
        ]
    }
}
```
</details>

#### Create gql requests:

<details><summary>2.8. Create user.</summary>

GraphQL query:
```graphql
mutation($input: UserInput) {
    createUser(input:$input) {
        id
        firstName
    }
}
```
GraphQL variables:
```json
{
    "input": {
        "firstName": "username1",
        "lastName": "last",
        "email": "a@a.no"
    }
}
```
Returns
```json
{
    "data": {
        "createUser": {
            "id": "9b883e1e-46ed-4af3-bd9c-512a10070dcb",
            "firstName": "username1"
        }
    }
}
```
</details>

<details><summary>2.9. Create profile.</summary>

GraphQL query:
```graphql
mutation($input: ProfileInput) {
    createProfile(input:$input) {
        id
        avatar
    }
}
```
GraphQL variables:
```json
{
    "input": {
        "avatar": "ava-url",
        "sex": "my gender",
        "birthday": 2,
        "country": "nowhere",
        "street": "secret",
        "city": "lost",
        "memberTypeId": "basic",
        "userId": "88471ab8-2a26-4f25-ac2d-85a946fede4c"
    }
}
```
Returns
```json
{
    "data": {
        "createProfile": {
            "id": "f29fe063-6b6b-4d65-b961-42edc2c1eb96",
            "avatar": "ava-url"
        }
    }
}
```
</details>

<details><summary>2.10. Create post.</summary>

GraphQL query:
```graphql
mutation($input:PostInput) {
    createPost(input:$input) {
        id
        title
    }
}
```
GraphQL variables:
```json
{
    "input": {
        "title": "the title",
        "content": "content with title",
        "userId": "88471ab8-2a26-4f25-ac2d-85a946fede4c"
    }
}
```
Returns
```json
{
    "data": {
        "createPost": {
            "id": "968961be-6cb4-410e-a500-89347131ff6c",
            "title": "the title"
        }
    }
}
```
</details>

<details><summary>2.11. InputObjectType for DTOs.</summary>

Didn't figure out what is it about.
The schema has input types corresponding to DTOs.
</details>

#### Update gql requests:

<details><summary>2.12. Update user.</summary>

GraphQL query:
```graphql
mutation(
    $userId: ID!,
    $input: UserInput
) {
    updateUser(
        userId: $userId,
        input: $input
    ) {
        id
        firstName
    }
}
```
GraphQL variables:
```json
{
    "userId": "9b883e1e-46ed-4af3-bd9c-512a10070dcb",
    "input": {
        "firstName": "new name",
        "lastName": "new last",
        "email": "other@a.no"
    }
}
```
Returns
```json
{
    "data": {
        "updateUser": {
            "id": "9b883e1e-46ed-4af3-bd9c-512a10070dcb",
            "firstName": "new name"
        }
    }
}
```
</details>

<details><summary>2.13. Update profile.</summary>

GraphQL query:
```graphql
mutation(
    $profileId: ID!,
    $input: ProfileUpdateInput
) {
    updateProfile(
        profileId: $profileId,
        input: $input
    ) {
        id
        avatar
    }
}
```
GraphQL variables:
```json
{
    "profileId": "f29fe063-6b6b-4d65-b961-42edc2c1eb96",
    "input": {
        "avatar": "new-ava-url",
        "sex": "new gender",
        "birthday": 3,
        "country": "reloc",
        "street": "dunno",
        "city": "big",
        "memberTypeId": "basic"
    }
}
```
Returns
```json
{
    "data": {
        "updateProfile": {
            "id": "f29fe063-6b6b-4d65-b961-42edc2c1eb96",
            "avatar": "new-ava-url"
        }
    }
}
```
</details>

<details><summary>2.14. Update post.</summary>

GraphQL query:
```graphql
mutation(
    $postId: ID!,
    $input: PostUpdateInput
) {
    updatePost(
        postId: $postId,
        input: $input
    ) {
        id
        title
    }
}
```
GraphQL variables:
```json
{
    "postId": "968961be-6cb4-410e-a500-89347131ff6c",
    "input": {
        "title": "new title",
        "content": "more content"
    }
}
```
Returns
```json
{
    "data": {
        "updatePost": {
            "id": "968961be-6cb4-410e-a500-89347131ff6c",
            "title": "new title"
        }
    }
}
```
</details>

<details><summary>2.15. Update memberType.</summary>

GraphQL query:
```graphql
mutation(
    $memberTypeId: String,
    $input: MemberTypeUpdateInput
) {
    updateMemberType(
        memberTypeId: $memberTypeId,
        input: $input
    ) {
        id
        discount
    }
}
```
GraphQL variables:
```json
{
    "memberTypeId": "basic",
    "input": {
        "discount": 75,
        "monthPostsLimit": 999
    }
}
```
Returns
```json
{
    "data": {
        "updateMemberType": {
            "id": "basic",
            "discount": 75
        }
    }
}
```
</details>

<details><summary>2.16.a. Subscribe to</summary>

GraphQL query:
```graphql
mutation(
    $userId: ID!
    $subscribesToUserId: ID!
) {
    subscribeTo(
        userId: $userId,
        subscribesToUserId: $subscribesToUserId
    ) {
        id
        subscribedToUser {
            id
        }
        userSubscribedTo {
            id
        }
    }
}
```
GraphQL variables:
```json
{
    "userId": "9b883e1e-46ed-4af3-bd9c-512a10070dcb",
    "subscribesToUserId": "7ba67d95-f3aa-4a02-a550-dd7d28d21313"
}
```
Returns
```json
{
    "data": {
        "subscribeTo": {
            "id": "9b883e1e-46ed-4af3-bd9c-512a10070dcb",
            "subscribedToUser": [],
            "userSubscribedTo": [
                {
                    "id": "7ba67d95-f3aa-4a02-a550-dd7d28d21313"
                }
            ]
        }
    }
}
```
</details>

<details><summary>2.16.b. Unsubscribe from.</summary>

GraphQL query:
```graphql
mutation(
    $userId: ID!
    $unsubscribesFromUserId: ID!
) {
    unsubscribeFrom(
        userId: $userId,
        unsubscribesFromUserId: $unsubscribesFromUserId
    ) {
        id
        subscribedToUser {
            id
        }
        userSubscribedTo {
            id
        }
    }
}
```
GraphQL variables:
```json
{
    "userId": "9b883e1e-46ed-4af3-bd9c-512a10070dcb",
    "unsubscribesFromUserId": "7ba67d95-f3aa-4a02-a550-dd7d28d21313"
}
```
Returns
```json
{
    "data": {
        "unsubscribeFrom": {
            "id": "9b883e1e-46ed-4af3-bd9c-512a10070dcb",
            "subscribedToUser": [],
            "userSubscribedTo": []
        }
    }
}
```
</details>

<details><summary>2.17. InputObjectType for DTOs.</summary>

Didn't figure out what is it about.
The schema has input types corresponding to DTOs.

</details>

### 3. Solve n+1 graphql problem
skipped

### 4. Limit the complexity of the graphql queries

Link to the line of code where it was used: [/src/routes/graphql/index.ts#L27](https://github.com/sergereinov/nodejs-task-graphql/blob/573cd9ba286bdca7321b4720f7b8f1c5fa916473/src/routes/graphql/index.ts#L27)

<details><summary>Specify a POST body of gql query that ends with an error</summary>

GraphQL query:
```graphql
query {
    users {
        profile {
            user {
                profile {
                    user {
                        id
                    }
                }
            }
        }
    }
}
```
Returns
```json
[
    {
        "message": "'' exceeds maximum operation depth of 4",
        "locations": [
            {
                "line": 7,
                "column": 25
            }
        ]
    }
]
```
</details>
