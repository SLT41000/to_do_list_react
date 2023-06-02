import root from ".";

import API_URL from "./api_url";
import List from "./List";
import React from 'react';
const  List_reload= (day) => {
        let start_day_time = day
        let end_of_day= day+" 23:59:59";
        const data = { UID: sessionStorage.getItem("UID"), firstDayOfMonth: start_day_time, lastDayOfMonth: end_of_day };
        async function fetchData() {
         const response = await fetch(API_URL+"/to_do_list/v3/", {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(data)
           });
         const api_data = await response.json();
         
         try{
         
         root.render(<List api_data={api_data} date={start_day_time}/>) 
         
         }
         catch(error){console.log("hello")};
       }
       setTimeout(function() {
        
        fetchData();
        
      }, 20);
}
export default List_reload ;