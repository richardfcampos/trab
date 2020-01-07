import React from 'react'
import styled from 'styled-components'
import { IoIosAirplane } from 'react-icons/io'
import { FaTruck } from 'react-icons/fa'
import { FaThermometerHalf } from 'react-icons/fa'
import { FaRegClock } from 'react-icons/fa'
import { TiLocationOutline } from 'react-icons/ti'

const MyMarker = styled.div`
    position: absolute;
    padding-left: 8px;
    padding-right: 8px;
    height: 24px;
    background-color: #fff6f6;
    border-radius: 25px;
    user-select: none;
    font-size: 20px;
    color: #6e7073;
    position: absolute;
    width: 35px;
    top: -60px;
    left: -30px;
    z-index:99999;
    -webkit-transition-property: width; /* Safari */
    -webkit-transition-duration: 0.01s; /* Safari */
    transition-property: width;
    transition-duration: 0.01s;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    &:hover {
      width: 140px;
      .id-transport {
        transition-duration: 0.01s;  
        visibility: visible;
        position: relative;
        opacity: 1;
        color: blue;
      }
      .dot-status {
        display: none;
      }
      .thermometer, .arrow-location, .clock {
        transition-duration: 0.01s;  
        font-size: 16px;
        margin-right: 2px;
        visibility: visible;
        display: inline-block;
        position: relative;
        top: 4px;
        color: #6e7073;
      }
    }
`

const IdTransport = styled.span`
  position: fixed;
  width: 1px;
  color: #fff;
  bottom: 3px;
  margin-left: 12px;
  font-weight: bold;
  font-size: 9px;
  -webkit-transition: opacity 600ms, visibility 10ms;
  transition: opacity 10ms, visibility 10ms;
  visibility: hidden;
  opacity: 0;
`

const Dot = styled.span`
    height: 5px;
    width: 5px;
    background-color: ${props => props.color};
    border-radius: 50%;
    display: inline-block;
    position: relative;
    left: 6px;
    bottom: 4px;
`

const Truck = styled(FaTruck)`
  float: left;
  font-size: 18px;
  display: inline-block;
  position: relative;
  top: 2px;
`

const Plain = styled(IoIosAirplane)`
  display: inline-block;
  float: left;
  position: relative;
  top: 2px;
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  transform: rotate(-45deg);
`

const Thermometer = styled(FaThermometerHalf)`
  visibility: hidden;
  float: right;
  -webkit-transition: opacity 60ms, visibility 10ms;
  transition: opacity 10ms, visibility 10ms;
`

const ArrowLocation = styled(TiLocationOutline)`
  visibility: hidden;
  float: right;
  -webkit-transition: opacity 60ms, visibility 10ms;
  transition: opacity 10ms, visibility 10ms;
`

const Clock = styled(FaRegClock)`
  visibility: hidden;
  float: right;
  -webkit-transition: opacity 60ms, visibility 10ms;
  transition: opacity 10ms, visibility 10ms;
`


const Marker = (props) => {
    const {  name, id, transport, cargoState } = props;
    const alarmState = getCargoStateColor(cargoState)
    return (
        <MyMarker
            style={{ cursor: 'pointer', display: props.show ? 'block' : 'none' }}
            title={name}
            onMouseEnter={() => props.onMouseEnter()}
            onMouseLeave={() => props.onMouseLeave()}
        >
            { transport === 'flight' && <Plain className="icon-marker" />}
            { transport === 'van' && <Truck className="icon-marker" />}
            <IdTransport className="id-transport">{ id }</IdTransport>
            <Dot className="dot-status" color={ alarmState }/>
            <Clock className="clock" />
            <ArrowLocation className="arrow-location" />
            <Thermometer className="thermometer" />
        </MyMarker>
    );
};

const getCargoStateColor = (state) => {
    switch (state) {
        case 'no alarm':
            return 'green';
        case 'info alarm':
            return 'gray';
        case 'severe alarm':
            return 'red';
        case 'minor alarm':
            return 'orange';
        default:
            return ''

    }

}


export default Marker;