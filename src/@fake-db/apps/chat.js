import mock from '../mock'
/*eslint-disable */
const previousDay = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
const dayBeforePreviousDay = new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 2)

const data = {
  profileUser: {
    id: 11,
    avatar: '/src/assets/images/portrait/small/avatar-s-11.jpg',
    fullName: 'John Doe',
    role: 'admin',
    about:
      'Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.',
    status: 'online',
    settings: {
      isTwoStepAuthVerificationEnabled: true,
      isNotificationsOn: false
    }
  },
  contacts: [
    {
      id: 1,
      fullName: 'Felecia Rower',
      role: 'Frontend Developer',
      about: 'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',

      avatar: '/src/assets/images/portrait/small/avatar-s-10.jpg',
      status: 'offline'
    },
    {
      id: 2,
      fullName: 'Adalberto Granzin',
      role: 'UI/UX Designer',
      about:
        'Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.',
      avatar: '/src/assets/images/portrait/small/avatar-s-9.jpg',
      status: 'busy'
    },
    {
      id: 3,
      fullName: 'Adalberto Granzin',
      role: 'UI/UX Designer',
      about:
        'Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.',
      avatar: '/src/assets/images/portrait/small/avatar-s-8.jpg',
      status: 'busy'
    },
    {
      id: 4,
      fullName: 'Adalberto Granzin',
      role: 'UI/UX Designer',
      about:
        'Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.',
      avatar: '/src/assets/images/portrait/small/avatar-s-7.jpg',
      status: 'busy'
    },
    {
      id: 5,
      fullName: 'Adalberto Granzin',
      role: 'UI/UX Designer',
      about:
        'Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.',
      avatar: '/src/assets/images/portrait/small/avatar-s-6.jpg',
      status: 'busy'
    },
    {
      id: 6,
      fullName: 'Adalberto Granzin',
      role: 'UI/UX Designer',
      about:
        'Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.',
      avatar: '/src/assets/images/portrait/small/avatar-s-5.jpg',
      status: 'busy'
    },
    {
      id: 7,
      fullName: 'Adalberto Granzin',
      role: 'UI/UX Designer',
      about:
        'Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.',
      avatar: '/src/assets/images/portrait/small/avatar-s-4.jpg',
      status: 'busy'
    },
  ],
  chats: [
    {
      id: 1,
      userId: 1,
      name: 'Felecia Rower',
      avatar: '/src/assets/images/portrait/small/avatar-s-10.jpg',
      role: 'Frontend Developer',
      about: 'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
      isGroupChat: false,
      groupId: null,
      unseenMsgs: 0,
      chat: [
        {
          id: 11,
          avatar: '/src/assets/images/portrait/small/avatar-s-11.jpg',
          fullName: 'John Doe',
          role: 'admin',
          about: 'Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.',
          message: 'Hi',
          time: 'Mon Dec 10 2018 07:45:00 GMT+0000 (GMT)',
          senderId: 11
        },
        {
          id: 2,
          fullName: 'Adalberto Granzin',
          avatar: '/src/assets/images/portrait/small/avatar-s-9.jpg',
          role: 'UI/UX Designer',
          about: 'Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.',
          message: 'Hello. How can I help You?',
          time: 'Mon Dec 11 2018 07:45:15 GMT+0000 (GMT)',
          senderId: 2
        },
        {
          id: 11,
          avatar: '/src/assets/images/portrait/small/avatar-s-11.jpg',
          fullName: 'John Doe',
          role: 'admin',
          about: 'Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.',
          message: 'Can I get details of my last transaction I made last month?',
          time: 'Mon Dec 11 2018 07:46:10 GMT+0000 (GMT)',
          senderId: 11
        },
        {
          id: 2,
          fullName: 'Adalberto Granzin',
          avatar: '/src/assets/images/portrait/small/avatar-s-9.jpg',
          role: 'UI/UX Designer',
          about: 'Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.',
          message: 'We need to check if we can provide you such information.',
          time: 'Mon Dec 11 2018 07:45:15 GMT+0000 (GMT)',
          senderId: 2
        },
        {
          id: 2,
          fullName: 'Adalberto Granzin',
          avatar: '/src/assets/images/portrait/small/avatar-s-9.jpg',
          role: 'UI/UX Designer',
          about: 'Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.',
          message: 'I will inform you as I get update on this.',
          time: 'Mon Dec 11 2018 07:46:15 GMT+0000 (GMT)',
          senderId: 2
        },
        {
          id: 11,
          avatar: '/src/assets/images/portrait/small/avatar-s-11.jpg',
          fullName: 'John Doe',
          role: 'admin',
          about: 'Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.',
          message: 'If it takes long you can mail me at my mail address.',
          time: dayBeforePreviousDay,
          senderId: 11
        }
      ]
    },
    {
      id: 2,
      userId: 2,
      name: 'Adalberto Granzin',
      avatar: '/src/assets/images/portrait/small/avatar-s-9.jpg',
      role: 'UI/UX Designer',
      about: 'Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.',
      isGroupChat: false,
      groupId: null,
      unseenMsgs: 1,
      chat: [
        {
          id: 11,
          avatar: '/src/assets/images/portrait/small/avatar-s-11.jpg',
          fullName: 'John Doe',
          role: 'admin',
          about: 'Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.',
          message: "How can we help? We're here for you!",
          time: 'Mon Dec 10 2018 07:45:00 GMT+0000 (GMT)',
          senderId: 11
        },
        {
          id: 1,
          fullName: 'Felecia Rower',
          avatar: '/src/assets/images/portrait/small/avatar-s-10.jpg',
          role: 'Frontend Developer',
          about: 'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
          message: 'Hey John, I am looking for the best admin template. Could you please help me to find it out?',
          time: 'Mon Dec 10 2018 07:45:23 GMT+0000 (GMT)',
          senderId: 1
        },
        {
          id: 1,
          fullName: 'Felecia Rower',
          avatar: '/src/assets/images/portrait/small/avatar-s-10.jpg',
          role: 'Frontend Developer',
          about: 'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
          message: 'It should be Bootstrap 5 compatible.',
          time: 'Mon Dec 10 2018 07:45:55 GMT+0000 (GMT)',
          senderId: 1
        },
        {
          id: 11,
          avatar: '/src/assets/images/portrait/small/avatar-s-11.jpg',
          fullName: 'John Doe',
          role: 'admin',
          about: 'Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.',
          message: 'Absolutely!',
          time: 'Mon Dec 10 2018 07:46:00 GMT+0000 (GMT)',
          senderId: 11
        },
        {
          id: 11,
          avatar: '/src/assets/images/portrait/small/avatar-s-11.jpg',
          fullName: 'John Doe',
          role: 'admin',
          about: 'Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.',
          message: 'Modern admin is the responsive bootstrap 5 admin template.!',
          time: 'Mon Dec 10 2018 07:46:05 GMT+0000 (GMT)',
          senderId: 11
        },
        {
          id: 1,
          fullName: 'Felecia Rower',
          avatar: '/src/assets/images/portrait/small/avatar-s-10.jpg',
          role: 'Frontend Developer',
          about: 'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
          message: 'Looks clean and fresh UI.',
          time: 'Mon Dec 10 2018 07:46:23 GMT+0000 (GMT)',
          senderId: 1
        },
        {
          id: 1,
          fullName: 'Felecia Rower',
          avatar: '/src/assets/images/portrait/small/avatar-s-10.jpg',
          role: 'Frontend Developer',
          about: 'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
          message: "It's perfect for my next project.",
          time: 'Mon Dec 10 2018 07:46:33 GMT+0000 (GMT)',
          senderId: 1
        },
        {
          id: 1,
          fullName: 'Felecia Rower',
          avatar: '/src/assets/images/portrait/small/avatar-s-10.jpg',
          role: 'Frontend Developer',
          about: 'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
          message: 'How can I purchase it?',
          time: 'Mon Dec 10 2018 07:46:43 GMT+0000 (GMT)',
          senderId: 1
        },
        {
          id: 11,
          avatar: '/src/assets/images/portrait/small/avatar-s-11.jpg',
          fullName: 'John Doe',
          role: 'admin',
          about: 'Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.',
          message: 'Thanks, from ThemeForest.',
          time: 'Mon Dec 10 2018 07:46:53 GMT+0000 (GMT)',
          senderId: 11
        },
        {
          id: 1,
          fullName: 'Felecia Rower',
          avatar: '/src/assets/images/portrait/small/avatar-s-10.jpg',
          role: 'Frontend Developer',
          about: 'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
          message: 'I will purchase it for sure. 👍',
          time: previousDay,
          senderId: 1
        }
      ]
    },
    {
      id: 3,
      userId: null,
      name: 'Group Chat 1',
      avatar: '/src/assets/images/portrait/small/avatar-s-12.jpg',
      role: 'UI/UX Designer',
      about: 'Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.',
      isGroupChat: true,
      groupId: 3,
      unseenMsgs: 3,
      chat: [
        {
          id: 11,
          avatar: '/src/assets/images/portrait/small/avatar-s-11.jpg',
          fullName: 'John Doe',
          role: 'admin',
          about: 'Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.',
          message: "How can we help? We're here for you!",
          time: 'Mon Dec 10 2018 07:45:00 GMT+0000 (GMT)',
          senderId: 11
        },
        {
          id: 1,
          fullName: 'Felecia Rower',
          avatar: '/src/assets/images/portrait/small/avatar-s-10.jpg',
          role: 'Frontend Developer',
          about: 'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
          message: 'Hey John, I am looking for the best admin template. Could you please help me to find it out?',
          time: 'Mon Dec 10 2018 07:45:23 GMT+0000 (GMT)',
          senderId: 1
        },
        {
          id: 1,
          fullName: 'Felecia Rower',
          avatar: '/src/assets/images/portrait/small/avatar-s-10.jpg',
          role: 'Frontend Developer',
          about: 'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
          message: 'It should be Bootstrap 5 compatible.',
          time: 'Mon Dec 10 2018 07:45:55 GMT+0000 (GMT)',
          senderId: 1
        },
        {
          id: 11,
          avatar: '/src/assets/images/portrait/small/avatar-s-11.jpg',
          fullName: 'John Doe',
          role: 'admin',
          about: 'Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.',
          message: 'Absolutely!',
          time: 'Mon Dec 10 2018 07:46:00 GMT+0000 (GMT)',
          senderId: 11
        },
        {
          id: 11,
          avatar: '/src/assets/images/portrait/small/avatar-s-11.jpg',
          fullName: 'John Doe',
          role: 'admin',
          about: 'Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.',
          message: 'Modern admin is the responsive bootstrap 5 admin template.!',
          time: 'Mon Dec 10 2018 07:46:05 GMT+0000 (GMT)',
          senderId: 11
        },
        {
          id: 5,
          fullName: 'Adalberto Granzin',
          avatar: '/src/assets/images/portrait/small/avatar-s-6.jpg',
          role: 'UI/UX Designer',
          about: 'Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.',
          message: 'Looks clean and fresh UI.',
          time: 'Mon Dec 10 2018 07:46:23 GMT+0000 (GMT)',
          senderId: 5
        },
        {
          id: 6,
          fullName: 'Adalberto Granzin',
          avatar: '/src/assets/images/portrait/small/avatar-s-5.jpg',
          role: 'UI/UX Designer',
          about: 'Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.',
          message: "It's perfect for my next project.",
          time: 'Mon Dec 10 2018 07:46:33 GMT+0000 (GMT)',
          senderId: 6
        },
        {
          id: 1,
          fullName: 'Felecia Rower',
          avatar: '/src/assets/images/portrait/small/avatar-s-10.jpg',
          role: 'Frontend Developer',
          about: 'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
          message: 'How can I purchase it?',
          time: 'Mon Dec 10 2018 07:46:43 GMT+0000 (GMT)',
          senderId: 1
        },
        {
          id: 11,
          avatar: '/src/assets/images/portrait/small/avatar-s-11.jpg',
          fullName: 'John Doe',
          role: 'admin',
          about: 'Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.',
          message: 'Thanks, from ThemeForest.',
          time: 'Mon Dec 10 2018 07:46:53 GMT+0000 (GMT)',
          senderId: 11
        },
        {
          id: 3,
          fullName: 'Adalberto Granzin',
          avatar: '/src/assets/images/portrait/small/avatar-s-8.jpg',
          role: 'UI/UX Designer',
          about: 'Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.',
          message: 'I will purchase it for sure. 👍',
          time: previousDay,
          senderId: 3
        }
      ]
    }
  ]
}
/*eslint-enable */
// ------------------------------------------------
// GET: Return Chats Contacts and Contacts
// ------------------------------------------------
mock.onGet('/apps/chat/chats-and-contacts').reply(() => {
  const chatsContacts = data.chats.map(chat => {
    const contact = data.contacts.find(c => c.id === (chat.userId || chat.groupId))
    contact.chat = { id: chat.id, unseenMsgs: chat.unseenMsgs, lastMessage: chat.chat[chat.chat.length - 1], avatar: chat.avatar, name: chat.name, role: chat.role, about: chat.about, isGroupChat: chat.isGroupChat }
    contact.status = chat.isGroupChat ? '' : contact.status
    return contact
  })
  const profileUserData = {
    id: data.profileUser.id,
    avatar: data.profileUser.avatar,
    fullName: data.profileUser.fullName,
    status: data.profileUser.status
  }
  return [200, { chatsContacts, contacts: data.contacts, profileUser: profileUserData }]
})

// ------------------------------------------------
// GET: Return User Profile
// ------------------------------------------------
mock.onGet('/apps/chat/users/profile-user').reply(() => [200, data.profileUser])

// ------------------------------------------------
// GET: Return Single Chat
// ------------------------------------------------
mock.onGet('/apps/chat/get-chat').reply(config => {
  // Get event id from URL

  let userId = config.id

  //  Convert Id to number
  userId = Number(userId)

  const chat = data.chats.find(c => c.id === userId)
  if (chat) chat.unseenMsgs = 0
  const contact = data.contacts.find(c => c.id === userId)
  if (contact.chat) contact.chat.unseenMsgs = 0
  return [200, { chat, contact }]
})

// ------------------------------------------------
// POST: Add new chat message
// ------------------------------------------------
mock.onPost('/apps/chat/send-msg').reply(config => {
  // Get event from post data
  const { obj } = JSON.parse(config.data)

  let activeChat = data.chats.find(chat => (chat.userId || chat.groupId) === obj.contact.id)

  const newMessageData = {
    id: 11,
    avatar: '/src/assets/images/portrait/small/avatar-s-11.jpg',
    fullName: 'John Doe',
    message: obj.message,
    time: new Date(),
    senderId: 11
  }
  // If there's new chat for user create one
  let isNewChat = false
  if (activeChat === undefined) {
    isNewChat = true

    // const lastId = data.chats[length - 1].id

    data.chats.push({
      id: obj.contact.id,
      userId: obj?.chat?.isGroupChat ? null : obj.contact.id,
      name: obj?.chat?.fullName,
      avatar: obj?.chat?.avatar,
      isGroupChat: obj?.chat?.isGroupChat,
      groupId: obj?.chat?.isGroupChat ? obj.contact.id : null,
      unseenMsgs: 0,
      chat: [newMessageData]
    })
    activeChat = data.chats[data.chats.length - 1]
  } else {
    activeChat.chat.push(newMessageData)
  }

  const response = { newMessageData, id: obj.contact.id }
  if (isNewChat) response.chat = activeChat

  return [201, { response }]
})
