import React, { useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';

function CapturePhoto({ setImage, setshowCapturePhoto }) {
    const videoRef = useRef(null);

    useEffect(() => {
        let stream;
        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });

                // Check if videoRef exists before setting srcObject
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing camera:', error);
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    const capturePhoto = () => {
        if (videoRef.current && videoRef.current.readyState === 4) {
            const canvas = document.createElement('canvas');
            canvas.width = 300; // Set canvas width and height to desired dimensions
            canvas.height = 150;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            setImage(canvas.toDataURL('image/jpeg')); // Use 'jpeg' instead of 'jpg'
            setshowCapturePhoto(false);
        }
    };
    return (
        <div className="absolute h-4/6 w-2/6 top-1/4 left-1/3 bg-gray-900 gap-3 rounded-lg pt-2 flex justify-center items-center">
            <div className="flex flex-col gap-4 w-full justify-center items-center">
                <div
                    className="p-1 cursor-pointer flex items-center justify-end"
                    onClick={() => {
                        stream.getTracks().forEach((track) => track.stop());
                    }}
                >
                    <IoClose className="h-10 w-10 mr-2 cursor-pointer" />
                </div>
                <div className="flex justify-center">
                    <video
                        id="video"
                        width="400"
                        autoPlay
                        ref={videoRef}
                    ></video>
                </div>
                <button
                    className="h-16 w-16 bg-white rounded-full cursor-pointer border-8 border-teal-light p-2 mb-10"
                    onClick={capturePhoto}
                ></button>
            </div>
        </div>
    );
}

export default CapturePhoto;
