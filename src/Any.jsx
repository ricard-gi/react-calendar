import { useState } from "react";
import { Button, Table, Row, Col } from 'react-bootstrap';
import Calendar from 'react-calendar';


const fechasInicio = ['2023-04-15', '2023-04-16', '2023-04-18', '2023-04-19']




const yyyymmdd = (date) => `${date.getFullYear()}-${('00' + (date.getMonth() + 1)).slice(-2)}-${('00' + (date.getDate())).slice(-2)}`;

function getDatesOfWeek(firstDayOfWeek) {
    const dates = [];
    const dayInMillis = 86400000; // number of milliseconds in a day
    for (let i = 0; i < 7; i++) {
        const date = new Date(firstDayOfWeek.getTime() + i * dayInMillis);
        dates.push(date);
    }
    return dates;
}

//dayX és 0 per diumenge, 1 dilluns i anar fent
function getDaysXOfYear(dayX, year) {
    const firstDayOfYear = new Date(year+'-1-1')
    const dayInMillis = 86400000; // number of milliseconds in a day
    let dayToCheck = new Date(firstDayOfYear.getTime())
    const dates = [];
    let t = 0;
    while (dayToCheck.getFullYear()===year){
        if (dayToCheck.getDay()===dayX){
            dates.push(yyyymmdd(dayToCheck))
        }
        t++;
        dayToCheck = new Date(firstDayOfYear.getTime() + t * dayInMillis);
    }
    return dates;
}


function removeDuplicates(arr) {
    return Array.from(new Set(arr));
}

function getQuarters(year) {
    let month = 1;
    return [
        [`${year}-${month++}`, `${year}-${month++}`, `${year}-${month++}`],
        [`${year}-${month++}`, `${year}-${month++}`, `${year}-${month++}`],
        [`${year}-${month++}`, `${year}-${month++}`, `${year}-${month++}`],
        [`${year}-${month++}`, `${year}-${month++}`, `${year}-${month++}`],
    ]
}


export default () => {


    const id = 1; //calendar ID

    const [year, setYear] = useState((new Date()).getFullYear());
    const [dades, setDades] = useState(fechasInicio);
    const [calendar, setCalendar] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const [selectedDates, setSelectedDates] = useState(fechasInicio);
    const [selectedDate, setSelectedDate] = useState('');


    if (!dades) {
        return <h3>Loading...</h3>
    }

    function resetDates(){
        setSelectedDates(dades)
    }

    function clearDates(){
        setSelectedDates([])
    }

    const compareArrayStrings = (original, actual) => {
        const removedItems = original.filter(el => actual.indexOf(el) === -1)
        const newItems = actual.filter(el => original.indexOf(el) === -1)
        return [newItems, removedItems];
    }

    const saveDates = () => {

    }



    function tileClassName({ date, view }) {
        if (view === 'month') {
            const dateStr = yyyymmdd(date)
            if (selectedDates.includes(dateStr)) {
                return "highlighted-date";
            }
        }
        return null
    }

    function handleActiveStartDateChange(ev) {
        console.log("canvi de mes", yyyymmdd(ev.activeStartDate))
    }

    function handleClickWeekNumber(weekNumber, date) {
        console.log(weekNumber, date)
        const dateStr = yyyymmdd(date)
        let addDates = false
        if (selectedDates.indexOf(dateStr) === -1) {
            //all row clicked
            addDates = true;
        }

        let fullweek = getDatesOfWeek(date).map(e => yyyymmdd(e))
        if (addDates) {
            setSelectedDates(removeDuplicates([...selectedDates, ...fullweek]))
        } else {
            setSelectedDates([...selectedDates].filter(e => fullweek.indexOf(e) === -1))
        }
    }

    function handleDateChange(date) {
        const dateStr = yyyymmdd(date)
        if (selectedDates.indexOf(dateStr) === -1) {
            //data nova
            setSelectedDates([...selectedDates, dateStr])
        } else {
            const newDates = selectedDates.filter(el => el !== dateStr);
            setSelectedDates(newDates)
        }
    }


    function clicaDia(d){
        let elDia = ['DL','DT','DC','DJ','DV','DS','DG'].indexOf(d) +1 ;
        if (elDia === 7) elDia=0;
        // ara el dia és DG=0, fins a 7
        // Fem que tots els dies X de l'any quedin marcats
        const elsDies = getDaysXOfYear(elDia,year);
        //primer treiem, després afegim
        let lesDates = [...selectedDates];
        lesDates = lesDates.filter(el => elsDies.indexOf(el)===-1)
        lesDates = [...lesDates, ...elsDies]
        setSelectedDates(lesDates)

    }



    return (<>
        <br />

        <h1>{`Bookings for ${year}`}</h1>
        <br />
        {['DL','DT','DC','DJ','DV','DS','DG'].map((el, idx) => <Button variant="outline-primary" className="btn-dies" onClick={()=>clicaDia(el)} key={idx}>{el}</Button>)}
       
        <Button  className="btn-dies" variant="success" onClick={saveDates} >Save</Button>
        <Button  className="btn-dies" variant="primary" onClick={resetDates} >Reset</Button>
        <Button  className="btn-dies" variant="danger" onClick={clearDates} >Clear</Button>
        <Button  className="btn-dies" variant="outline-danger" onClick={()=>setYear(year-1)} >Year -</Button>
        <Button  className="btn-dies" variant="outline-danger" onClick={()=>setYear(year+1)} >Year +</Button>

        <br />
        <br />
        {getQuarters(year).map((q, idxq) => {
            return (<Row className="calendar-row" key={idxq}>
                {q.map((el, idx) => {
                    return (
                        <Col key={idx}>
                            <Calendar
                                showWeekNumbers
                                onClickWeekNumber={handleClickWeekNumber}
                                onActiveStartDateChange={handleActiveStartDateChange}
                                onChange={handleDateChange}
                                showNeighboringMonth={false}
                                tileClassName={tileClassName}
                                showNavigation={true}
                                activeStartDate={new Date(el + '-01')}
                                minDetail="month"
                                nextLabel=''
                                prevLabel=''
                                prev2Label=''
                                next2Label=''
                            />
                        </Col>
                    )
                })}
            </Row>)
        })}



    </>)
}