import api from '../lib/api';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const VerifyEmail = () => {
    const {token} = useParams();
    const[status,setStatus]=useState("Verifying...")
    const navigate = useNavigate();

    const verifyEmail = async()=>{
        try {
            const res = await api.post('/user/verify',{},{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            if(res.data.success){
                setStatus('✔️Email Verified Sucessfully!');
                setTimeout(() => {
                    navigate('/login')
                }, 2000);
            }
        } catch (error) {
            console.log(error);
            setStatus("❌Verification Failed !.Please try again...")
        }
    }
    useEffect(()=>{
        verifyEmail()
    },[token])
  return (
    <div className='relative w-full h-[760px] bg-pink-100 overflow-hidden'>
      <div className='min-h-screen flex items-center justify-center'>
        <div className='bg-white rounded-2xl p-6 shadow-md text-center w-[90%] max-w-md'>
            <h2 className='text-xl fond-semibold text-gray-800'>{status}</h2>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
