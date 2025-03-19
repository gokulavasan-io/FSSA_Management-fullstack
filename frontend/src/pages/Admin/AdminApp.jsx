import React,{useEffect} from 'react'
import {useMainContext} from '../../Context/MainContext'
import AdminMain from './AdminMain';

function AdminApp() {

  const {setSelectedSubject,setCategoryName}=  useMainContext()
  useEffect(() => {
    setSelectedSubject({ id: null, subject_name: "Admin" });
  }, []);

  return (
    <AdminMain />
  )
}

export default AdminApp