import React, { Component } from 'react'

class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {
      object: props.object,
      model: props.model,
      query: props.query
    }
  }

  handleKeyDown = event => {
    if (event.key === 'Enter') {
      const queryText = event.target.value
      this.props.onSearch(queryText)
    }
  }

  render () {
    return (
      <div id='header'>
        <div>
          USERNAME AREA
        </div>
        <div>
          <button>Logout</button>
          <button>Login</button>
        </div>
        <div className='logo'>FAKE STACK OVERFLOW</div>
        <div className='search-bar'>
          <input
            type='text'
            placeholder='Search...'
            className='search-input'
            id='search-input-'
            onKeyDown={this.handleKeyDown}
          />
        </div>
      </div>
    )
  }
}

export default Header
