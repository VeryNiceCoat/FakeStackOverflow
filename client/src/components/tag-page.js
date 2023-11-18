import React, { useState, useEffect } from 'react';
import Tag from './tag';
import Axios from 'axios';

/**
 * Tag Page, UI broken AFAIK
 */
const TagPage = (props) => {
        // const model = this.props.model;
    const questions = props.questions;
    const onSearch = props.onSearch;
    const onhandleTagonTagPageClicked = props.handleTagonTagPageClicked;
    const [allTags, setAllTags] = useState([]);
    // const [tagCollection, setTagCollection] = useState([]);
    useEffect(() => {
        const fetchAllTags = async() => {
        try {
            const res = 
                await Axios.get(`http://localhost:8000/tags`);
                setAllTags(res.data);
            } catch (error) {
                console.error("error fetching tags in components/tag-page.js", error)
            }  
        }
        fetchAllTags();
    }, [])
    // const {model} = this.props;
    /**
     * For every tag present, pushes it to the array
     * @returns Array of React Pages
     */
    function temm() {
        let components = [];
        for (let tag of allTags) {
            components.push(<Tag 
                                key={tag._id} 
                                tag={tag}
                                questions = {questions} 
                                onSearch={onSearch} 
                                onhandleTagonTagPageClicked={onhandleTagonTagPageClicked} 
                            />)
        }
        return components;
    }

    return (
        <div id="tagPageContainer">
            <div id="subheader">
                <h5 id="tagCount">{allTags.length} Tags</h5>
                <h4 id="allTags">All Tags</h4>
                <button id="askQuestionBtn" className="ask-q" onClick={props.onAskQuestion}>Ask Question</button>
            </div>
            <div id="tagCollection">
                {temm()}
            </div>
        </div>  
    );
}

export default TagPage;