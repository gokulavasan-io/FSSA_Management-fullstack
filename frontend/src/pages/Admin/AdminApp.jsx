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
  const {categoryName,setSelectedSubject }=  useMainContext()  
  const categoryComponents = {
    Subject: SubjectTable,
    Student: StudentTable,
    Section: SectionTable,
    Member: Member,
    Batch: BatchTable,
    Role: RoleTable,
    Test: TestList,
    Holiday: HolidayTable,
  };

  const SelectedComponent = categoryComponents[categoryName] || null;

  return <>{SelectedComponent && <SelectedComponent />}</>;
}

export default AdminApp