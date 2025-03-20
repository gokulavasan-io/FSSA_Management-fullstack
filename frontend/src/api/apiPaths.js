// paths.js
const API_PATHS = {
    GET_STUDENTS_NAME: '/students/studentsName/',
    GET_STUDENTS_DATA: "/students/studentsData/",
    POST_STUDENTS_DATA: "/students/studentsData/",
    GET_SECTIONS:"/students/sections/",

    // for normal tests
    POST_MARK: "/marks/add_mark/",
    GET_MARK: "/marks/get_mark/",
    UPDATE_MARK: "/marks/update_mark/",
    FETCH_MONTHS:"/marks/fetch_months/",
    FETCH_SUBJECTS:"/marks/subjects/",

  // for level test
    GET_LEVEL: "/marks/get_level_mark/",
    UPDATE_LEVEL: "/marks/update_level_mark/",

    GET_TEST_DETAILS:'/marks/get_all_test_details/',
    UPDATE_ARCHIVE: "/marks/update_archive/",
    GET_ALL_DATA: "/marks/get_all_test_data/",
  
    GET_ALL_TEST_DETAILS:'/marks/tests/',
    DELETE_TEST:"/marks/tests/",
    UPDATE_TEST:"/marks/tests/",
    

    FETCH_USER_DATA:"/member/"
  };
  
export default API_PATHS;



export const ATTENDANCE_API_ENDPOINTS={
    ATTENDANCE_DATA:"/attendance/attendance/",
    REMARK:'/attendance/remarks/',
    HOLIDAY:'/attendance/holidays/',
    CHECK_HOLIDAY:'/attendance/check_holiday/',
    FETCH_STUDENT_STATISTICS:'/attendance/fetch_student_statistics/',
    FETCH_DAILY_STATISTICS:'/attendance/fetch_daily_statistics/',

}

export const HOME_API_ENDPOINTS={
    ATTENDANCE_REPORT:"/home/attendance-report/",
    MONTHLY_REPORT:"/home/monthly-analytics/",
    SUBJECT_REPORT:"/home/subject-analytics/",


}

export const REPORT_API_ENDPOINTS={
      MONTHLY_REPORT:"/report/scores/"
}