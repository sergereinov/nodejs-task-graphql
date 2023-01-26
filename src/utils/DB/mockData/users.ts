import { UserEntity } from "../entities/DBUsers";

// Each user follows other users

const users: UserEntity[] = [
  {
    id: 'f3bcd21e-de39-44be-8d1f-37e4fecb1943',
    firstName: '111',
    lastName: '111',
    email: '111',
    subscribedToUserIds: [
      'add0ece3-74ca-477c-8e02-21aa7be0aba5',
      'dc8281b7-26ab-4616-b724-10da7b93b64c',
    ],
  },
  {
    id: 'add0ece3-74ca-477c-8e02-21aa7be0aba5',
    firstName: '222',
    lastName: '222',
    email: '222',
    subscribedToUserIds: [
      'f3bcd21e-de39-44be-8d1f-37e4fecb1943',
      'dc8281b7-26ab-4616-b724-10da7b93b64c',
    ],
  },
  {
    id: 'dc8281b7-26ab-4616-b724-10da7b93b64c',
    firstName: '333',
    lastName: '333',
    email: '333',
    subscribedToUserIds: [
      'f3bcd21e-de39-44be-8d1f-37e4fecb1943',
      'add0ece3-74ca-477c-8e02-21aa7be0aba5',
    ],
  },
];

export default users;