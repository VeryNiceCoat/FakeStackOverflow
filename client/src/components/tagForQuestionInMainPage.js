// import React, {Component} from "react";
import React from "react";
// import Query from "./objectForSearching";

const TagForQuestionInMainPage =({tag, onhandleTagOnMainPageClicked}) => {

    const handleTagClick = (event) => {
        event.preventDefault();
        onhandleTagOnMainPageClicked('['+tag.name+']');
    }

    // render() {
        return (
            <button className="tag-type" onClick={handleTagClick}>{tag.name}</button>
        )
    // }
}

export default TagForQuestionInMainPage;
