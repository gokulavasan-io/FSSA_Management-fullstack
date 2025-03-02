import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { fetchDailyStatistics } from '../../../../api/attendanceAPI';
import { useMainContext } from '../../../../Context/MainContext';
import useAttendanceContext from "../../../../Context/AttendanceContext";
import { Modal } from 'antd';

const DailyStatistics = () => {
  const {
    monthId,
    loading,
    setLoading,dailyStatisticsVisible,setDailyStatisticsVisible,
  } = useAttendanceContext();
  const {sectionId,year}= useMainContext()
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  
  const fetchData = async () => {
    try {
        setLoading(true);
        const response = await fetchDailyStatistics(sectionId, monthId, year);
        
        setColumns(response.columns.map(col => ({
            field: col,
            headerName: col.charAt(0).toUpperCase() + col.slice(1),
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            sortable: col !== "date" && col !== "day"
        })));

        setData(response.data);
    } catch (error) {
        console.error('API Error:', error);
    } finally {
        setLoading(false);
    }
};

  

  useEffect(() => {
    fetchData();
  }, [sectionId, monthId, year]);

  return (
    <Modal
         open={dailyStatisticsVisible}
         onCancel={() => setDailyStatisticsVisible(false)}
         footer={null}
         centered
         title={"Daily Statistics"}
         zIndex={100003}
         width={1300}
        >
          <DataGrid
            rows={data}
            columns={columns.map(col => ({ ...col, resizable: false }))}
            pagination={false}
            hideFooter={true}
            disableColumnMenu
            rowHeight={30}
            loading={loading}
            getRowId={(row) => row.date}
            sx={{
              width: "100%",
              height: "600px",
              overflow: "hidden",
              marginTop: "1rem",
            }}
          />
    </Modal>
  );
};

export default DailyStatistics;
