import React from 'react'
import moment from 'moment'

export default (props) => (
  <tr>
    <td><button onClick={props.handleClick}>Open</button></td>
    <td>
      {props.fileName}
      <br></br>
      <span className="result-path">{props.path}</span>
    </td>
    <td>{moment(props.stats.birthtime).format("L")}</td>
    <td>{moment(props.stats.mtime).format("L")}</td>
  </tr>
)