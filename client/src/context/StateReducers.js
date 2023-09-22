import { reducerCases } from './constants';

export const initialState = {
    // userInfo: {
    //     email: 'duylove931@gmail.com',
    //     id: '650ba6e900c427e8a246c45b',
    //     name: 'Duy Lê',
    //     profileImage: '/avatars/2.png',
    //     status: 'i am rich',
    // },
    userInfo: undefined,
    newUser: false,
    contactsPage: false,
    currentChatUser: undefined,
    messages: [],
    socket: undefined,
    messagesSearch: false,
    userContacts: [],
    onlineUsers: [],
    filterContacts: [],
    contactSearch: '',
};

const reducer = (state, action) => {
    switch (action.type) {
        case reducerCases.SET_USER_INFO: {
            // console.log({ userInfo: action.userInfo });
            return {
                ...state,
                userInfo: action.userInfo,
            };
        }
        case reducerCases.SET_NEW_USER:
            return {
                ...state,
                newUser: action.newUser,
            };
        case reducerCases.SET_ALL_CONTACTS_PAGE:
            return {
                ...state,
                contactsPage: !state.contactsPage,
            };
        case reducerCases.CHANGE_CURRENT_CHAT_USER:
            return {
                ...state,
                currentChatUser: action.user,
            };
        case reducerCases.SET_MESSAGES:
            return {
                ...state,
                messages: action.messages,
            };
        case reducerCases.SET_SOCKET:
            return {
                ...state,
                socket: action.socket,
            };
        case reducerCases.ADD_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, action.newMessage],
            };
        case reducerCases.SET_SEARCH_MESSAGE:
            return {
                ...state,
                messagesSearch: !state.messagesSearch,
            };
        case reducerCases.SET_USER_CONTACTS:
            // console.log(action.userContacts);

            return {
                ...state,
                userContacts: action.userContacts,
            };
        case reducerCases.SET_ONLINE_USERS:
            // console.log(action.onlineUsers);

            return {
                ...state,
                onlineUsers: action.onlineUsers,
            };
        case reducerCases.SET_CONTACT_SEARCH: {
            const filterContacts = state.userContacts.filter((contact) =>
                contact.name
                    .toLowerCase()
                    .includes(action.contactSearch.toLowerCase())
            );
            return {
                ...state,
                contactSearch: action.contactSearch,
                filterContacts,
            };
        }
        case reducerCases.SET_EXIT_CHAT:
            return {
                ...state,
                currentChatUser: undefined,
            };
        default:
            return state;
    }
};

export default reducer;
