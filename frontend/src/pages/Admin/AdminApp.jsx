import React,{useEffect} from 'react'
import SectionTable from './Components/Section/Section'
import Member from './Components/Member/Member'
import BatchTable from './Components/Batch/Batch'
import RoleTable from './Components/Member/Role'
import TestList from './Components/Test/Test'
import HolidayTable from './Components/Holiday/Holiday'
import StudentTable from './Components/Student/Student';
import { useMainContext } from '../../Context/MainContext';
import SubjectTable from './Components/Test/Subject'

function AdminApp() {
  const {setSelectedSubject,categoryName }=  useMainContext()
  useEffect(() => {
    setSelectedSubject({ id: null, subject_name: "Admin" });
  }, []);


  useMainContext()
  return (
   <>
   {categoryName=="Subject"&& <SubjectTable /> }
   {categoryName=="Student" && <StudentTable />}
    { categoryName=="Section" &&<SectionTable />}
    { categoryName=="Member" &&<Member />}
    { categoryName=="Batch" &&<BatchTable />}
    { categoryName=="Role" &&<RoleTable />}
    { categoryName=="Test" &&<TestList />}
    { categoryName=="Holiday" &&<HolidayTable />}
   </>

  )
}

export default AdminApp