import { useStateProvider } from '@/context/StateContext';
import { reducerCases } from '@/context/constants';
import { GET_ALL_CONTACTS } from '@/utils/ApiRoutes';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BiArrowBack, BiSearchAlt2 } from 'react-icons/bi';
import ChatLIstItem from './ChatLIstItem';

function ContactsList() {
    const [allContacts, setAllContacts] = useState([]);
    const [{ contactsPage }, dispatch] = useStateProvider();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchedContacts, setSearchedContacts] = useState([]);

    useEffect(() => {
        if (searchTerm.length) {
            const filterData = {};
            Object.keys(allContacts).forEach((key) => {
                filterData[key] = allContacts[key].filter((obj) =>
                    obj.name
                        .toLowerCase()
                        .includes(searchTerm.toLocaleLowerCase())
                );
            });
            // const filterContacts = allContacts.filter((contact) =>
            //     contact.name.toLowerCase().includes(searchTerm.toLowerCase())
            // );
            setSearchedContacts(filterData);
        } else {
            setSearchedContacts(allContacts);
        }
    }, [searchTerm]);

    useEffect(() => {
        if (contactsPage) {
            const getContacts = async () => {
                try {
                    const {
                        data: { users },
                    } = await axios.get(GET_ALL_CONTACTS);
                    setAllContacts(users);
                    setSearchedContacts(users);
                } catch (error) {
                    console.log(error);
                }
            };
            getContacts();
        }
    }, [contactsPage]);
    return (
        <div className="h-full flex flex-col">
            <div className="h-24 flex items-end px-3 py-4">
                <div className="flex items-center gap-12 text-white">
                    <BiArrowBack
                        className="cursor-pointer text-xl"
                        onClick={() =>
                            dispatch({
                                type: reducerCases.SET_ALL_CONTACTS_PAGE,
                            })
                        }
                    />
                    <span>New Chat</span>
                </div>
            </div>
            <div className="bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar">
                <div className="flex py-3 items-center gap-3 h-14">
                    <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mx-4">
                        <div>
                            <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l" />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Search contacts"
                                className="bg-transparent text-sm focus:outline-none text-white w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                {Object.entries(searchedContacts).map(
                    ([initialLetter, userList]) => {
                        if (userList.length > 0)
                            return (
                                <div key={Date.now() + initialLetter}>
                                    <div className="text-teal-light pl-10 py-5">
                                        {initialLetter}
                                    </div>
                                    {userList.map((contact) => {
                                        return (
                                            <ChatLIstItem
                                                data={contact}
                                                isContactsPage={true}
                                                key={contact.id}
                                            />
                                        );
                                    })}
                                </div>
                            );
                    }
                )}
            </div>
        </div>
    );
}

export default ContactsList;
