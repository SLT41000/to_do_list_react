import './Calendar.css';
import React, { useState, useEffect } from 'react';
import root from '.';
import API_URL from './api_url';
import logout from './logout';
import List from './List';


export const Calendar = (props) => {
  const [date, setDate] = useState(new Date());
  const [monthRedDayStatus, setMonthRedDayStatus] = useState([]);
  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const handleClick = (e) => {


    if (e.target.textContent === "") {
      return;
    }
    let start_day_time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + e.target.textContent;
    let end_of_day = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + e.target.textContent  + " 23:59:59";

    const data = { UID: sessionStorage.getItem("UID"), firstDayOfMonth: start_day_time, lastDayOfMonth: end_of_day };
    async function fetchData() {
      const response = await fetch(API_URL + "/to_do_list/v3/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const api_data = await response.json();
      try {

        root.render(<List api_data={api_data} date={start_day_time} />)
      }
      catch (error) { console.log("error") };
    }
    fetchData();

  }

  const daysInMonth = [];
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    daysInMonth.push(i);
  }


  useEffect(() => {

    async function fetchStatusMonth() {

      const first_day = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + firstDayOfMonth.getDate();
      const last_day = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + lastDayOfMonth.getDate();
      const data = { UID: sessionStorage.getItem("UID"), firstDayOfMonth: first_day, lastDayOfMonth: last_day };

      const response = await fetch(API_URL + "/to_do_list/v2/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const api_data = await response.json();
      const tmp = api_data.map(item => {
        const dateStr = item.marktime;
        const dateArr = dateStr.split("T"); // split string at "T"
        const dayArr = dateArr[0].split("-"); // split date string at "-"
        const day = dayArr[2]; // extract day from date array
        return day;
      });
      setMonthRedDayStatus(tmp);

    }
    fetchStatusMonth();

  }, [date])



  const returncolortd = (i, j, day) => {

    if (day != null) {

      day = day.toString();
      if (day.length === 1) {
        day = '0' + day
      }


    } else {
      return <td className='rounded-full hover:bg-gray-700' onClick={handleClick} key={`${i}-${j}`}>{day}</td>
    }



    if (monthRedDayStatus.includes(day)) {
      return <td className='bg-white rounded-full hover:bg-gray-700' onClick={handleClick} key={`${i}-${j}`}>{day}</td>
    } else {
      return <td className='rounded-full hover:bg-gray-700' onClick={handleClick} key={`${i}-${j}`}>{day}</td>
    }

  }




  const blanksBeforeFirstDay = firstDayOfMonth.getDay();
  const blanksAfterLastDay = 6 - lastDayOfMonth.getDay();

  const totalDaysToShow = daysInMonth.length + blanksBeforeFirstDay + blanksAfterLastDay;

  const weeks = [];
  let week = [];

  for (let i = 0; i < totalDaysToShow; i++) {
    if (i < blanksBeforeFirstDay || i >= daysInMonth.length + blanksBeforeFirstDay) {
      week.push(null);
    } else {
      week.push(daysInMonth[i - blanksBeforeFirstDay]);
    }

    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  const prevMonth = async () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));


  };

  const nextMonth = async () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));


  };

  return (
    <div>"
      <div class="calendar">
        <div className=" w-[28rem] text-center">
          <div className="w-11/12 h-max m-auto mt-9 mb-5 py-5 px-2 bg-pink-300 rounded-lg drop-shadow-sm">
            <div className=" inline">
              <button className="bg-pink-200 hover:text-white text-gray-600 text-xl font-bold py-2 px-5 rounded-full drop-shadow-sm" onClick={prevMonth}>{'<'}</button>
              <p2 className="px-10 font-bold text-2xl text-gray-800 drop-shadow">{monthNames[date.getMonth()]} {date.getFullYear()}</p2>
              <button className="bg-pink-200 hover:text-white text-gray-600 text-xl font-bold py-2 px-5 rounded-full drop-shadow-sm" onClick={nextMonth}>{'>'}</button>
            </div>

            <div className=" bg-pink-200 w-45 h-0.5 my-5 drop-shadow-sm rounded-full"></div>

            <table>
              <thead >
                <tr>
                  {weekdays.map(day => <th key={day}>{day}</th>)}
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, i) => (

                  <tr key={i}>
                    {week.map((day, j) => (

                      returncolortd(i, j, day)
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div dir="rtl" className='w-full' onClick={logout}>
            <button className="bg-pink-200 hover:text-white text-gray-600 text-xl font-bold py-2 px-5 w-4/5 rounded-full drop-shadow-sm">log out</button>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Calendar;