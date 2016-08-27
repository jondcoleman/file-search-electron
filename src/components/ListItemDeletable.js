import React from 'react'

export default (props) => (
  <div className="list-item-deletable">
    <span className="delete-character" onClick={e => props.handleClick(e, props.pathType, props.text)}>{'\u2716'}</span>
    {props.text}
  </div>
)