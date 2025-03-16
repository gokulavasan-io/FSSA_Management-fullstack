import React,{useState,useEffect} from "react";
import Chart from "../Chart/Chart";
import {useMainContext} from '../../../../Context/MainContext'
import {fetchSubjectReport} from '../../../../api/homeAPI'

const ClassAnalytics = () => {
    const {subjects}=useMainContext()
    const [months,setMonths]=useState([])

    const [data, setData] = useState({})
    useEffect(() => {
        (async ()=>{
            let response=await fetchSubjectReport(4,subjects.map(sub=>sub.id))
            setMonths(response.months)
        })()
    }, [subjects])
    

  let series=[
    {
      name: "Series 1",
      data: [5,65,34,36,86,35],
      color: "#2DFF7E",
    },
    {
      name: "Series 2",
      data: [20,65,34,36,86,35],
      color: "#FFD600",
    },
    {
      name: "Series 3",
      data: [90,65,34,36,86,35],
      color: "#FF4C4F",
    },
    {
      name: "Series 4",
      data: [45,65,34,36,86,35],
      color: "#456DFF",
    },
  ]


  return (
   <>
      {subjects.map(subject=> <Chart title={subject.subject_name}  data={series} months={months}  />)}
    </>
  );
};

export default ClassAnalytics;
