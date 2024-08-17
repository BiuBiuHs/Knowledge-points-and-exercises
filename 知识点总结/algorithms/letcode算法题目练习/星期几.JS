/**
 * @param {number} day
 * @param {number} month
 * @param {number} year
 * @return {string}
 */

function isLeapYear  (num) {
    if(num % 400 ==0){
        return true 
    }
    if(num % 4 ==0 && num % 100 !=0){
        return true
    }else{
        return false
    }
}
function theDayOfYear (year){
    if(isLeapYear(year)){
        return 366
    }else{
        return 365
    }
}
var dayOfTheWeek = function (day ,month , year) {
    var sum = 0;
    let start = 4;
    let yearMonth = [31,28,31,30,31,30,31,31,30,31,30,31]
    let dayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
   
    for (var i = 0 ;i <  year - 1971 ; i++ ){
        sum += theDayOfYear(1971 + i)
    }
    for (var x = 1 ; x < month ;x++){
        if(x ==2 && isLeapYear(year)){
            sum += 29
        }else{
            sum +=yearMonth[x-1]
        }
       
    }
    return dayArr[(sum + start +day )%7]
}