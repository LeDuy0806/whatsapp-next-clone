import Image from 'next/image';
import React from 'react';

function Empty() {
    return (
        <div className="border-conversation-border border-l border-b-4 bg-panel-header-background border-b-icon-green w-full  flex flex-col items-center justify-center">
            <Image
                src="/whatsapp.gif"
                alt="whatsapp"
                height={300}
                width={300}
            />
        </div>
    );
}

export default Empty;
