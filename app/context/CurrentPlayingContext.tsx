'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Video = {
    userId: string;
    title: string;
    thumbnail: string;
    url: string;
    extractedID: string;
};

type CurrentVideoContextType = {
    current: Video | null;
    setCurrent: React.Dispatch<React.SetStateAction<Video | null>>;
};

const CurrentlyPlaying = createContext<CurrentVideoContextType | undefined>(undefined);

export const CurrentlyPlayingProvider = ({ children }: { children: ReactNode }) => {
    const [current, setCurrent] = useState<Video | null>(null);

    return (
        <CurrentlyPlaying.Provider value={{ current, setCurrent }}>
            {children}
        </CurrentlyPlaying.Provider>
    );
};

export const useCurrent = () => {
    const context = useContext(CurrentlyPlaying);
    if (!context) {
        throw new Error('useQueue must be used within a QueueProvider');
    }
    return context;
};
