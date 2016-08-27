import React from 'react'
import moment from 'moment'
import {shell} from 'electron'

export default (props) => (
  <tr>
    <td><button onClick={() => shell.openItem(props.file)}>Open</button></td>
    <td>
      {props.fileName}
      <br></br>
      <span className="result-path">{props.path}</span>
    </td>
    <td>{moment(props.stats.birthtime).format("L")}</td>
    <td>{moment(props.stats.mtime).format("L")}</td>
  </tr>
)