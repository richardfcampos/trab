import React from 'react'
import MyMap from '../../containers/MyMap/'

const CargoMap = (props) => {
    return (
        <div style={props.style}>
            <h1 style={{marginLeft:'50px'}}>Cargo Sense</h1>
            <MyMap />
        </div>
    )
}

export default CargoMap