import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import DefaultLayout from '../components/DefaultLayout'
import { getAllCars } from '../redux/actions/carsActions'
import { Col, Row, Divider, DatePicker, Checkbox } from 'antd'
import { Link } from 'react-router-dom'
import Spinner from '../components/Spinner';
import moment from 'moment'
import { faCarSide, faCarRear, faCar, faBus, faLocationDot, faCalendarDays, faBed } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "./home.css"
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { format } from "date-fns"


const { RangePicker } = DatePicker
function Home() {

    const [opendate, setOpendate] = useState(false);
    const [date, setDate] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    const [openOptions, setOpenOptions] = useState(false)
    const [options, setOptions] = useState({
        adult: 1,
        children: 0,
        rooms: 1
    })

    const handleOption = (name, operation) => {
        setOptions(prev => {
            return {
                ...prev, [name]: operation === "i" ? options[name] + 1 : options[name] - 1
            }
        })
    }

    const { cars } = useSelector(state => state.carsReducer)
    const { loading } = useSelector(state => state.alertsReducer)
    const [totalCars, setTotalcars] = useState([])
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(getAllCars())
    }, [])

    useEffect(() => {

        setTotalcars(cars)

    }, [cars])


    function setFilter(values) {

        var selectedFrom = moment(values[0], 'MMM DD yyyy HH:mm')
        var selectedTo = moment(values[1], 'MMM DD yyyy HH:mm')

        var temp = []

        for (var car of cars) {

            if (car.bookedTimeSlots.length == 0) {
                temp.push(car)
            }
            else {

                for (var booking of car.bookedTimeSlots) {

                    if (selectedFrom.isBetween(booking.from, booking.to) ||
                        selectedTo.isBetween(booking.from, booking.to) ||
                        moment(booking.from).isBetween(selectedFrom, selectedTo) ||
                        moment(booking.to).isBetween(selectedFrom, selectedTo)
                    ) {

                    }
                    else {
                        temp.push(car)
                    }

                }

            }

        }


        setTotalcars(temp)


    }

    return (
        <DefaultLayout>


            <div className="header">
                <div className="headerContainer">
                    <div className="headerlist">
                        <div className="headerlistitems">
                            <FontAwesomeIcon icon={faCar} />
                            <span>Sedan</span>
                        </div>
                        <div className="headerlistitems">
                            <FontAwesomeIcon icon={faCarSide} />
                            <span>SUV</span>
                        </div>
                        <div className="headerlistitems">
                            <FontAwesomeIcon icon={faCarRear} />
                            <span>Luxury</span>
                        </div>
                        <div className="headerlistitems">
                            <FontAwesomeIcon icon={faBus} />
                            <span>MUV</span>
                        </div>
                    </div>
                    <h1 className="headertitle">
                        Book your Car now!
                    </h1>
                    <p className="headerDesc">
                        With a alot of Discounts and savings upto 30% and more..
                    </p>
                    <Link to="/login">
                    <button className="signin">
                        SignIn/Register
                    </button>
                    </Link>
                    <div className="headerSearch">
                        <div className="headerSearchItem">
                            <FontAwesomeIcon icon={faLocationDot} />

                            <input type="text" className='headersearchinput' placeholder='Search Cars or Brands Eg.Tata'></input>
                        </div>
                        <div className="headerSearchItem">
                            <FontAwesomeIcon icon={faCalendarDays} />

                            <span classname="headersearchtext" onClick={() => setOpendate(!opendate)}>
                                {`${format(date[0].startDate, "dd/MM/yyyy")} to 
                            ${format(date[0].endDate, "dd/MM/yyyy")}`}</span>
                            {opendate && <DateRange
                                editableDateInputs={true}
                                onChange={item => setDate([item.selection])}
                                moveRangeOnFirstSelection={false}
                                ranges={date}
                                className="date"
                            />}
                        </div>
                        <div className="headerSearchItem">
                            <FontAwesomeIcon icon={faBed} />
                            <span onClick={() => setOpenOptions(!openOptions)} className='headersearchtext'>{`${(options.adult)} Adults - ${(options.children)} Children - ${(options.rooms)} Cars`}</span>
                            {openOptions && <div className="options">
                                <div className="optionsitem" >

                                    <span className='optiontext'> Adult </span>
                                    <div className="optioncounter">
                                        <button className='optioncounterbutton' disabled={options.adult <= 1} onClick={() => { handleOption("adult", "d") }}>-</button>
                                        <span className='optioncounterbutton'>{options.adult}</span>
                                        <button className='optioncounterbutton' onClick={() => { handleOption("adult", "i") }}>+</button>
                                    </div>
                                </div>

                                <div className="optionsitem">

                                    <span className='optiontext'> Children </span>
                                    <div className="optioncounter">
                                        <button className='optioncounterbutton' disabled={options.children <= 0} onClick={() => { handleOption("children", "d") }}>-</button>
                                        <span className='optioncounterbutton'>{options.children}</span>
                                        <button className='optioncounterbutton' onClick={() => { handleOption("children", "i") }}>+</button>
                                    </div>

                                </div>

                                <div className="optionsitem">


                                    <span className='optiontext'> Cars </span>
                                    <div className="optioncounter">
                                        <button className='optioncounterbutton' disabled={options.rooms <= 1} onClick={() => { handleOption("rooms", "d") }}>-</button>
                                        <span className='optioncounterbutton'>{options.rooms}</span>
                                        <button className='optioncounterbutton' onClick={() => { handleOption("rooms", "i") }}>+</button>
                                    </div>

                                </div>
                            </div>
                            }
                        </div>
                        <div className="headerBtn">Search</div>
                    </div>
                </div>
            </div>



            {loading == true && (<Spinner />)}



            <Row justify='center' gutter={16}>

                {totalCars.map(car => {
                    return <Col lg={5} sm={24} xs={24}>
                        <div className="car p-2 bs1">
                            <img src={car.image} className="carimg" />

                            <div className="car-content d-flex align-items-center justify-content-between">

                                <div className='text-left pl-2'>
                                    <p>{car.name}</p>
                                    <p> Rent Per Hour {car.rentPerHour} /-</p>
                                </div>

                                <div>
                                    <button className="btn1 mr-2"><Link to={`/booking/${car._id}`}>Book Now</Link></button>
                                </div>

                            </div>
                        </div>
                    </Col>
                })}

            </Row>

        </DefaultLayout>
    )
}

export default Home