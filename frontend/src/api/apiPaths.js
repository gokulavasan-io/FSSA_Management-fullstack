// paths.js
const API_PATHS = {
    GET_STUDENTS_NAME: 'http://localhost:8000/students/studentsName/',
    GET_STUDENTS_DATA: "http://localhost:8000/students/studentsData/",
    POST_STUDENTS_DATA: "http://localhost:8000/students/studentsData/",
    GET_SECTIONS:"http://localhost:8000/students/sections/",

    // for normal tests
    POST_MARK: "http://127.0.0.1:8000/marks/add_mark/",
    GET_MARK: "http://127.0.0.1:8000/marks/get_mark/",
    UPDATE_MARK: "http://127.0.0.1:8000/marks/update_mark/",
    FETCH_MONTHS:"http://127.0.0.1:8000/marks/fetch_months/",
    FETCH_SUBJECTS:"http://127.0.0.1:8000/marks/fetch_subjects/",

  // for level test
    GET_LEVEL: "http://127.0.0.1:8000/marks/get_level_mark/",
    UPDATE_LEVEL: "http://127.0.0.1:8000/marks/update_level_mark/",

    GET_TEST_DETAILS:'http://127.0.0.1:8000/marks/get_all_test_details/',
    UPDATE_ARCHIVE: "http://127.0.0.1:8000/marks/update_archive/",
    GET_ALL_DATA: "http://127.0.0.1:8000/marks/get_all_test_data/",
  
    GET_ALL_TEST_DETAILS:'http://127.0.0.1:8000/marks/tests/',
    DELETE_TEST:"http://127.0.0.1:8000/marks/tests/",
    UPDATE_TEST:"http://127.0.0.1:8000/marks/tests/",
    

    FETCH_USER_DATA:"http://127.0.0.1:8000/member/"
  };
  
export default API_PATHS;



export const ATTENDANCE_API_ENDPOINTS={
    ATTENDANCE_DATA:"http://127.0.0.1:8000/attendance/attendance/",
    REMARK:'http://127.0.0.1:8000/attendance/remarks/',
    HOLIDAY:'http://127.0.0.1:8000/attendance/holidays/',
    CHECK_HOLIDAY:'http://127.0.0.1:8000/attendance/check_holiday/',
    FETCH_STUDENT_STATISTICS:'http://127.0.0.1:8000/attendance/fetch_student_statistics/',
    FETCH_DAILY_STATISTICS:'http://127.0.0.1:8000/attendance/fetch_daily_statistics/',

}

export const HOME_API_ENDPOINTS={
    ATTENDANCE_REPORT:"http://127.0.0.1:8000/home/attendance-report/",
    MONTHLY_REPORT:"http://127.0.0.1:8000/home/monthly-analytics/",
    SUBJECT_REPORT:"http://127.0.0.1:8000/home/subject-analytics/",


}

export const REPORT_API_ENDPOINTS={
      MONTHLY_REPORT:"http://127.0.0.1:8000/report/scores/"
}