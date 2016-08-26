// import {h, render} from 'preact'
import db from './db'
import walk from './utils/walk'
import React, {Component} from 'react'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'
import {render} from 'react-dom'
import SearchForm from './components/SearchForm'
import {shell, remote} from 'electron'
import getConfig from './utils/getConfig'
import setConfig from './utils/setConfig'
const dialog = remote.dialog
import {VelocityTransitionGroup, VelocityComponent} from 'velocity-react'

class App extends Component {
  constructor() {
    super()

    this.index = this.index.bind(this)
    this.handleSearchValueChange = this.handleSearchValueChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleAddPath = this.handleAddPath.bind(this)
    this.updateConfig = this.updateConfig.bind(this) 

    this.state = {
      currentFile: '',
      indexCount: 0,
      msg: null,
      searchValue: '',
      queryResults: [],
      config: {
        indexPaths: [],
        ignoredPaths: []
      }
    }
  }
  componentWillMount(){
    this.updateConfig()
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-6">
            <h3>Paths to Index</h3>
            <ul>
              {this.state.config.indexPaths.map((path, i) => <li key={i}>{path}</li>)}
            </ul>
          </div>
          <div className="col-6">
            <h3>Paths to Ignore</h3>
            <ul>
              {this.state.config.ignoredPaths.map((path, i) => <li key={i}>{path}</li>)}
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <button className="btn btn-outline-inverted" onClick={e => this.handleAddPath(e, 'index')}>Add Path</button>
          </div>
          <div className="col-6">
            <button className="btn btn-outline-inverted" onClick={e => this.handleAddPath(e, 'ignored')}>Add Path</button>
            <button id="rebuild-index" onClick={this.index} >Rebuild Index</button>
          </div>
        </div>
        <br/>
        <hr/>
        <div className="row">
          <p>{this.state.currentFile}</p>
          <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
            {this.state.msg ? <p key={1}>{this.state.msg}</p> : null}
          </VelocityTransitionGroup>
          <SearchForm
            searchValue={this.state.searchValue}
            handleChange={this.handleSearchValueChange}
            handleSubmit={this.handleSubmit}
            disabled={this.state.searchValue.length < 3}
          />
          {this.state.queryResults.map((result, i) => {
            const str = JSON.stringify(result, null, 2)
            console.log(str)
            return <pre key={i} onClick={() => shell.openItem(result.file)}>{str}</pre>
          })}
        </div>
      </div>
    )
  }

  index() {
    const handleEntry = (entry, stat, count) => this.setState({currentFile: entry, indexCount: count})
    const handleError = (err, entry, stat) => this.setState({msg: err})
    const handleEnd = (count, elapsedTime, files) => {
      this.setState({msg: 'Adding to database'})
      db.files
        .toCollection()
        .delete()
        .then(() => db.files.bulkAdd(files))
        .then(() => db.files.count((num) => console.log(num)))
      this.setState({
        currentFile: '',
        msg: `Found ${count} entries.  Indexing took ${elapsedTime} minutes`
      })
      setTimeout(() => this.setState({msg: null}), 2000)
    }
    walk(handleEntry, handleError, handleEnd)
  }

  handleSearchValueChange(e) {
    e.preventDefault()
    this.setState({ searchValue: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()
    const query = this.state.searchValue.toLowerCase()
    db.table('files')
      .toCollection()
      .filter(obj => {
        if (obj.file.toLowerCase().indexOf(query) >= 0) return true
      })
      .toArray()
      .then((data) => {
        const result = data.map((obj) => {
          obj.stats = JSON.parse(obj.stats)
          return obj
        })
        console.log(result[0])
        console.log(JSON.stringify(result[0], null, 2))
        this.setState({ queryResults: result })
      })
  }

  handleAddPath(e, pathType) {
    e.preventDefault()
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }, (filesArr) => {
      const method = pathType === 'index' ? setConfig.addIndexPath : setConfig.addIgnoredPath
      method(filesArr[0], () => {
        this.updateConfig()
      })
    })
  }

  updateConfig() {
    getConfig((config) => {
      this.setState({ config })
    })
  }
}

render(<App />, document.getElementById('app'))