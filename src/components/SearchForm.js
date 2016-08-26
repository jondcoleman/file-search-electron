import React from 'react'

export default (props) => (
  <form onSubmit={props.handleSubmit}>
    <div className="col-10">
      <input
        type="text"
        placeholder="search for file"
        value={props.searchValue}
        onChange={props.handleChange}
      />
    </div>
    <div className="col-2">
      <input type="submit" disabled={props.disabled}/>
    </div>
  </form>
)