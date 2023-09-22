import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import ContextMenu from './ContextMenu';
import PhotoPicker from './PhotoPicker';
import PhotoLibrary from './PhotoLibrary';
import CapturePhoto from './CapturePhoto';

function Avatar({ type, image, setImage }) {
    const [hover, setHover] = useState(false);
    const [isContextMenuVisible, setisContextMenuVisible] = useState(false);
    const [contextMenuCordinates, setcontextMenuCordinates] = useState({
        x: 0,
        y: 0,
    });
    const [grabPhoto, setGrabPhoto] = useState(false);
    const [showPhotoLibrary, setShowPhotoLibrary] = useState(false);
    const [showCapturePhoto, setshowCapturePhoto] = useState(false);

    const showContextMenu = (e) => {
        e.preventDefault();
        setHover(false);
        setisContextMenuVisible(true);
        setcontextMenuCordinates({ x: e.pageX, y: e.pageY });
    };

    const photoPickerChange = async (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        const data = document.createElement('img');
        reader.onload = function (e) {
            data.src = e.target.result;
            data.setAttribute('data-src', e.target.result);
        };
        reader.readAsDataURL(file);
        setTimeout(() => {
            console.log(data.src);

            setImage(data.src);
        }, 200);
    };

    useEffect(() => {
        if (grabPhoto) {
            const data = document.getElementById('photo-picker');
            data.click();
            document.body.onfocus = (e) => {
                setTimeout(() => {
                    setGrabPhoto(false);
                }, 1000);
            };
        }
    }, [grabPhoto]);

    const contextMenuOptions = [
        {
            name: 'Take Photo',
            callback: () => {
                setshowCapturePhoto(true);
            },
        },
        {
            name: 'Choose From Library',
            callback: () => {
                setShowPhotoLibrary(true);
            },
        },
        {
            name: 'Upload Proto',
            callback: () => {
                setGrabPhoto(true);
            },
        },
        {
            name: 'Remove Proto',
            callback: () => {
                setImage('/default_avatar.png');
            },
        },
    ];

    return (
        <>
            <div className="flex items-center justify-center">
                {type === 'sm' && (
                    <div className="relative h-10 w-10">
                        {image ? (
                            <Image
                                src={image}
                                alt="Avatar"
                                className="rounded-full"
                                fill
                            />
                        ) : (
                            <Image
                                src="/default_avatar.png"
                                alt="Avatar"
                                className="rounded-full"
                                fill
                            />
                        )}
                    </div>
                )}
                {type === 'lg' && (
                    <div className="relative h-14 w-14">
                        <Image
                            src={image}
                            alt="Avatar"
                            className="rounded-full"
                            fill
                        />
                    </div>
                )}
                {type === 'xl' && (
                    <div
                        className="relative cursor-pointer z-0"
                        onMouseLeave={() => setHover(false)}
                        onMouseEnter={() => setHover(true)}
                    >
                        <div
                            className={`z-10 bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 flex items-center rounded-full justify-center flex-col text-center gap-2
                          ${hover ? 'visible' : 'hidden'}
                        `}
                            onClick={(e) => showContextMenu(e)}
                            id="context-opener"
                        >
                            <FaCamera
                                className="text-2xl"
                                id="context-opener"
                                // onClick={(e) => showContextMenu(e)}
                            />

                            <span
                                // onClick={(e) => showContextMenu(e)}
                                id="context-opener"
                            >
                                Change Profile Photo
                            </span>
                        </div>
                        <div className="flex items-center justify-center h-60 w-60 relative">
                            <Image
                                src={image}
                                alt="Avatar"
                                className="rounded-full"
                                fill
                                style={{
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
            {isContextMenuVisible && (
                <ContextMenu
                    options={contextMenuOptions}
                    cordinates={contextMenuCordinates}
                    contextMenu={isContextMenuVisible}
                    setContextMenu={setisContextMenuVisible}
                />
            )}
            {showCapturePhoto && (
                <CapturePhoto
                    setImage={setImage}
                    setshowCapturePhoto={setshowCapturePhoto}
                />
            )}
            {showPhotoLibrary && (
                <PhotoLibrary
                    setImage={setImage}
                    setShowPhotoLibrary={setShowPhotoLibrary}
                />
            )}
            {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
        </>
    );
}

export default Avatar;
