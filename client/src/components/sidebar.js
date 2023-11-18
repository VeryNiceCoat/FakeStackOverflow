// import React, { useEffect, useState, Component } from 'react';
import React, {useState} from "react";
const Sidebar = (props) => {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         selected: 'Questions' // Default selected link
    //     };
    // }
    const [selected, setSelected] = useState('Questions');
    //handled in fakestackoverflow.js
    const handleLinkClick = (linkName) => {
        props.onSelect(linkName);
    }

    // render() {
        // const { selected } = this.state;

        const linkStyle = (linkName) => {
            //makes the background color grey for selected tab in  sidebar
            return {
                backgroundColor: selected === linkName ? 'gray' : 'paleturquoise',
                // setSelected(linkName)
            };
        };

        return (
            <div className="sidebar">
                <ul>
                    <li>
                    <button
                        id="Questions"
                        style={linkStyle('Questions')} // Adjust this as necessary for button styling
                        onClick={(e) => {
                            e.preventDefault(); 
                            handleLinkClick('Questions');
                            if (props.onQuestionsClick) {
                                setSelected('Questions');
                                props.onQuestionsClick(); 
                            }
                        }}
                    >
                        Questions
                    </button>
                    </li>
                    <li>
                        <button
                            id="Tags"
                            style={linkStyle('Tags')}
                            onClick={() => {
                                handleLinkClick('Tags');
                                if (props.onTagsPageClick) {
                                setSelected('Tags');
                                props.onTagsPageClick();
                                }
                            }}
                            >
                            Tags
                        </button>
                    </li>
                </ul>
            </div>
        );
    // }
}

export default Sidebar;
