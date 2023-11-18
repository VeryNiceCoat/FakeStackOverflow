import React, { Component } from 'react';
// import Query from './objectForSearching';

/**
 * Header for the entire thing
 */
class Header extends Component {
    constructor(props) {
        super(props);
        
        // Initialize state with object and model from props
        this.state = { 
            object: props.object,
            model: props.model,
            query: props.query,
        };
    }

    /**
     * Search Bar does not work and idk how to make it work
     * @param {Enter Key} event 
     */
    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            const queryText = event.target.value;
            this.props.onSearch(queryText); // Propagate the search query to the parent component
        }
    }

    render() {
        return (
            <div id="header">
                <div className="logo">
                    FAKE STACK OVERFLOW
                </div>
                <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="search-input" 
                        id="search-input-" 
                        onKeyDown={this.handleKeyDown}
                    />
                </div>
            </div>
        );
    }
}

export default Header;
