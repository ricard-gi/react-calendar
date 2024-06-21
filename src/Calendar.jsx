
import { useState, useEffect } from "react";
import { Button, Table, Form, Row, Col, Container } from 'react-bootstrap';
import Calendar from 'react-calendar';



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

function removeDuplicates(arr) {
  return Array.from(new Set(arr));
}

const fechasInicio = ['2023-04-15', '2023-04-16', '2023-04-18', '2023-04-19']



export default () => {

  const [refresh, setRefresh] = useState(0);
  const [selectedDates, setSelectedDates] = useState(fechasInicio);
  const [selectedDate, setSelectedDate] = useState('');



  const resetFechas = () => {
    setSelectedDate('')
    setSelectedDates(['2023-04-15', '2023-04-16', '2023-04-18', '2023-04-19']);
  }


  const compareArrayStrings = (original, actual) => {
    const removedItems = original.filter(el => actual.indexOf(el) === -1)
    const newItems = actual.filter(el => original.indexOf(el) === -1)
    return [newItems, removedItems];
  }

  const saveDates = () => {

    // check original dates
    const originalDates = dades.map(el => el.date);
    const [newDates, removeDates] = compareArrayStrings(originalDates, selectedDates);

    console.log(newDates, removeDates)
    //... fetch
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
    setSelectedDate(dateStr)
    if (selectedDates.indexOf(dateStr) === -1) {
      //data nova
      setSelectedDates([...selectedDates, dateStr])
    } else {
      const newDates = selectedDates.filter(el => el !== dateStr);
      setSelectedDates(newDates)
    }
  }



  return (<>
    <br />

    <Container>
      <h3>git clone https://ricardhg@bitbucket.org/fundesplai/react-calendar.git</h3>
      <hr />

      <Row>

        <Col>
          <Calendar
            showWeekNumbers
            onClickWeekNumber={handleClickWeekNumber}
            onActiveStartDateChange={handleActiveStartDateChange}
            onChange={handleDateChange}
            showNeighboringMonth={true}
            tileClassName={tileClassName}
          />
          <br />
          {selectedDate}
          <br />
          <Button onClick={resetFechas}>Borrar</Button>
        </Col>
        <Col>
          <ul>
            {selectedDates.map((el, idx) => <li key={idx}>{el}</li>)}
          </ul>
        </Col>
      </Row>


    </Container>

<hr />

  </>)
}

