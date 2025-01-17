'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Video = {
    upvotes: number;
    type: string;
    id: string;
    title: string;
    thumbnail: string;
    url: string;
    ExtractedID: string;
    active: boolean;
    userID: string;
    haveUpvoted: boolean;
};

type QueueContextType = {
    queue: Video[];
    setQueue: React.Dispatch<React.SetStateAction<Video[]>>;
};

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider = ({ children }: { children: ReactNode }) => {
    const [queue, setQueue] = useState<Video[]>([]);

    return (
        <QueueContext.Provider value={{ queue, setQueue }}>
            {children}
        </QueueContext.Provider>
    );
};

export const useQueue = () => {
    const context = useContext(QueueContext);
    if (!context) {
        throw new Error('useQueue must be used within a QueueProvider');
    }
    return context;
};
