'use client'

import {ReactNode, useRef} from 'react'
import {Provider} from 'react-redux'

import { EnhancedStore } from '@reduxjs/toolkit';
import { store } from '@/redux/store';

interface StoreProviderProps {
    children: ReactNode;
  }
export default function StoreProvider({children}:StoreProviderProps){
   

    return <Provider store={store}>{children}</Provider>

}