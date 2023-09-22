import React, { useState } from 'react';
import Avatar from '../common/Avatar';
import { useStateProvider } from '@/context/StateContext';
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from 'react-icons/bs';
import { reducerCases } from '@/context/constants';
import ContextMenu from '../common/ContextMenu';
import { useRouter } from 'next/router';

function ChatListHeader() {
    const [{ userInfo }, dispatch] = useStateProvider();
    const router = useRouter();
    const [isContextMenuVisible, setisContextMenuVisible] = useState(false);
    const [contextMenuCordinates, setcontextMenuCordinates] = useState({
        x: 0,
        y: 0,
    });
    const showContextMenu = (e) => {
        e.preventDefault();

        setcontextMenuCordinates({ x: e.pageX - 50, y: e.pageY + 20 });
        setisContextMenuVisible(true);
    };

    const contextMenuOptions = [
        {
            name: 'Log out',
            callback: async () => {
                setisContextMenuVisible(false);
                router.push('/logout');
            },
        },
    ];

    const handleAllContactsPage = () => {
        dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE });
    };

    return (
        <div className="h-16 px-4 py-3 flex justify-between items-center">
            <div className="cursor-pointer">
                <Avatar type="sm" image={userInfo?.profileImage} />
            </div>
            <div className="flex gap-6">
                <BsFillChatLeftTextFill
                    className="text-panel-header-icon cursor-pointer text-xl"
                    title="New Chat"
                    onClick={handleAllContactsPage}
                />
                <>
                    <BsThreeDotsVertical
                        className="text-panel-header-icon cursor-pointer text-xl"
                        title="Menu"
                        id="context-opener"
                        onClick={showContextMenu}
                    />
                    {isContextMenuVisible && (
                        <ContextMenu
                            options={contextMenuOptions}
                            cordinates={contextMenuCordinates}
                            contextMenu={isContextMenuVisible}
                            setContextMenu={setisContextMenuVisible}
                        />
                    )}
                </>
            </div>
        </div>
    );
}

export default ChatListHeader;
