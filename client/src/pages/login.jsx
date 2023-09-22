import { firebaseAuth } from '@/utils/FirebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { CHECK_USER_ROUTE } from '@/utils/ApiRoutes';
import { useRouter } from 'next/router';
import { useStateProvider } from '@/context/StateContext';
import { reducerCases } from '@/context/constants';
import Input from '@/components/common/Input';

function login() {
    const router = useRouter();

    const [{ userInfo, newUser }, dispatch] = useStateProvider();

    const [emailLogin, setEmailLogin] = useState('');

    useEffect(() => {
        if (userInfo?.id && !newUser) router.push('/');
    }, [userInfo, newUser]);

    const loginWithEmail = async () => {
        if (!emailLogin) return;
        const { data } = await axios.post(CHECK_USER_ROUTE, {
            email: emailLogin,
        });

        const {
            id,
            name,
            email,
            profilePicture: profileImage,
            about,
        } = data?.data;
        if (data.status) {
            dispatch({
                type: reducerCases.SET_NEW_USER,
                newUser: false,
            });
            dispatch({
                type: reducerCases.SET_USER_INFO,
                userInfo: {
                    id,
                    name,
                    email,
                    profileImage,
                    status: about,
                },
            });
            router.push('/');
        } else {
            alert('no have user');
        }
    };
    const handleLogin = async () => {
        const provider = new GoogleAuthProvider();
        const {
            user: { displayName: name, email, photoURL: profileImage },
        } = await signInWithPopup(firebaseAuth, provider);
        try {
            if (email) {
                const { data } = await axios.post(CHECK_USER_ROUTE, { email });
                if (!data.status) {
                    dispatch({
                        type: reducerCases.SET_NEW_USER,
                        newUser: true,
                    });
                    dispatch({
                        type: reducerCases.SET_USER_INFO,
                        userInfo: {
                            name,
                            email,
                            profileImage,
                            status: '',
                        },
                    });
                    router.push('/onboarding');
                } else {
                    const {
                        id,
                        name,
                        email,
                        profilePicture: profileImage,
                        about,
                    } = data.data;
                    dispatch({
                        type: reducerCases.SET_NEW_USER,
                        newUser: false,
                    });
                    dispatch({
                        type: reducerCases.SET_USER_INFO,
                        userInfo: {
                            id,
                            name,
                            email,
                            profileImage,
                            status: about,
                        },
                    });
                    router.push('/');
                }
            }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6">
            <div className="flex items-center justify-center gap-2 text-white">
                <Image
                    src="/whatsapp.gif"
                    alt="whatsapp"
                    height={300}
                    width={300}
                />
                <span className="text-7xl">Whatsapp</span>
            </div>
            <div className="flex flex-col items-center justify-center mt-5 gap-2">
                <Input
                    name="Email Login"
                    state={emailLogin}
                    setState={setEmailLogin}
                    label
                />
                <div className="flex items-center justify-center">
                    <button
                        className="flex items-center justify-center gap-7 bg-search-input-container-background text-white p-3 rounded-lg text-xl"
                        onClick={loginWithEmail}
                    >
                        Login with email
                    </button>
                </div>
            </div>
            <button
                className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg"
                onClick={handleLogin}
            >
                <FcGoogle />
                <span className="text-white text-2xl">Login with Google</span>
            </button>
        </div>
    );
}

export default login;
