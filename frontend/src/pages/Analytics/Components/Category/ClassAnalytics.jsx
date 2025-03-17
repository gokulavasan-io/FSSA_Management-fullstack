import React,{useState,useEffect} from "react";
import Chart from "../Chart/BarChart";
import {useMainContext} from '../../../../Context/MainContext'
import {fetchSubjectReport} from '../../../../api/homeAPI'
import { sectionColors } from "../../../../constants/colors";

const ClassAnalytics = () => {
    const {subjects}=useMainContext()
    const [months,setMonths]=useState([])
    const [data, setData] = useState({})
    useEffect(() => {
      if(subjects.length==0) return
        (async ()=>{
            let response=await fetchSubjectReport(4,subjects.map(sub=>sub.id))
            setMonths(response.months)
            console.log(response);
            
            setData(transformSubjectData(response.SubjectsData))
        })()
    }, [subjects])

      const transformSubjectData = (subjectsData) => {
        let transformedData = {};
        Object.keys(subjectsData).forEach((subject) => {
          transformedData[subject] = Object.keys(subjectsData[subject]).map((section) => ({
            name: section=="All"?"All":`Class ${section}`,
            data: subjectsData[subject][section],
            color: sectionColors[section] || "#000",
          }));
        });
      
        return transformedData;
      };
    

  return (
   <>
      {subjects.map(subject=> <Chart title={subject.subject_name} key={subject.id}  data={data[subject.subject_name]} months={months}  />)}
    </>
  );
};

export default ClassAnalytics;
