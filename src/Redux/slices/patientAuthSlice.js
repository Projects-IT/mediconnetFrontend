import { createSlice,createAsyncThunk, isPending } from "@reduxjs/toolkit";
import axios from "axios";
export let patientAuthorThunk=createAsyncThunk('patientAuth',async({patientCredObj, apiUrl},thunkApi)=>{
    try {
       let res= await axios.post(`${apiUrl}/patient-api/login`,patientCredObj)
       if(res.data.message==="Login success"){
            // localStorage.setItem("token",res.data.token)
            console.log("login success");
       }else{
        return thunkApi.rejectWithValue(res.data.message)
       }
       console.log(res.data);
       return res.data
    } catch (error) {
            return thunkApi.rejectWithValue(error)
    }

})

export let patientAuthorslice=createSlice(
    {
        name:'patient_Auth',
        initialState:{
            isPending:false,
            isLogin:false,
            currentpatient:{},
            errOccurred:false,
            errMes:''

        },
        reducers:{
            resetSate:(state,action)=>{
            state.isPending=false
            state.isLogin=false
            state.currentpatient={}
            state.errOccurred=false
            state.errMes=''
        }
    },
        extraReducers:builder=>{
            builder
            .addCase(patientAuthorThunk.pending,(state,action)=>{
                state.isPending=true;
            })
            .addCase(patientAuthorThunk.fulfilled,(state,action)=>{
                state.isPending=false
                state.isLogin=true
                state.currentpatient=action.payload.patient
                state.errOccurred=false
                state.errMes=''
            })
            .addCase(patientAuthorThunk.rejected,(state,action)=>{
                state.isPending=false
                state.isLogin=false
                state.currentpatient={}
                state.errOccurred=true
                state.errMes=action.payload
            })
        }
    }
)
export default patientAuthorslice.reducer
export let {resetSate} =patientAuthorslice.actions