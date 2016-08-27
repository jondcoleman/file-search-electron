import React from 'react'

const Spinner = props => {
  if (props.spin) {
    return (
      <div className="sk-folding-cube">
        <div className="sk-cube1 sk-cube"></div>
        <div className="sk-cube2 sk-cube"></div>
        <div className="sk-cube4 sk-cube"></div>
        <div className="sk-cube3 sk-cube"></div>
      </div>
    )
  }
  return null
}

Spinner.propTypes = {
  spin: React.PropTypes.bool
}

export default Spinner
