import {configureStore} from '@reduxjs/toolkit'
import patientAuthorslice from './slices/patientAuthSlice'
export let Store=configureStore(
    {
        reducer:{
            patientAuthorLoginSlice:patientAuthorslice
        }
    }
)